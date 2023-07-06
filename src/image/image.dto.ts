import { PartialType } from '@nestjs/swagger';

export class CreateImageDto {}

export class UpdateImageDto extends PartialType(CreateImageDto) {}
