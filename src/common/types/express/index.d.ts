import { Request } from 'express';

declare module 'express' {
    export interface Request {
        userID?: string;
        userROLE?: string;
        userNAME?: string;
    }
}