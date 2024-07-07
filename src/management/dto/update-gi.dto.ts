import { PartialType } from '@nestjs/swagger';

import { CreateGIDto } from './create-gi.dto';

export class UpdateGIDto extends PartialType(CreateGIDto) {}
