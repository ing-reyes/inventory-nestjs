import { User } from "../entities/user.entity";

export interface FindAllUsersResponse{
    offset: number;
    limit: number;
    total: number;
    page: number;
    data: User[];
}