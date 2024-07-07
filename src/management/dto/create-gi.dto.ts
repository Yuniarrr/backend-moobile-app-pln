import { IsStringDefined } from 'common';

export class CreateGIDto {
  @IsStringDefined('Nama GI', 'gi')
  nama: string;

  @IsStringDefined('ULTG ID', 'ultg')
  ultg_id: string;
}
