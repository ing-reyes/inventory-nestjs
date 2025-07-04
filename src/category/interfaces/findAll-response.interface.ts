import { Category } from "../entities/category.entity";

export class FindAllResponse{
    offset: number;
    limit: number;
    total: number;
    page: number;
    data: Category[];
}