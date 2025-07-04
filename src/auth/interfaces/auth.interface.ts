import { User } from "src/user/entities/user.entity";

export interface AuthResponse{
    token: string;
    user: User;
}