import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, Res } from '@nestjs/common';
import { BienestarSocialService } from './bienestar-social.service';
import { CreateBienestarSocialDto } from './dto/create-bienestar-social.dto';
import { UpdateBienestarSocialDto } from './dto/update-bienestar-social.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';

@Controller('bienestar-social')
export class BienestarSocialController {
  constructor(private readonly bienestarSocialService: BienestarSocialService) { }

  @Post()
  create(@Body() createBienestarSocialDto: CreateBienestarSocialDto) {
    return this.bienestarSocialService.create(createBienestarSocialDto);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param("id") id: string) {
    return this.bienestarSocialService.uploadFile(file, id);
  }
  @Get('loads/:filename')
  async loadFile(@Param('filename') filename: string, @Res() res) {
    const path = await this.bienestarSocialService.loadFile(filename);

    res.setHeader('Content-Disposition', 'inline; filename=document.pdf');

    res.sendFile(path, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  }
  
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.bienestarSocialService.findAll(paginationDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bienestarSocialService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBienestarSocialDto: UpdateBienestarSocialDto) {
    return this.bienestarSocialService.update(id, updateBienestarSocialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bienestarSocialService.remove(id);
  }
}
