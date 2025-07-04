import { SetMetadata } from "@nestjs/common";
import { ROLES_KEY } from "../../common/constants/key-decorators";
import { UserRoles } from "../../common/enums/roles.enum";

export const Roles = ( ...roles: Array<keyof typeof UserRoles> ) => SetMetadata( ROLES_KEY, roles );