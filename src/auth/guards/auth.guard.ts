import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAdapter } from '../../common/adapters/jwt.adapter';
import { UserService } from 'src/user/user.service';
import { CustomError } from 'src/common/errors/custom.error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAdapter: JwtAdapter,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    try {
      if (Array.isArray(authorization)) {
        throw new BadRequestException('Credencials not valid!');
      }
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new BadRequestException('Token not provided!');
      }

      const token = authorization?.split(' ').at(1) || '';
      if (!token) throw new UnauthorizedException("Unauthorized");

      const payload = await this.jwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) throw new UnauthorizedException("Invalid token");

      const user = await this.userService.findOne(payload.id);
      if (!user) throw new UnauthorizedException("Invalid token");

      request.userID = user['_doc']._id.toString();
      request.userROLE = user['_doc'].role;
      request.userNAME = user['_doc'].name;

      return true;
    } catch (error) {
      CustomError.createSignatureError(error.message);
    }
  }
}
