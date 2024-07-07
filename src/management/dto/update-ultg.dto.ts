import { PartialType } from '@nestjs/swagger';

import { CreateULTGDto } from './create-ultg.dto';

export class UpdateULTGDto extends PartialType(CreateULTGDto) {}
