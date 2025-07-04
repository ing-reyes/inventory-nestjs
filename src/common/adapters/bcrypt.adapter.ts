import { Injectable } from "@nestjs/common";
import { hashSync, compareSync, genSaltSync } from "bcryptjs";

@Injectable()
export class BcryptAdapter{
    static hash( password: string ): string{
        const hashSalt = genSaltSync( +process.env.HASH_SALT );
        return hashSync( password, hashSalt );
    }

    static compare( password: string, hashed: string ): boolean{
        return compareSync( password, hashed );
    }
}