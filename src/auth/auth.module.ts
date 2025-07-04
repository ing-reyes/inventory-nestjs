import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [ AuthController ],
  providers: [ AuthService, AuthGuard, RoleGuard, UserService ],
  imports: [
    CommonModule,
    UserModule,
  ],
  exports: [ AuthService, AuthGuard, RoleGuard ],
})
export class AuthModule {}
