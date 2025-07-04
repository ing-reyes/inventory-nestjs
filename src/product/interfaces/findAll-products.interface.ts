import { Product } from "../entities/product.entity";

export interface FindAllProductsResponse{
    offset: number;
    limit: number;
    total: number;
    page: number;
    data: Product[];
}