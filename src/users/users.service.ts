import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Country, User, UserStatus } from './entities/user.entity';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthProviderInput, RegisterUserInput, RegisterWithGoogleInput, RegisterWithMicrosoftInput } from './dto/register-user-input.dto';
import { Role, UserRole } from './entities/role.entity';
import { UsersPayload } from './dto/users-payload.dto';
import UsersInput from './dto/users-input.dto';
import { AccessUserPayload, UserMeta } from './dto/access-user.dto';
import { PaginationService } from '../pagination/pagination.service';
import { UserPayload } from './dto/register-user-payload.dto';
import { SearchUserInput } from './dto/search-user.input';
import { UpdatePasswordInput } from './dto/update-password-input';
import { createPasswordHash } from '../lib/helper';
import { AwsCognitoService } from '../cognito/cognito.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { EveryActionService } from '../everyAction/everyAction.service';
import { SubjectAreaService } from '../subjectArea/subjectArea.service';
import { GradesService } from '../grade/grades.service';
import { LoginUserInput } from './dto/login-user-input.dto';
import { ConfigService } from '@nestjs/config';
import { AdminCreateUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { template } from 'src/util/constants';
import * as AWS from 'aws-sdk';
import { GoogleAuthService } from '../googleAuth/googleAuth.service';
import { MicrosoftAuthService } from '../microsoftAuth/microsoftAuth.service';
import { CheckUserAlreadyExistsInput } from './dto/verify-email-input.dto';
import { SocialProvider, UpdateUserEmailInput } from '../util/interfaces/index'
import { UtilsService } from 'src/util/utils.service';
import Mailgun, { InputFormData } from 'mailgun.js';
import FormData from "form-data"
import { IMailgunClient } from 'mailgun.js/Interfaces';

@Injectable()
export class UsersService {
  private mg: IMailgunClient;
  private readonly ses = new AWS.SES();
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly configService: ConfigService,
    private readonly organizationsService: OrganizationsService,
    private readonly jwtService: JwtService,
    private readonly gradeService: GradesService,
    private readonly subjectAreaService: SubjectAreaService,
    private readonly paginationService: PaginationService,
    private readonly cognitoService: AwsCognitoService,
    private readonly utilService: UtilsService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly microsoftService: MicrosoftAuthService,
    private everyActionService: EveryActionService,
  ) {
    const mailgun = new Mailgun(FormData as unknown as InputFormData);
    this.mg =  mailgun.client({
      key: this.configService.get<string>('mailgun.apiKey'),
      username: this.configService.get<string>('mailgun.username')
    });
  }

  /**
   * Creates users service
   * @param registerUserInput
   * @returns created user
   */
  async create(registerUserInput: RegisterUserInput, isSso = false): Promise<User> {
    try {
      const { email: emailInput, password: inputPassword, firstName, lastName, isMissing } = registerUserInput;

      const email = emailInput?.trim().toLowerCase();
      const existingUser = await this.findOne(email, true);
      const cognitoUser = await this.cognitoService.fetchCognitoUserWithEmail(email);
      const generatedUsername = await this.generateUsername(firstName, lastName)

      if (cognitoUser) {
        const role = this.cognitoService.getAwsUserRole({ User: cognitoUser } as AdminCreateUserCommandOutput);

        if (role !== 'educator' || existingUser) {
          this.existingUserConflict();
        }

        if (!existingUser || isMissing) {
          const updatedInputs = this.updateRegisterInput(registerUserInput, { User: cognitoUser } as AdminCreateUserCommandOutput);
          const awsSub = this.cognitoService.getAwsUserSub({ User: cognitoUser } as AdminCreateUserCommandOutput)
          const user = await this.saveInDatabase(updatedInputs, cognitoUser.Username, awsSub)

          return user;
        }
      }

      if (!cognitoUser && existingUser) {
        // create user on AWS Cognito
        const meta = this.prepareUserMetadata(existingUser);
        const cognitoResponse = await this.cognitoService.createUser(
          existingUser.username, existingUser.email.toLowerCase(), inputPassword, meta, isSso
        )

        await this.updateById(existingUser.id, {
          awsSub: cognitoResponse.UserSub, username: cognitoResponse.Username ? cognitoResponse.Username : existingUser.username
        })

        await this.updatePassword(existingUser.id, inputPassword);

        return existingUser;
      }

      const userMeta = this.getMetadataFromUserInputs(registerUserInput);
      const cognitoResponse = await this.cognitoService.createUser(
        generatedUsername, email, inputPassword, userMeta, isSso
      )

      return await this.saveInDatabase(
        registerUserInput,
        generatedUsername,
        cognitoResponse.UserSub
      )

    } catch (error) {
      if (error.name === 'ForbiddenException') {
        throw new ForbiddenException(error);
      }

      throw new InternalServerErrorException(error);
    }
  }

  async saveInDatabase(registerUserInput: RegisterUserInput, username: string, awsSub: string) {
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
      googleId,
      microsoftId
    } = registerUserInput;
    console
    const userInstance = this.usersRepository.create({
      email: emailInput.toLowerCase(),
      emailVerified: true,
      status: 1,
      country,
      firstName,
      lastName,
      username,
      password: inputPassword,
      zip,
      category,
      nlnOpt,
      siftOpt,
      awsSub,
      googleId,
      microsoftId
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

    if (!this.utilService.getCountryKey(userInstance.country)) {
      userInstance.country = Country[userInstance.country]
    }

    // userInstance.country = Country[userInstance.country]
    const user = await this.usersRepository.save(userInstance);
    // EveryAction User send
    this.sendUserToEveryAction(user, grades, subjectAreas)

    return user;
  }

  /**
   * Finds all
   * @param usersInput
   * @returns paginated users results
   */
  async findAll(usersInput: UsersInput): Promise<UsersPayload> {
    try {
      const paginationResponse = await this.paginationService.willPaginate<User>(this.usersRepository, {
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

  /**
   * @description
   * @param searchUserInput 
   * @returns 
   */
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
    const { email, username, password } = loginPayload;

    const cognitoUser = await (email ?
      this.cognitoService.fetchCognitoUserWithEmail(email.trim())
      :
      this.cognitoService.fetchUserWithUsername(username)
    );

    if (!cognitoUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      });
    }

    const isSSO = this.cognitoService.getAwsUserIsSso({ User: cognitoUser } as AdminCreateUserCommandOutput)
    if (isSSO) {
      return {
        email: 'provider',
        isSSO: true,
        isEducator: true,
        roles: []
      };
    }

    const role = this.cognitoService.getAwsUserRole({ User: cognitoUser } as AdminCreateUserCommandOutput);
    if (role === 'student' || role === 'publicUser') {
      return {
        isEducator: false,
        email: email ? email : username,
        isSSO: false,
        roles: [],
      };
    }

    const user = await (email ?
      this.findOne(email.trim())
      :
      this.usersRepository.findOne({
        where: {
          username
        }
      })
    )

    if (!user) {
      const { accessToken } = await this.cognitoService.loginUser({ username: cognitoUser.Username } as User, password)

      if (accessToken) {
        const cognitoMeta = this.cognitoService.getAwsUserMetadata({ User: cognitoUser } as AdminCreateUserCommandOutput);

        if (username) {
          const cognitoUserWithEmail = await this.cognitoService.fetchUserWithUsername(username, true)

          if (cognitoUserWithEmail) {
            const cognitoEmail = this.cognitoService.getAwsUserEmail({ User: cognitoUserWithEmail } as AdminCreateUserCommandOutput);

            if (cognitoEmail) {
              return {
                email: cognitoEmail,
                missingUser: cognitoMeta,
                shared_domain_token: accessToken,
                roles: [],
                isEducator: role === 'educator'
              };
            }
          }

          throw new NotFoundException({
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          });
        }

        return {
          email: email ? email : username,
          shared_domain_token: accessToken,
          roles: [],
          missingUser: cognitoMeta,
          isEducator: role === 'educator'
        };
      }

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

    if (user.googleId || user.microsoftId) {
      return {
        email: 'provider',
        isSSO: true,
        isEducator: true,
        roles: []
      };
    }

    const { accessToken, refreshToken } = await this.cognitoService.loginUser(user, password);

    if (accessToken) {
      await this.usersRepository.update(user.id, { awsAccessToken: accessToken, awsRefreshToken: refreshToken });
      const payload = { email: user.email, sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
        shared_domain_token: accessToken,
        roles: user.roles,
      };
    }

    return {
      access_token: null,
      shared_domain_token: null,
      roles: [],
    };
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

      if (user?.awsSub) {
        await this.cognitoService.resetPassword(user.username, password);
      }

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
  * Delete User - on the basis of awsSub
  * @param awsSub
  * @returns Deleted User
  */
  async deleteUserOnEntityField(key: keyof User, value: string): Promise<User | null> {
    try {
      console.log("*********** Delete User Webhook initiated for " + value + " ***********");
      let user = await this.usersRepository.findOneBy({
        [key]: value
      })

      if (!user) {
        return null;
      }

      return await this.usersRepository.remove(user)
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description
   * @param user 
   */
  async mapUserRoleToCognito(user: User): Promise<void> {
    await this.cognitoService.updateUserRole(user.awsSub, user.roles[0]?.role)
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

  /**
   * Finds by token
   * @param token 
   * @returns by token 
   */
  async findByToken(token: string): Promise<User> {
    try {
      return await this.usersRepository.findOne({ where: { token } });
    }
    catch (error) {
      throw new Error(error.message)
    }

  }

  /**
   * Resets password
   * @param password 
   * @param token 
   * @returns user 
   */
  async resetPassword(password: string, token: string): Promise<User | undefined> {
    try {
      const user = await this.findByToken(token)

      if (user) {
        user.token = null;
        user.password = password;

        await this.cognitoService.resetPassword(user.username, password)
        const updatedUser = await this.usersRepository.save(user);
        // this.redisService.delete(token);

        return updatedUser;
      }
      return undefined;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendForgotPasswordEmail(recipient: string, firstName: string, password_reset_link: string): Promise<void> {
    const emailContent = template(firstName, password_reset_link)

    const data = {
      from: this.configService.get<string>('mailgun.from'), // Sender's email address
      to: recipient,
      subject: 'Reset your Password',
      html: emailContent,
    };

    try {
      await this.mg.messages.create( this.configService.get<string>('mailgun.domain') , data);
    } catch (error) {
      throw new Error('Failed to send email.');
    }
  }
  /**
* Forgot password
* @param email 
* @returns password 
*/
  async forgotPassword(email: string): Promise<User | null | boolean> {
    try {

      const user = await this.findOne(email.toLowerCase())

      if (user?.googleId || user?.microsoftId) {
        return true;
      }

      const cognitoUser = await this.cognitoService.fetchCognitoUserWithEmail(email.toLowerCase())
      if (user && cognitoUser) {
        // const token = createToken();
        const token = this.jwtService.sign({ email })
        user.token = token;
        const portalAppBaseUrl: string = this.configService.get<string>('epNextAppBaseURL') || `https://educationplatform.vercel.app/`
        await this.sendForgotPasswordEmail(email, user.firstName, `${portalAppBaseUrl}/reset-password?token=${token}`)
        delete user.roles
        await this.usersRepository.save(user);
        return user
      }

      return null
    } catch (error) {
      throw new InternalServerErrorException(error);
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

  /**
   * 
   * @param user 
   * @param grade 
   * @param subjectArea 
   */
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

  existingUserConflict() {
    throw new ConflictException({
      status: HttpStatus.CONFLICT,
      error: "User already exists",
    });
  }

  async checkEmailAlreadyRegistered(checkUserAlreadyExistsInput: CheckUserAlreadyExistsInput) {
    try {
      const { email, socialLogin, role } = checkUserAlreadyExistsInput

      if (socialLogin !== undefined) {
        const { token, provider } = socialLogin

        if (provider === SocialProvider.Google) {
          const googleUser = await this.googleAuthService.authenticate(token)
          const { email: googleEmail, sub } = googleUser

          if (!(googleEmail && sub)) {
            throw new NotFoundException({
              status: HttpStatus.NOT_FOUND,
              error: "Invalid Token",
            });
          }

          return await this.checkUserExist(googleEmail)
        }

        if (provider === SocialProvider.Microsoft) {
          const microsoftUser = await this.microsoftService.authenticate(token)
          const { email: microsoftEmail, sub } = microsoftUser

          if (!(microsoftEmail && sub)) {
            throw new NotFoundException({
              status: HttpStatus.NOT_FOUND,
              error: "Invalid Token",
            });
          }

          return await this.checkUserExist(microsoftEmail);
        }
      }

      if (email) {
        console.log("Checking email: ", email);
        if (role) {
          return await this.checkUserExist(email, role)
        } else {
          return await this.checkUserExist(email)
        }

      }

    }
    catch (error) {
      console.log("Error here buddy: ", error)
      throw new InternalServerErrorException(error);
    }
  }

  async registerWithGoogle(registerUserInput: RegisterWithGoogleInput): Promise<User> {
    try {
      const { token } = registerUserInput

      const googleUser = await this.googleAuthService.authenticate(token)

      if (googleUser) {
        const { email, sub } = googleUser

        if (email) {
          return await this.create({
            email, googleId: sub, password: this.configService.get<string>('defaultPass'), ...registerUserInput
          }, true)
        }
      }

      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "Invalid Token",
      });
    }
    catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async loginWithGoogle(loginUserInput: OAuthProviderInput): Promise<AccessUserPayload> {
    const { token } = loginUserInput
    const googleUser = await this.googleAuthService.authenticate(token)

    if (!googleUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      });
    }

    const { email, sub } = googleUser;
    const cognitoUser = await this.cognitoService.fetchCognitoUserWithEmail(email.trim());

    if (!cognitoUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      });
    }

    const role = this.cognitoService.getAwsUserRole({ User: cognitoUser } as AdminCreateUserCommandOutput);
    if (role === 'student' || role === 'publicUser') {
      return {
        isEducator: false,
        email,
        isSSO: true,
        roles: [],
      };
    }

    const user = await this.findOne(email.toLowerCase().trim());
    if (!user) {
      const { accessToken } = await this.cognitoService.adminLoginUser({ username: cognitoUser.Username } as User)

      if (accessToken) {
        const cognitoMeta = this.cognitoService.getAwsUserMetadata({ User: cognitoUser } as AdminCreateUserCommandOutput);

        return {
          email,
          shared_domain_token: accessToken,
          missingUser: cognitoMeta,
          roles: [],
          isSSO: true,
          isEducator: role === 'educator'
        };
      }

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

    const { accessToken, refreshToken } = await this.cognitoService.adminLoginUser(user);

    if (accessToken) {
      await this.usersRepository.update(
        user.id,
        { awsAccessToken: accessToken, awsRefreshToken: refreshToken, googleId: sub }
      );
      const payload = { email: user.email, sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
        shared_domain_token: accessToken,
        roles: user.roles,
      };
    } else {
      return {
        access_token: null,
        shared_domain_token: null,
        roles: [],
      };
    }
  }

  async registerWithMicrosoft(registerWithMicrosoftInput: RegisterWithMicrosoftInput): Promise<User> {
    try {

      const { token } = registerWithMicrosoftInput
      const microsoftUser = await this.microsoftService.authenticate(token)

      if (microsoftUser) {
        const { email, sub } = microsoftUser

        if (email && sub) {
          return await this.create({
            email, microsoftId: sub, password: this.configService.get<string>('defaultPass'),
            ...registerWithMicrosoftInput
          }, true)
        }
      }

      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "Invalid Token",
      });

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async loginWithMicrosoft(loginWithMicrosoftInput: OAuthProviderInput): Promise<AccessUserPayload> {
    const { token } = loginWithMicrosoftInput
    const microsoftUser = await this.microsoftService.authenticate(token)

    if (!microsoftUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      });
    }

    const { email, sub } = microsoftUser;

    if (!(email && sub)) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: "Invalid Token",
      });
    }

    const cognitoUser = await this.cognitoService.fetchCognitoUserWithEmail(email.trim());
    if (!cognitoUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      });
    }

    const role = this.cognitoService.getAwsUserRole({ User: cognitoUser } as AdminCreateUserCommandOutput);
    if (role === 'student' || role === 'publicUser') {
      return {
        isEducator: false,
        email,
        isSSO: true,
        roles: [],
      };
    }

    const user = await this.findOne(email.toLowerCase().trim());
    if (!user) {
      const { accessToken } = await this.cognitoService.adminLoginUser({ username: cognitoUser.Username } as User)

      if (accessToken) {
        const cognitoMeta = this.cognitoService.getAwsUserMetadata({ User: cognitoUser } as AdminCreateUserCommandOutput);

        return {
          email,
          isSSO: true,
          missingUser: cognitoMeta,
          shared_domain_token: accessToken,
          roles: [],
          isEducator: role === 'educator'
        };
      }

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

    const { accessToken, refreshToken } = await this.cognitoService.adminLoginUser(user);

    if (accessToken) {
      await this.usersRepository.update(user.id, { awsAccessToken: accessToken, awsRefreshToken: refreshToken, microsoftId: sub });
      const payload = { email: user.email, sub: user.id };

      return {
        shared_domain_token: accessToken,
        access_token: this.jwtService.sign(payload),
        roles: user.roles,
      };
    } else {
      return {
        shared_domain_token: null,
        access_token: null,
        roles: [],
      };
    }
  }

  async checkUserExist(email: string, role?: string): Promise<boolean> {
    const user = await this.findOne(email.toLowerCase().trim());
    const cognitoUser = await this.cognitoService.fetchCognitoUserWithEmail(email.trim());

    if (cognitoUser && (role === 'PUBLIC_USER')) {
      return false;
    }

    if (!(user || cognitoUser) || (!user && cognitoUser)) {
      return true;
    }

    return false;
  }

  async checkUserExistOnCognito(email: string, role?: string): Promise<boolean> {
    const user = await this.findOne(email.toLowerCase().trim());
    const cognitoUser = await this.cognitoService.fetchCognitoUserWithEmail(email.trim());
    if (cognitoUser) {
      return true;
    }

    return false;
  }

  async performAutoLogin(token: string) {
    const user = await this.cognitoService.getDecodedCognitoUser(token)

    if (user) {
      const existUser = await this.usersRepository.findOne({ where: { username: user.Username } })
      if (existUser) {
        // check there token is valid and
        const payload = { email: existUser.email, sub: existUser.id };
        return {
          access_token: this.jwtService.sign(payload),
          roles: [],
        };
      }
      else {
        return {
          access_token: null,
          roles: [],
        };
      }
    }
    else {
      // not found on cognito service
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      });
    }
  }

  prepareUserMetadata(user: User): UserMeta {
    const { firstName, lastName } = user;

    return {
      first_name: firstName,
      last_name: lastName,
      organization: ''
    }
  };

  updateRegisterInput(userInput: RegisterUserInput, cognitoUser: AdminCreateUserCommandOutput): RegisterUserInput {
    const { first_name, country, last_name } = this.cognitoService.getAwsUserMetadata(cognitoUser);

    return {
      ...userInput,
      firstName: first_name, lastName: last_name, country: country as Country
    }
  }

  getMetadataFromUserInputs(userInput: RegisterUserInput): UserMeta {
    const { firstName, lastName, country, organization } = userInput;
    const { name, zip, category, city, state, street } = organization || {}
    const orgName = name ? name.split("|")[0].trim() : '-';
    const orgCountry = this.utilService.getCountryKey(country);

    // NAME|ZIP|CITY|STATE|STREET|COUNTRY|TYPE
    const orgInfo = `${orgName}|${zip || '-'}|${city || '-'}|${state || '-'}|${street || '-'}|${orgCountry || '-'}|${category || '-'}`

    return {
      first_name: firstName,
      last_name: lastName,
      organization: orgInfo
    }
  }

  async updateByEmail(updateUserEmailInput: UpdateUserEmailInput): Promise<Boolean> {
    try {
      // Check if the new email already exists in the database
      const { userName, newEmail , newUsername} = updateUserEmailInput

      // Perform the update only if the new email is not taken
      const updateCriteria = { username: userName };
      const updateValues: Record<string, any> = {};
  
      if (newEmail) {
        updateValues.email = newEmail.toLowerCase();
      }
  
      if (newUsername) {
        updateValues.username = newUsername.toLowerCase();
      }
  
      const updateResult = await this.usersRepository.update(updateCriteria, updateValues);
  
      return updateResult.affected > 0;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user email or username.');
    }

  }

}
