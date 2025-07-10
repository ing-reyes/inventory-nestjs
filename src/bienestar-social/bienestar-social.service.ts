import * as fs from "fs";
import * as path from "path";

import { Injectable } from '@nestjs/common';
import { CreateBienestarSocialDto } from './dto/create-bienestar-social.dto';
import { UpdateBienestarSocialDto } from './dto/update-bienestar-social.dto';
import { CustomError } from "src/common/errors/custom.error";
import { InjectModel } from "@nestjs/mongoose";
import { BienestarSocial } from "./entities/bienestar-social.entity";
import { Model } from "mongoose";
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { FindAllBienestarSocialResponse } from "./interfaces/findAll-bienestar-social.interface";
import { v4 } from "uuid";


@Injectable()
export class BienestarSocialService {
  constructor(
    @InjectModel(BienestarSocial.name) private readonly bienestarSocialModel: Model<BienestarSocial>,
  ) { }

  async create(createBienestarSocialDto: CreateBienestarSocialDto): Promise<BienestarSocial> {
    try {
      const bienestar = await this.bienestarSocialModel.create(createBienestarSocialDto);

      if (!bienestar) {
        throw new CustomError({
          type: "CONFLICT",
          message: "Bienestar Social Not Created!",
        })
      }

      await bienestar.save()

      return bienestar;
    } catch (error) {
      CustomError.createSignatureError(error.message)
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllBienestarSocialResponse> {
    try {
      const { offset = 0, limit = 10 } = paginationDto;

      const [total, bienestar] = await Promise.all([
        this.bienestarSocialModel.countDocuments(),
        this.bienestarSocialModel.find()
          .skip(offset)
          .limit(limit)
      ]);

      return {
        offset,
        limit,
        total,
        page: (offset <= 0) ? 1 : Math.ceil(offset / limit),
        data: bienestar,
      }
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const bienestar = await this.bienestarSocialModel.findOne({ _id: id })

      if (!bienestar) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Bienestar Social not found!',
      });
      return bienestar;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateBienestarSocialDto: UpdateBienestarSocialDto) {
    try {
      const bienestar = await this.bienestarSocialModel.findOneAndUpdate(
        { _id: id },
        { ...updateBienestarSocialDto, updateAt: Date.now() },
        { new: true },
      );

      if (!bienestar) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Bienestar Social not found!',
      });

      return bienestar;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async remove(id: string) {
    try {
      const bienestar = await this.bienestarSocialModel.findOneAndDelete(
        { _id: id },
        { new: true },
      );

      if (!bienestar) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'Bienestar Social not found!',
      });

      const folderPath = path.resolve(__dirname + "./../../uploads/bienestar-social", bienestar.doc);

      if (bienestar.doc) {
        if (fs.existsSync(folderPath)) {
          fs.unlinkSync(folderPath);
        }
      }

      return bienestar;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async uploadFile(file: Express.Multer.File, id: string) {
    try {
      const bienestar = await this.findOne(id);

      if (!bienestar) {
        throw new CustomError({
          type: "NOT_FOUND",
          message: "Bienestar Social Not Found!",
        })
      }

      const extension = file.originalname.split('.').at(-1);
      const fileName = `${v4()}.${extension}`;

      const pathFolder = path.resolve(__dirname + './../../uploads/bienestar-social', fileName);
      this.existFolderPath(__dirname + './../../uploads/bienestar-social');
      fs.writeFileSync(pathFolder, file.buffer);

      await this.bienestarSocialModel.findByIdAndUpdate(id, { doc: fileName });

      return {
        message: 'File uploaded successfully',
        fileName,
      };
    } catch (error) {
      CustomError.createSignatureError(error.message)
    }
  }

  async loadFile(filename: string) {
    try {
      const pathFolder = path.resolve(__dirname + './../../uploads/bienestar-social', filename)
      if (!fs.existsSync(pathFolder)) {
        return path.resolve(__dirname + './../../uploads/bienestar-social/default.pdf');
      }

      return pathFolder;
    } catch (error) {
      CustomError.createSignatureError(error.message)
    }
  }

  existFolderPath(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }

  // async search(term: string): Promise<BienestarSocial>{
  //   // Crear una query para buscar las coincidencias en el nombre del producto
  //   const regex = new RegExp(term, 'i'); // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
  //   return this.bienestarSocialModel.find({
  //     $or: [
  //       { title: regex },
  //       { summary: regex },
  //     ]
  //   })
  //   .exec();
  // }
}
