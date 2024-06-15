import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { Express } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}
  @Get()
  async getMusics(@Res() response) {
    try {
      const items = await this.musicService.getAll();
      return response.status(200).json({
        message: 'Успешно',
        items,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @Get('/:id')
  async getOneMusic(@Res() response, @Param('id') id: string) {
    try {
      const OneMusic = await this.musicService.getOne(id);
      return response.status(200).json({
        message: 'Успешно получили трек',
        OneMusic,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createMusicDto: CreateMusicDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const musicData = { ...createMusicDto };
    console.log(files);

    if (files && files.length > 0) {
      const imageFile = files.find((file) =>
        file.mimetype.startsWith('image/'),
      );
      const songFile = files.find((file) => file.mimetype.startsWith('audio/'));

      if (imageFile) {
        musicData.imgSong = imageFile.path;
      }

      if (songFile) {
        musicData.song = songFile.path;
      }
    }

    console.log(musicData);
    return this.musicService.create(musicData);
  }

  @Put('/:id')
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
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateMusicDto: UpdateMusicDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const updateMusic = await this.musicService.update(id, {
        ...updateMusicDto,
        imgSong: file ? file.path : updateMusicDto.imgSong,
      });
      return response.status(200).json({
        success: true,
        message: 'Успешно обновили трек',
        updateMusic,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.musicService.delete(id);
  }
}
