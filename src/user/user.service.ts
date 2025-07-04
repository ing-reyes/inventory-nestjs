import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { PaginationDto } from './../common/dtos/pagination/pagination.dto';
import { FindAllUsersResponse } from './interfaces/findAll-users.interface';
import { BcryptAdapter } from './../common/adapters/bcrypt.adapter';
import { CustomError } from './../common/errors/custom.error';
import { UserRoles } from './../common/enums/roles.enum';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly bcryptAdapter: BcryptAdapter,
    // private readonly recordService: RecordService,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;
    try {
      const exists = await this.userModel.findOne({ email });
      if (exists) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'User not available!',
      });

      const user = await this.userModel.create({
        ...createUserDto,
        password: this.bcryptAdapter.hash(password),
        role: UserRoles.USER,
        active: true,
      });
      if (!user) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'User not created!',
      })

      await user.save();

      return user;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<FindAllUsersResponse> {
    const { offset = 0, limit = 10 } = paginationDto;
    try {
      const [total, users] = await Promise.all([
        this.userModel.find({ active: true }).countDocuments(),
        this.userModel.find({ active: true })
          .skip(offset)
          .limit(limit),
      ]);

      return {
        offset,
        limit,
        total,
        page: (offset <= 0) ? 1 : Math.ceil(offset / limit),
        data: users,
      };
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ _id: id, active: true });
      if (!user) throw new CustomError({
        type: 'NOT_FOUND',
        message: 'User not found!',
      });

      return user;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findOneAndUpdate({ _id: id, active: true }, { ...updateUserDto }, { new: true });
      if (!user) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'User not found!',
      });

      return user;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);

      const deleted = await this.userModel.findByIdAndUpdate(id, { active: false }, { new: true });

      if (!user) throw new CustomError({
        type: 'BAD_REQUEST',
        message: 'User not found!',
      });

      return deleted;
    } catch (error) {
      throw CustomError.createSignatureError(error.message);
    }
  }
}
