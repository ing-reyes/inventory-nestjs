import { Module } from '@nestjs/common';
import { BienestarSocialService } from './bienestar-social.service';
import { BienestarSocialController } from './bienestar-social.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BienestarSocial, BienestarSocialSchema } from './entities/bienestar-social.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [BienestarSocialController],
  providers: [BienestarSocialService],
  imports: [
    MongooseModule.forFeature([{ name: BienestarSocial.name, schema: BienestarSocialSchema }]),
    AuthModule,
    UserModule
  ]
})
export class BienestarSocialModule { }
