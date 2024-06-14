import {
  Body,
  Controller,
  Param,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { AuthService } from '../auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Put('/update/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const filename = `${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateUser(
    @Res() res,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.updateUser(id, {
        ...updateUserDto,
        image: file ? file.path : updateUserDto.image,
      });
      const token = await this.authService.generateAccessToken(user);
      const refresh_token = await this.authService.generateRefreshToken(
        user._id,
      );
      const { password, ...userData } = user._doc;
      return res.send({
        userData,
        ...token,
        ...refresh_token,
        file,
      });
    } catch (err) {
      return res.json({
        success: false,
        message: 'Ошибка при Обновлении данных',
      });
    }
  }
}
