import { BienestarSocial } from "../entities/bienestar-social.entity";

export interface FindAllBienestarSocialResponse{
    offset: number;
    limit: number;
    total: number;
    page: number;
    data: BienestarSocial[];
}