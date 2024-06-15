import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Album, AlbumSchema } from '../shemas/Album.schema';
import { AlbumsController } from './albums.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
