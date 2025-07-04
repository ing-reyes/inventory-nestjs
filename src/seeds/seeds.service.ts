import { Injectable } from '@nestjs/common';
import { UserRoles } from './../common/enums/roles.enum';
import { UserService } from './../user/user.service';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';

@Injectable()
export class SeedsService {
    constructor(
        private readonly userService: UserService,
    ) { }

    async seed() {

        // Usuario por defecto
        await this.userService.create({
            name: 'Administrador',
            email: 'admin@demo.com',
            password: BcryptAdapter.hash('admin123'),
            role: UserRoles.ADMIN,

        });
        console.log('Seed ejecutada correctamente');
    }
}
