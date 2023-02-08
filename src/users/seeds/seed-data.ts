import { UserRole } from '../../users/entities/role.entity';
import { UserStatus } from '../entities/user.entity';

export const RolesData = [
  { role: UserRole.SUPER_ADMIN },
  { role: UserRole.ADMIN },
  { role: UserRole.ATTORNEY },
  { role: UserRole.PARALEGAL },
  { role: UserRole.INVESTIGATOR },
];

export const UsersData = [
  { firstName: "Abdul", lastName: "Basit", password: "Super123!", email: "abdul.basit@kwanso.com", status: UserStatus.ACTIVE, roleType: UserRole.SUPER_ADMIN, emailVerified: true },
  { firstName: "Shah", lastName: "Zaib", password: "Super123!", email: "shah.zaib@kwanso.com", status: UserStatus.ACTIVE, roleType: UserRole.ADMIN, emailVerified: true },
  { firstName: "Naseer", lastName: "Ahmed", password: "Super123!", email: "naseer.ahmed@kwanso.com", status: UserStatus.ACTIVE, roleType: UserRole.ADMIN, emailVerified: true },
];
