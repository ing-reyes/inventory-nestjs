import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

const SEED = "asdasd.asdasas.asdasdwqrgg"; // todo: add env 

@Injectable()
export class JwtAdapter{
    async generateToken( payload: Object, duration:string = '5h' ):Promise<string|null>{
        return new Promise( ( resolve ) => {
            jwt.sign( payload, SEED, { expiresIn: duration }, ( error, token ) => {
                
                if( error ) return resolve( null );
    
                return resolve( token );
            } );
        });
    }

    async validateToken<T>( token: string ):Promise<T|null>{
        return new Promise( ( resolve ) => {
            jwt.verify( token, SEED, (error, decoded)=>{
                if( error ) return resolve( null );
    
                return resolve( decoded as T );
            } );
        });
    }

    async renewToken( token: string ): Promise<string|null>{
        const payload = await this.validateToken<{id:string}>( token );
        if( !payload ) return Promise.resolve( null );
        
        return this.generateToken( { id: payload.id } );
    }
}