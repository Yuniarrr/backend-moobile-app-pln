import { IsStringDefined } from 'common';

export class LoginDto {
  @IsStringDefined('Username is required', 'user')
  username: string;

  @IsStringDefined('Password is required', 'password')
  password: string;
}
