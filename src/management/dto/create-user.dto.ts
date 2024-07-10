import { Role } from '@prisma/client';
import { IsEnumDefined, IsStringDefined, IsStringOptional } from 'common';

export class CreateUserDto {
  @IsStringDefined('Username', 'username')
  username: string;

  @IsStringDefined('Password', 'password')
  password: string;

  @IsEnumDefined('Role', Role, Role.HAR)
  role: Role;

  @IsStringOptional('GI id', 'id')
  gi_id?: string;
}