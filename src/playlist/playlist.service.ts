import { Injectable } from '@nestjs/common';
import { Playlist } from '../shemas/playlist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playListModel: Model<Playlist>,
  ) {}
  async createPlaylist(
    createPlaylistDto: CreatePlaylistDto,
  ): Promise<Playlist> {
    const createdPlaylist = new this.playListModel({
      ...createPlaylistDto,
    });
    return createdPlaylist.save();
  }
  async updatePlayList(
    playlistId: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playListModel.findByIdAndUpdate(playlistId, updatePlaylistDto, {
      new: true,
    });
  }
  async getUserPlaylists(userId: string) {
    console.log('getUserPlaylists userId:', userId);
    return this.playListModel.find({ creator: userId }).exec();
  }
  async addMusicPlayList(playListId: string, item) {
    return this.playListModel.findByIdAndUpdate(
      playListId,
      { $push: { tracks: item } },
      { new: true },
    );
  }
  async getPlayListMusic(playListId: string) {
    return this.playListModel
      .findById(playListId)
      .populate('tracks')
      .lean()
      .exec();
  }
  async deleteTrackFromPlayList(playListId: string, trackId: string) {
    return this.playListModel.findByIdAndUpdate(
      playListId,
      { $pull: { tracks: trackId } },
      { new: true },
    );
  }
  async deletePlayList(playListId: string) {
    return this.playListModel.findByIdAndDelete(playListId, { new: true });
  }
}
