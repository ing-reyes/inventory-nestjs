import { v4 as uuid } from 'uuid';
export class UuidAdapter{
    static generateUUID(): string{
        return uuid();
    }
}
