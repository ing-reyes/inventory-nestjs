import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY} from 'src/common/constants/key-decorators';
import { UserRoles } from 'src/common/enums/roles.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  
  constructor( private readonly reflector: Reflector ){}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { userROLE } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => role === userROLE);
  }
}
