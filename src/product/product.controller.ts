import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { AuthGuard } from './../auth/guards/auth.guard';
import { RoleGuard } from './../auth/guards/role.guard';
import { PaginationDto } from './../common/dtos/pagination/pagination.dto';
import { ParseMongoIdPipe } from './../common/pipes/parse-mongo-id-pipe/parse-mongo-id.pipe';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from './../auth/decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards( AuthGuard, RoleGuard )
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiHeader({name: 'token'})
  @Roles('ADMIN', 'ADMIN')
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
  ) {
    return this.productService.create(createProductDto, req.userID);
  }

  @Get()
  @ApiHeader({name: 'token'})
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.productService.findAll(paginationDto);
  }

  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @Get(':id')
  @ApiHeader({name: 'token'})
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productService.findOne(id);
  }

  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @Patch(':id')
  @ApiHeader({name: 'token'})
  @Roles('ADMIN', 'ADMIN')
  update(
    @Param('id', ParseMongoIdPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    return this.productService.update(id, updateProductDto, req.userID);
  }

  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @Delete(':id')
  @ApiHeader({name: 'token'})
  @Roles('ADMIN', 'ADMIN')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Req() req: Request) {
    return this.productService.remove(id, req.userID);
  }
}
