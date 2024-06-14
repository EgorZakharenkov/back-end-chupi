import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UsersDocument } from '../shemas/user.shema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user-dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<User | null> {
    const existingUser = await this.usersModel.collection.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      return null;
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);
    const createdUser = new this.usersModel({
      ...createUserDto,
      password: passwordHash,
    });
    return createdUser.save();
  }
  async login(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.usersModel.findOne({
      email: loginUserDto.email,
    });
    if (!user) return null;
    return user as User;
  }
  async findOne(email: string): Promise<User> {
    return this.usersModel.findOne({ email });
  }
  async findById(id: string): Promise<User> {
    return this.usersModel.findById(id);
  }

  async updateUser(id: string, updateDto: UpdateUserDto) {
    return this.usersModel.findByIdAndUpdate(id, updateDto, { new: true });
  }
}
