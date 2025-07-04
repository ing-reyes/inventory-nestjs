import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { UserModule } from 'src/user/user.module';

@Module({
    providers: [SeedsService],
    imports : [
        UserModule
    ],
    exports: [SeedsService],
})
export class SeedsModule {}
