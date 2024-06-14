import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistController } from './artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Music, MusicSchema } from '../shemas/music.schema.';
import { MulterModule } from '@nestjs/platform-express';
import { Artist, ArtistSchema } from '../shemas/artist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [ArtistController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
