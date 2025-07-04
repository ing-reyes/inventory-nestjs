import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { FindAllResponse } from './interfaces/findAll-response.interface';
import { CustomError } from '../common/errors/custom.error';

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ){}
  async create(createCategoryDto: CreateCategoryDto):Promise<Category> {
    try {
      const category = await this.categoryModel.create( {
        ...createCategoryDto,
      } );
      if( !category ) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Category not created!',
      })

      await category.save();

      return category;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllResponse> {
    const { offset = 0, limit = 10 } = paginationDto;
    try {
      const [total, categories] = await Promise.all([
        this.categoryModel.countDocuments(),
        this.categoryModel.find({active:true})
        .skip(offset)
        .limit(limit)
      ]);
  
      return {
        offset,
        limit,
        total,
        page: ( offset <= 0) ? 1 : Math.ceil( offset / limit ),
        data: categories,
      }
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findOne( { _id: id, active:true } )
      if( !category ) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Category not found!',
      });

      return category;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    
    try {
      const category = await this.categoryModel.findOneAndUpdate( 
        { _id: id, active:true }, 
        {
          ...updateCategoryDto, 
          updateAt: Date.now,
        }, 
        { new: true } );
      
        if( !category ) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Category not found!',
      });

      return category;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
    
  }

  async remove(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findOneAndUpdate( { _id: id, active:true }, {active:false}, {new: true} );
      
        if( !category ) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Category not found!',
      });

      return category;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }
}
