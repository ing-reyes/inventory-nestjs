import { Injectable } from "@nestjs/common";
import { hashSync, compareSync, genSaltSync } from "bcryptjs";

@Injectable()
export class BcryptAdapter{
    hash( password: string ): string{
        const hashSalt = genSaltSync( +process.env.HASH_SALT );
        return hashSync( password, hashSalt );
    }

    compare( password: string, hashed: string ): boolean{
        return compareSync( password, hashed );
    }
}