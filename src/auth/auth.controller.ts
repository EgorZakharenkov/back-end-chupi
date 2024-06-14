import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { RegisterGuard } from './guards/register.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginGuard } from './guards/login.guard';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(RegisterGuard)
  @Post('register')
  async register(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.userService.register(createUserDto);
      const token = await this.authService.generateAccessToken(user);
      const refresh_token = await this.authService.generateRefreshToken(
        user._id,
      );
      const { password, ...userData } = user._doc;
      return response.json({
        userData,
        ...token,
        ...refresh_token,
      });
    } catch (err) {
      return response.json({
        success: false,
        message: 'Ошибка при регистрации',
      });
    }
  }
  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Res() response: Response, @Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.userService.login(loginUserDto);
      const token = await this.authService.generateAccessToken(user);
      const refresh_token = await this.authService.generateRefreshToken(
        user._id,
      );
      const { password, ...userData } = user._doc;
      response.statusCode = HttpStatus.OK;
      return response.send({
        userData,
        ...token,
        ...refresh_token,
      });
    } catch (err) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      return response.send({
        message: 'Ошибка при входе',
      });
    }
  }
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Req() req, @Res() res) {
    const { password, ...userData } = req.user.user;
    return res.send({
      userData,
    });
  }
}
