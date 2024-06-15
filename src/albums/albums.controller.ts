import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Response } from 'express';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async getAll(@Res() response: Response) {
    try {
      const albums = await this.albumsService.findAll();
      return response.status(200).json({ albums });
    } catch (err) {
      return response
        .status(err.status || 500)
        .json(err.response || err.message);
    }
  }

  @Get('/:id')
  async getOne(@Res() response: Response, @Param('id') id: string) {
    try {
      const album = await this.albumsService.findOne(id);
      return response.status(200).json({ album });
    } catch (err) {
      return response
        .status(err.status || 500)
        .json(err.response || err.message);
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createArtist(
    @Body() createArtistDto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const artistData = { ...createArtistDto };
    if (file) {
      artistData.image = file.path;
    }
    try {
      const newArtist = await this.albumsService.create(artistData);
      return { newArtist };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const albumsData = { ...updateAlbumDto };
    if (file) {
      albumsData.image = file.path;
    }
    try {
      const updatedArtist = await this.albumsService.update(id, albumsData);
      return response.status(200).json({ updatedArtist });
    } catch (err) {
      return response
        .status(err.status || 500)
        .json(err.response || err.message);
    }
  }

  @Put('/:id/add-music')
  async addMusic(
    @Res() response: Response,
    @Param('id') id: string,
    @Body('musicId') musicId: string,
  ) {
    try {
      await this.albumsService.addMusic(id, musicId);
      return response.status(200).json({ message: 'Music added successfully' });
    } catch (err) {
      return response
        .status(err.status || 500)
        .json(err.response || err.message);
    }
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.albumsService.remove(id);
    } catch (error) {
      console.log('Не удалось удалить');
    }
  }

  @Delete('/:id/remove-music')
  async removeMusic(
    @Res() response: Response,
    @Param('id') id: string,
    @Body('musicId') musicId: string,
  ) {
    try {
      await this.albumsService.removeMusic(id, musicId);
      return response
        .status(200)
        .json({ message: 'Music removed successfully' });
    } catch (err) {
      return response
        .status(err.status || 500)
        .json(err.response || err.message);
    }
  }
}
