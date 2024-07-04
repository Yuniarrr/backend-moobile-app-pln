import { Role } from '@prisma/client';
import { IsEnumDefined, IsStringDefined, IsStringOptional } from 'common';

export class RegisterDto {
  @IsStringDefined('Username is required', 'user')
  username: string;

  @IsEnumDefined('Role is required', Role, Role.HAR)
  role: Role;

  @IsStringDefined('Password is required', 'password')
  password: string;

  @IsStringOptional('GI id')
  gi_id?: string;
}
