import { PartialType } from '@nestjs/swagger';
import { CreateBienestarSocialDto } from './create-bienestar-social.dto';

export class UpdateBienestarSocialDto extends PartialType(CreateBienestarSocialDto) {}
