import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { JwtAdapter } from './adapters/jwt.adapter';
import { ParseMongoIdPipe } from './pipes/parse-mongo-id-pipe/parse-mongo-id.pipe';

@Module({
    providers: [ BcryptAdapter, JwtAdapter, ParseMongoIdPipe ],
    exports: [ BcryptAdapter, JwtAdapter, ParseMongoIdPipe ],
})
export class CommonModule {}
