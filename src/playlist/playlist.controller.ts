import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { CreateMusicDto } from '../music/dto/create-music.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}
  @Post('user/:id')
  async GetPlayList(@Res() res, @Param('id') id: string) {
    try {
      const playList = await this.playlistService.getUserPlaylists(id);
      return res.status(200).send({
        playList,
      });
    } catch (err) {
      return res.status(err.status).json(err.response);
    }
  }
  @Get(':id')
  async getPlaylistTracks(@Res() res, @Param('id') id: string) {
    try {
      const playList = await this.playlistService.getPlayListMusic(id);
      return res.send({
        playList,
      });
    } catch (err) {
      console.error('getPlaylistTracks error:', err);
      return res.status(err.status).json(err.response);
    }
  }

  @Post('create')
  async createPlayList(
    @Res() res,
    @Body() createPlayListDto: CreatePlaylistDto,
  ) {
    try {
      const createPlayList =
        await this.playlistService.createPlaylist(createPlayListDto);
      return res.send({
        createPlayList,
      });
    } catch (err) {
      return res.status(err.status).json({});
    }
  }
  @Put('/add/:id')
  async updatePlayListTracks(
    @Res() res,
    @Param('id') id: string,
    @Body() item: CreateMusicDto,
  ) {
    try {
      const updatePlayList = await this.playlistService.addMusicPlayList(
        id,
        item,
      );
      return res.send({
        updatePlayList,
      });
    } catch (err) {
      return res.status(err.status).json(err.response);
    }
  }
  @Delete(':playlistId/tracks/:trackId')
  async deleteTrackFromPlayList(
    @Param('playlistId') playlistId: string,
    @Param('trackId') trackId: string,
    @Res() res,
  ) {
    try {
      const updatePlayList = await this.playlistService.deleteTrackFromPlayList(
        playlistId,
        trackId,
      );
      return res.send({
        updatePlayList,
      });
    } catch (err) {
      console.error('deleteTrackFromPlayList error:', err);

      return res.status(err.status).json(err.response);
    }
  }
  @Put(':id')
  async updatePlayList(
    @Param('id') id: string,
    @Res() res,
    @Body() updatePlayListDto: UpdatePlaylistDto,
  ) {
    try {
      const updatePlayList = await this.playlistService.updatePlayList(
        id,
        updatePlayListDto,
      );
      return res.send({
        updatePlayList,
      });
    } catch (e) {
      console.log(e);
    }
  }
  @Delete(':id')
  async deletePlayList(@Param('id') id: string) {
    await this.playlistService.deletePlayList(id);
  }
}
