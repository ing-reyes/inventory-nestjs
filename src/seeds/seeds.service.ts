import { Injectable } from '@nestjs/common';
import { UserRoles } from 'src/common/enums/roles.enum';
import { UserService } from 'src/user/user.service';
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
            password: await BcryptAdapter.hash('admin123'),
            role: UserRoles.ADMIN,

        });
        console.log('Seed ejecutada correctamente');
    }
}
