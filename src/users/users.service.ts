import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";

import { User, UserStatus } from "./entities/user.entity";
import { Repository, Not, In, Connection } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { generate } from "generate-password";
import { RegisterUserInput } from "./dto/register-user-input.dto";
import { Role, UserRole } from "./entities/role.entity";
import {
  ResendVerificationEmail,
  UpdateUserInput,
} from "./dto/update-user-input.dto";
import { UsersPayload } from "./dto/users-payload.dto";
import UsersInput from "./dto/users-input.dto";
import { UpdateRoleInput } from "./dto/update-role-input.dto";
import { AccessUserPayload } from "./dto/access-user.dto";
import { PaginationService } from "../pagination/pagination.service";
import { VerifyUserAndUpdatePasswordInput } from "./dto/verify-user-and-set-password.dto";
import { UserPayload } from "./dto/register-user-payload.dto";
import { SearchUserInput } from "./dto/search-user.input";
import { UpdatePasswordInput } from "./dto/update-password-input";
import { createPasswordHash, queryParamasString } from "../lib/helper";
import { OrganizationSearchInput, OrganizationUserInput } from "./dto/organization-user-input.dto";
import { Organization, schoolType } from "./entities/organization.entity";
import { HttpService } from "@nestjs/axios";
import { OrganizationPayload } from "./dto/organization-user-payload";
import { Grade } from "../resources/entities/grade-levels.entity";
import { SubjectArea } from "../resources/entities/subject-areas.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Grade)
    private gradeLevelRepository: Repository<Grade>,
    @InjectRepository(SubjectArea)
    private subjectAreaRepository: Repository<SubjectArea>,
    private connection: Connection,
    private readonly jwtService: JwtService,
    private readonly paginationService: PaginationService,
    private readonly httpService: HttpService
  ) {}

  /**
   * Creates users service
   * @param registerUserInput
   * @returns created user
   */
  async create(registerUserInput: RegisterUserInput): Promise<User> {
    const queryRunner = this.connection.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        email: emailInput,
        password: inputPassword,
        firstName,
        lastName,
        country,
        newsLitNationAcess,
        organization,
        roleType,
        grade,
        subjectArea,
      } = registerUserInput;

      const email = emailInput?.trim().toLowerCase();

      const existingUser = await this.findOne(email, true);
      if (existingUser) {
        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          error: "User already exists",
        });
      }

      // const password = inputPassword || generate({ length: 10, numbers: true });
      // User Creation
      const userInstance = this.usersRepository.create({
        email,
        emailVerified: true,
        status: 1,
        country,
        firstName,
        lastName,
        password: inputPassword,
        newsLitNationAcess,
      });

      const role = await this.rolesRepository.findOne({
        where: { role: roleType },
      });

      userInstance.roles = [role];
      // const user = await this.usersRepository.save(userInstance);

      //here we have some relationship created below.
      //userHaveManyOrganization which they belong to
      let schools = [];
      if (organization.length) {
        // It should be one Organization
        schools = organization.map(async (org) => {
          const newORg = this.organizationRepository.create(org);
          return await this.organizationRepository.save(newORg);
        });
      }
      userInstance.organizations = [...schools];

      //ManyUsersHaveManyGradeLevels
      let gradeLevels = [];
      if (grade.length) {
        gradeLevels = grade.map(async (name) => {
          const newGrade = this.gradeLevelRepository.create({ name });
          return await this.gradeLevelRepository.save(newGrade);
        });
      }
      userInstance.gradeLevel = gradeLevels;

      let userSubjectAreas = [];
      if (subjectArea.length) {
        userSubjectAreas = await Promise.all(
          subjectArea.map(async (name) => {
            const newSubject = this.subjectAreaRepository.create({ name });
            return await this.subjectAreaRepository.save(newSubject);
          })
        );
      }
      userInstance.subjectArea = userSubjectAreas;

      const user = await this.usersRepository.save(userInstance);

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Updates users service
   * @param updateUserInput
   * @returns update user
   */
  async update(updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const { organization, grade, subjectArea, ...rest } = updateUserInput;
      const user = await this.findById(updateUserInput.id);
      return await this.usersRepository.save({ ...user, ...rest });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateRole(updateRoleInput: UpdateRoleInput): Promise<User> {
    try {
      const { roles } = updateRoleInput;
      const user = await this.findById(updateRoleInput.id, UserStatus.ACTIVE);

      if (user) {
        const fetchedRoles = await this.rolesRepository
          .createQueryBuilder("role")
          .where("role.role IN (:...roles)", { roles })
          .getMany();

        user.roles = fetchedRoles;
        return await this.usersRepository.save(user);
      }

      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "User not found",
      });
    } catch (error) {
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
   *
   * @param roles
   * @returns either a user has ATTORNEY role or not
   */
  isAttorney(roles: Role[]): boolean {
    return !!roles.filter((role) => role.role === (UserRole as any).ATTORNEY)
      .length;
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
    await this.usersRepository.delete(user.id);
    return {
      user: null,
      response: { status: HttpStatus.OK, message: "User deleted successfully" },
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
  async createToken(user: User, paramPass: string): Promise<AccessUserPayload> {
    const passwordMatch = await bcrypt.compare(paramPass, user.password);
    if (passwordMatch) {
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        roles: user.roles,
        response: {
          message: "OK",
          status: 200,
          name: "Token Created",
        },
      };
    } else {
      return {
        response: {
          message: "Incorrect Email or Password",
          status: 404,
          name: "Email or Password invalid",
        },
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
   * Get Organizations Details
   * @param organizationDetailInput
   * @returns organizations
   */
  async getOrganizations(
    organizationSearchInput: OrganizationSearchInput
  ): Promise<OrganizationPayload> {
    try {
      const { searchSchool, category, paginationOptions } =
      organizationSearchInput;
      const { page, limit } = paginationOptions ?? {};

      if (!category) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: `Category not found`,
        });
      }

      const searchOptions = {};
      const commonKeys = {
        outFields: `NAME,ZIP,CITY`,
        f: "json",
        returnGeometry: false,
        resultOffset: page ? String(page) : "1",
        resultRecordCount: limit ? String(limit) : "10",
      };
      let zip, name;
      if (searchSchool) {
        const words = searchSchool.match(/[a-zA-Z]+|\d+/g);
        const text = words.filter((word) => isNaN(parseInt(word)));
        const numbers = words
          .filter((word) => !isNaN(parseInt(word)))
          .map(Number);
        zip = numbers[0];
        name = text.join(" ");
      }
      if (name) {
        searchOptions["name"] = `NAME LIKE '%${name}%'`;
      }

      if (zip) {
        searchOptions["zip"] = `ZIP LIKE '%${zip}%'`;
      }

      if (name) {
        searchOptions["city"] = `CITY LIKE '%${name}%'`;
      }

      //
      const likeQuery = Object.entries(searchOptions)
        .map(([key, value]) => value)
        .join(" OR ");

      //convert query Object to URL
      const queryParams = queryParamasString(commonKeys);
      let schoolsData;
      if (category) {
        schoolsData = await this.httpService.axiosRef.get(
          `https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/${category}/FeatureServer/0/query?where=${
            likeQuery ? likeQuery : "1=1"
          }&${queryParams}`
        );
      }

      const { data, status } = schoolsData ?? {};

      //remove extra key from featuresPayload
      let OrganizationPayload = [];
      if (data) {
        OrganizationPayload = data.features.map((school) => {
          const filterSchool = { ...school.attributes, category };
          return Object.entries(filterSchool).reduce((acc, [key, value]) => {
            acc[key.toLowerCase()] = value;
            return acc;
          }, {});
        });
      }

      return {
        pagination: {
          page: page ? page : 1,
          limit: limit ? limit : 10,
          totalCount: 0,
          totalPages: 0,
        },
        organization: OrganizationPayload ? OrganizationPayload : [],
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
