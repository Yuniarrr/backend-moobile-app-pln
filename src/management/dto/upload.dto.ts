/* eslint-disable @darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator */
/* eslint-disable @darraghor/nestjs-typed/api-property-returning-array-should-set-array */
import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class UploadDto {
  @ApiProperty({})
  @IsNotEmpty()
  file: Express.Multer.File[];
}
