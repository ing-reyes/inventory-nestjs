import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { FindAllProductsResponse } from './interfaces/findAll-products.interface';
import { CustomError } from '../common/errors/custom.error';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ){}

  async create(createProductDto: CreateProductDto, userID: string): Promise<Product> {
    try {
      const product = await this.productModel.create({
        ...createProductDto,
        user: userID,
      });

      if (!product) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'Product not created!',
      });

      await product.save();

      return product;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto:PaginationDto):Promise<FindAllProductsResponse> {
    try {
      const { offset = 0, limit = 10 } = paginationDto;

      const [total, products] = await Promise.all([
        this.productModel.countDocuments(),
        this.productModel.find()
        .skip(offset)
        .limit(limit)
        .populate('category', 'name')
      ]);

      return {
        offset,
        limit,
        total,
        page: (offset <= 0) ? 1 : Math.ceil(offset / limit),
        data: products,
      }
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async findOne(id: string):Promise<Product> {
    try {
      const product = await this.productModel.findOne({ _id: id })
      .populate('category', 'name')
      
      if( !product ) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Product not found!',
      });
      return product;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async findAllByCategory(category: string):Promise<FindAllProductsResponse> {
    try {

      const [total, products] = await Promise.all([
        this.productModel.countDocuments(),
        this.productModel.find({ category })
      ]);

      return {
        offset: 0,
        limit: 10,
        total: total,
        page: 1,
        data: products,
      }
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, userID: string) {
    try {
      const product = await this.productModel.findOneAndUpdate(
        { _id: id },
        { ...updateProductDto, user: userID, updateAt: Date.now() },
        { new: true },
      );
      
      if( !product ) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Product not found!',
      });

      return product;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async remove(id: string, userID: string):Promise<Product> {
    try {
      const product = await this.productModel.findOneAndDelete(
        { _id: id },
        { new: true },
      );
      
      if( !product ) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Product not found!',
      });

      return product;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  search(term: string){
    // Crear una query para buscar las coincidencias en el nombre del producto
    const regex = new RegExp(term, 'i'); // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
    return this.productModel.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
      ]
    })
    .exec();
  }
}
