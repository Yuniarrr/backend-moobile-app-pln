import { Role } from '@prisma/client';
import { IsEnumDefined, IsStringDefined, IsStringOptional } from 'common';

export class CreateUserDto {
  @IsStringDefined('Username', 'username')
  username: string;

  @IsStringDefined('Password', 'password')
  password: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @IsEnumDefined('Role', Role, Role.ULTG)
  role: Role;

  @IsStringOptional('ULTG id', 'id')
  ultg_id?: string;

  @IsStringOptional('GI id', 'id')
  gi_id?: string;
}
