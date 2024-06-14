import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Music, MusicSchema } from '../shemas/music.schema.';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Music.name, schema: MusicSchema }]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
