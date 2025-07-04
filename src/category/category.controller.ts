import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id-pipe/parse-mongo-id.pipe';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Category')
@Controller('categories')
@UseGuards( AuthGuard, RoleGuard )
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @ApiHeader({name: 'token'})
  @Roles('ADMIN')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiHeader({name: 'token'})
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @ApiParam({name: 'id', required: true, description: 'Category ID'})
  @Get(':id')
  @ApiHeader({name: 'token'})
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoryService.findOne( id );
  }

  @ApiParam({name: 'id', required: true, description: 'Category ID'})
  @Patch(':id')
  @ApiHeader({name: 'token'})
  @Roles('ADMIN')
  update(
    @Param('id', ParseMongoIdPipe) id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update( id, updateCategoryDto );
  }

  @ApiParam({name: 'id', required: true, description: 'Category ID'})
  @Delete(':id')
  @ApiHeader({name: 'token'})
  @Roles('ADMIN')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoryService.remove( id );
  }
}
