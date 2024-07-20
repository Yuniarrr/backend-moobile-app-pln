import { IsStringDefined } from 'common';

export class GantiPasswordDto {
  @IsStringDefined('Password is required', 'password')
  password: string;

  @IsStringDefined('Confirm password is required', 'confirm_password')
  confirm_password: string;
}
