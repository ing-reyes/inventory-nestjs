import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BcryptAdapter } from './../common/adapters/bcrypt.adapter';
import { JwtAdapter } from './../common/adapters/jwt.adapter';
import { AuthResponse } from './interfaces/auth.interface';
import { User } from './../user/entities/user.entity';
import { UserService } from './../user/user.service';
import { CustomError } from '../common/errors/custom.error';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtAdapter: JwtAdapter,
    private readonly userService: UserService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    try {
      const user = await this.userService.create(registerUserDto);

      const token = await this.jwtAdapter.generateToken({ id: user._id.toString() });
      if (!token) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Token not generated!',
      });

      return {
        token,
        user
      };
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const { email, password } = loginUserDto;
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Credencials not valid!',
      });

      const isMatch = this.bcryptAdapter.compare(password, user.password);
      if (!isMatch) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Credencials not valid!',
      });

      const token = await this.jwtAdapter.generateToken({ id: user._id.toString() });
      if (!token) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Token not generated!',
      });

      return {
        token,
        user,
      };
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async renewToken( token:string ):Promise<AuthResponse>{
    try{
      if( !token ) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Token not provided!',
      });

      const payload = await this.jwtAdapter.validateToken<{id:string}>( token );
      if( !payload ) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Invalid token!',
      });

      const user = await this.userService.findOne( payload.id );

      const newToken = await this.jwtAdapter.generateToken( {id: payload.id} );
      if( !newToken ) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Token not generated!',
      });

      return {
        token: newToken,
        user: user,
      };
    }catch(error){
      throw CustomError.createSignatureError(error.message);
    }
  }
}
