import { IsStringDefined } from 'common';

export class CreateULTGDto {
  @IsStringDefined('Nama ULTG', 'ultg')
  nama: string;
}
