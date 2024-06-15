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
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistsService) {}

  @Get()
  async getAll(@Res() response: Response) {
    try {
      const artists = await this.artistService.findAll();
      return response.status(200).json({ artists });
    } catch (err) {
      return response
        .status(err.status || 500)
        .json(err.response || err.message);
    }
  }

  @Get('/:id')
  async getOne(@Res() response: Response, @Param('id') id: string) {
    try {
      const artist = await this.artistService.findOne(id);
      return response.status(200).json({ artist });
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
    @Body() createArtistDto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const artistData = { ...createArtistDto };
    if (file) {
      artistData.image = file.path;
    }
    try {
      const newArtist = await this.artistService.create(artistData);
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
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artistData = { ...updateArtistDto };
    if (file) {
      artistData.image = file.path;
    }
    try {
      const updatedArtist = await this.artistService.update(id, artistData);
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
      await this.artistService.addMusic(id, musicId);
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
      await this.artistService.remove(id);
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
      await this.artistService.removeMusic(id, musicId);
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
