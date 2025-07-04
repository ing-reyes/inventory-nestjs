import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register( @Body() registerUserDto: RegisterUserDto ) {
    return this.authService.register( registerUserDto );
  }

  @Post('login')
  login( @Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }
  @UseGuards(AuthGuard)
  @Get('renew')
  renewToken( @Req() req: Request   ){
    return this.authService.renewToken( req.headers.renew as string );
  }
}
