import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../shemas/user.shema';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }
    return user;
  }
  async generateAccessToken(user: User) {
    return {
      token: this.jwtService.sign({ user }),
    };
  }
  async generateRefreshToken(userId: mongoose.Types.ObjectId | string) {
    return {
      refresh_token: this.jwtService.sign(
        { userId },
        {
          secret: jwtConstants.secret,
          expiresIn: '30d',
        },
      ),
    };
  }
  async getUserByToken(token: string) {
    const decodedToken = this.jwtService.verify(token);
    if (!decodedToken) {
      return null;
    }
    const userId = decodedToken.sub;
    const user = await this.usersService.findById(userId);
    if (!user) {
      return null;
    }
    const { password, ...userData } = user;
    return userData;
  }
}
