import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayListSchema } from '../shemas/playlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Playlist', schema: PlayListSchema }]),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
