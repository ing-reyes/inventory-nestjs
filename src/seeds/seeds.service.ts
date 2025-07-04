import { Injectable } from '@nestjs/common';
import { UserRoles } from './../common/enums/roles.enum';
import { UserService } from './../user/user.service';

@Injectable()
export class SeedsService {
    constructor(
        private readonly userService: UserService,
    ) { }

    async seed() {

        // Usuario por defecto
        const user = await this.userService.create({
            name: 'Administrador',
            email: 'admin@demo.com',
            password: 'admin123',
            role: UserRoles.ADMIN,
        });

        await user.save();

        console.log('Seed ejecutada correctamente');
    }
}
