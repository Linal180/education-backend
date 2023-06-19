import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { User, UserStatus } from './entities/user.entity';
import { Repository, Not, In, Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserInput } from './dto/register-user-input.dto';
import { Role, UserRole } from './entities/role.entity';
import { UsersPayload } from './dto/users-payload.dto';
import UsersInput from './dto/users-input.dto';
import { AccessUserPayload } from './dto/access-user.dto';
import { PaginationService } from '../pagination/pagination.service';
import { UserPayload } from './dto/register-user-payload.dto';
import { SearchUserInput } from './dto/search-user.input';
import { UpdatePasswordInput } from './dto/update-password-input';
import { createPasswordHash } from '../lib/helper';
import { AwsCognitoService } from '../cognito/cognito.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { EveryActionService } from '../everyAction/everyAction.service';
import { DataSource } from 'typeorm';
import { subjectAreasService } from '../subjectArea/subjectAreas.service';
import { GradesService } from '../Grade/grades.service';
import { HttpService } from '@nestjs/axios';
import { LoginUserInput } from './dto/login-user-input.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly organizationsService: OrganizationsService,
    private connection: Connection,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly gradeService: GradesService,
    private readonly subjectAreaService: subjectAreasService,
    private readonly paginationService: PaginationService,
    private readonly cognitoService: AwsCognitoService,
    private readonly httpService: HttpService,
    // private readonly userEveryActionService: userEveryActionService
    @Inject(forwardRef(() => EveryActionService))
    private everyActionService: EveryActionService,
  ) { }

  /**
   * Creates users service
   * @param registerUserInput
   * @returns created user
   */
  async create(registerUserInput: RegisterUserInput): Promise<User> {
    try {
      const {
        email: emailInput,
        password: inputPassword,
        firstName,
        lastName,
        country,
        zip,
        category,
        nlnOpt,
        siftOpt,
        organization,
        grades,
        subjectAreas,
      } = registerUserInput;

      const email = emailInput?.trim().toLowerCase();

      const existingUser = await this.findOne(email, true);
      if (existingUser) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: "User already exists",
        });
      }

      const generatedUsername = await this.generateUsername(firstName, lastName)
      // create user on AWS Cognito
      const cognitoResponse = await this.cognitoService.createUser(
        generatedUsername, email, inputPassword
      )

      const userInstance = this.usersRepository.create({
        email,
        emailVerified: true,
        status: 1,
        country,
        firstName,
        lastName,
        username: generatedUsername,
        password: inputPassword,
        zip,
        category,
        nlnOpt,
        siftOpt,
        awsSub: this.cognitoService.getAwsUserSub(cognitoResponse)
      });

      const role = await this.rolesRepository.findOne({
        where: { role: UserRole.EDUCATOR },
      });

      userInstance.roles = [role];

      //associate user to organization
      if (organization) {
        userInstance.organization = await this.organizationsService.findOneOrCreate(organization)
      }

      //associate user to grade-levels
      if (grades.length) {
        const gradeLevels = await Promise.all(
          grades.map(async (name) => {
            return await this.gradeService.findOneOrCreate({ name });
          })
        )

        userInstance.gradeLevel = gradeLevels;
      }

      //associate user to subjectAreas
      if (subjectAreas.length) {
        const userSubjectAreas = await Promise.all(
          subjectAreas.map(async (name) => {
            return await this.subjectAreaService.findOneOrCreate({ name });
          })
        );

        userInstance.subjectArea = userSubjectAreas;
      }

      const user = await this.usersRepository.save(userInstance);
      // Send User role to cognito
      this.mapUserRoleToCognito(user);
      // EveryAction User send
      this.sendUserToEveryAction(user, grades, subjectAreas)
      
      return user;
    } catch (error) {
      if (error.name === 'ForbiddenException') {
        throw new ForbiddenException(error);
      }

      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Finds all
   * @param usersInput
   * @returns paginated users results
   */
  async findAll(usersInput: UsersInput): Promise<UsersPayload> {
    try {
      const paginationResponse =
        await this.paginationService.willPaginate<User>(this.usersRepository, {
          ...usersInput,
          associatedTo: "Roles",
          relationField: "roles",
          associatedToField: {
            columnValue: usersInput.roles,
            columnName: "role",
            filterType: "enumFilter",
          },
        });
      return {
        pagination: {
          ...paginationResponse,
        },
        users: paginationResponse.data,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async search(searchUserInput: SearchUserInput): Promise<User[]> {
    const { searchTerm, roles } = searchUserInput;
    const [first, last] = searchTerm.split(" ");
    const result = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "roles")
      .where("user.firstName ILIKE :searchTerm AND roles.role IN (:...roles)", {
        searchTerm: `%${first}%`,
        roles,
      })
      .orWhere(
        "user.lastName ILIKE :searchTerm AND roles.role IN (:...roles)",
        { searchTerm: `%${last}%`, roles }
      )
      .orWhere("user.email ILIKE :searchTerm AND roles.role IN (:...roles)", {
        searchTerm: `%${first}%`,
        roles,
      })
      .getMany();
    return result;
  }

  /**
   * Finds User by Email
   * @param email
   * @returns one user
   */
  async findOne(email: string, all = false): Promise<User> {
    const condition = { email, status: UserStatus.ACTIVE };
    all && delete condition.status;
    return await this.usersRepository.findOne({ where: condition });
  }

  /**
   * Finds User by id
   * @param id
   * @returns by id
   */
  async findById(id: string, status?: UserStatus): Promise<User> {
    const condition = { id, status };
    !status && delete condition.status;
    return await this.usersRepository.findOne({ where: condition });
  }

  /**
   * Finds all users - Non Paginated
   * @param ids
   * @returns all users
   */
  async findAllUsers(ids: string[]): Promise<User[]> {
    return this.usersRepository.find({
      where: { id: In([...ids]), status: UserStatus.ACTIVE },
    });
  }

  /**
   * Removes users
   * @param id
   * @returns remove
   */
  async remove(id: string): Promise<UserPayload> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "user not found",
      });
    }
    await this.usersRepository.delete(user.id)
    return {
      user: null,
    };
  }

  /**
   * Deactivates user
   * @param id
   * @returns user
   */
  async deactivateUser(id: string): Promise<User> {
    try {
      const user = await this.findById(id, UserStatus.ACTIVE);
      if (user) {
        if (
          [UserRole.ADMIN, UserRole.SUPER_ADMIN].every((i) =>
            user.roles.map((role) => role.role).includes(i)
          )
        ) {
          throw new ForbiddenException({
            status: HttpStatus.FORBIDDEN,
            error: "Super Admin can't be deactivated",
          });
        }
        user.status = UserStatus.DEACTIVATED;
        return await this.usersRepository.save(user);
      }

      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: "User already Deactivated",
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Activates user
   * @param id
   * @returns user
   */
  async activateUser(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      user.status = UserStatus.ACTIVE;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Creates token
   * @param user
   * @param paramPass
   * @returns token
   */
  async createToken(loginPayload: LoginUserInput): Promise<AccessUserPayload> {
    const { email, password } = loginPayload;

    const user = await this.findOne(email.trim());

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      });
    }

    if (!user.emailVerified) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        error: 'Email changed or not verified, please verify your email',
      });
    }

    const { accessToken, refreshToken } = await this.cognitoService.loginUser(user, password);



    if (accessToken) {
      await this.usersRepository.update(user.id, { awsAccessToken: accessToken, awsRefreshToken: refreshToken });
      const payload = { email: user.email, sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
        roles: user.roles,
      };
    } else {
      return {
        access_token: null,
        roles: [],
      };
    }
  }

  /**
   * Validates user
   * @param email
   * @param pass
   * @returns user
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findOne(email);
    if (user) {
      const passwordMatch = await bcrypt.compare(pass, user.password);
      if (passwordMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }

  /**
   * Logins users service
   * @param user
   * @returns access token object
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Verifies users service
   * @param token
   * @returns  jwt object with roles
   */
  async verify(token: string) {
    const secret = await this.jwtService.verify(token);
    const user = await this.findRolesByUserId(secret.sub);
    return {
      ...secret,
      roles: user.roles.map((role) => role.role),
    };
  }

  /**
   * Finds roles by user id
   * @param id
   * @returns roles by user id
   */
  async findRolesByUserId(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
        status: UserStatus.ACTIVE,
      },
      relations: ["roles"],
      select: ["id"],
    });
  }

  /**
   * @param id
   * @param password
   * @returns user with updatedPassword
   */
  async updatePassword(id: string, password: string) {
    const user = await this.findById(id, UserStatus.ACTIVE);
    if (user) {
      user.password = await createPasswordHash(password);
      const updatedUser = await this.usersRepository.save(user);
      return updatedUser;
    }
  }

  /**
   * @param id
   * @param password
   * @returns user with updatedPassword
   */
  async setNewPassword(
    updatePasswordInput: UpdatePasswordInput
  ): Promise<User | undefined> {
    const { id, newPassword } = updatePasswordInput;

    try {
      const user = await this.findById(id);
      user.password = await createPasswordHash(newPassword);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Finds all roles
   * @returns all roles
   */
  async findAllRoles(): Promise<Role[]> {
    try {
      return await this.rolesRepository.find({
        where: {
          role: Not(UserRole.SUPER_ADMIN),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Gets admins
   * @returns admins
   */
  async getAdmins(): Promise<Array<string>> {
    try {
      const users = await this.usersRepository
        .createQueryBuilder("users")
        .innerJoinAndSelect("users.roles", "role")
        .where("role.role = :roleType1", { roleType1: UserRole.ADMIN })
        .orWhere("role.role = :roleType2", { roleType2: UserRole.SUPER_ADMIN })
        .getMany();
      return users.map((u) => u.email);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
  * Delete User - on the basis of awsSub
  * @param awsSub
  * @returns Deleted User
  */
  async deleteOnAwsSub(awsSub: string): Promise<User> {
    try {
      let user = await this.usersRepository.findOneBy({
        awsSub
      })
      if (!user) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: "User not found",
        });
      }
      return await this.usersRepository.remove(user)
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async mapUserRoleToCognito(user: User): Promise<void> {
    await this.cognitoService.updateUserRole(user.awsSub, user.roles[0].role)
  }

  async updateById(id: string, payload: Partial<User>): Promise<User> {
    try {
      const user = await this.findById(id)

      if (!user) {
        return null
      }
      // Update the user properties
      Object.assign(user, payload);

      // Save the updated user to the database
      return await this.usersRepository.save(user)
    }
    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getRelatedEntities(userId: string, relationNames: string[]): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: relationNames
      });
      return user
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async sendUserToEveryAction(user: User, grade: string[], subjectArea: string[]): Promise<void> {
    const userEveryActionResponse = await this.everyActionService.send(user)
    await this.everyActionService.applyActivistCodes({ user, grades: grade, subjects: subjectArea })
    if (userEveryActionResponse) {

      const { userLog, meta } = userEveryActionResponse

      await this.updateById(user.id, { log: userLog, meta: JSON.stringify(meta) })

    }
  }

  async generateUsername(firstName: string, lastName: string): Promise<string> {
    let string = '';
    string += firstName ? firstName.substr(0, 1).toLowerCase() : 'checkology';
    string += lastName ? lastName.toLowerCase() : 'user';

    string = string.replace(/[^a-z]/gi, '');

    const numUsers = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: string })
      .orWhere('SUBSTRING(user.username, 1, :length) = :username', { length: string.length, username: string })
      .getCount();

    if (numUsers === 0) {
      return string;
    }

    const maxNum = await this.usersRepository
      .createQueryBuilder('user')
      .select(`SUBSTRING(user.username, ${string.length + 1})`, 'num')
      .orWhere('SUBSTRING(user.username, 1, :length) = :username', { length: string.length, username: string })
      .getRawMany();

    const filteredNums = maxNum
      .map((entry) => entry.num)
      .filter((item) => !isNaN(item))
      .sort()
      .reverse();

    const maxAppendedNum = filteredNums.length > 0 ? filteredNums[0] : 0;

    return string + (maxAppendedNum + 1);
  }
}

