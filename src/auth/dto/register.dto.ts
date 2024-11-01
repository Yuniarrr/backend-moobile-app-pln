import { Role } from '@prisma/client';
import { IsEnumDefined, IsStringDefined, IsStringOptional } from 'common';

export class RegisterDto {
  @IsStringDefined('Username is required', 'user')
  username: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsEnumDefined('Role is required', Role, Role.ULTG)
  role: Role;

  @IsStringDefined('Password is required', 'password')
  password: string;

  @IsStringOptional('GI id')
  gi_id?: string;
}
