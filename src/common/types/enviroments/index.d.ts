//NodeJS.ProcessEnv

declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        MONGO_USER: string;
        MONGO_PASSWORD: string;
        MONGO_URL: string;
        MONGO_DB_NAME: string;
        JWT_SECRET:string;
        HASH_SALT: number;
    }
}