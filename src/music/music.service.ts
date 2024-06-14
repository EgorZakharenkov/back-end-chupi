import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { Music } from '../shemas/music.schema.';

@Injectable()
export class MusicService {
  constructor(@InjectModel(Music.name) private MusicModel: Model<Music>) {}
  getAll() {
    return this.MusicModel.find().exec();
  }
  getOne(id: string) {
    return this.MusicModel.findOneAndUpdate(
      { _id: id },
      {
        $inc: { viewSong: 1 },
      },
      {
        returnDocument: 'after',
      },
    ).exec();
  }
  create(createMusicDto: CreateMusicDto) {
    const createMusic = new this.MusicModel(createMusicDto);
    return createMusic.save();
  }
  update(id: string, updateMusicDto: UpdateMusicDto) {
    const updateMusic = this.MusicModel.findByIdAndUpdate(id, updateMusicDto, {
      new: true,
    });
    if (!updateMusic) {
      throw new NotFoundException(`updateMusic #${id} not found`);
    }
    return updateMusic;
  }
  delete(id: string) {
    const deleteMusic = this.MusicModel.findByIdAndDelete(id);
    if (!deleteMusic) {
      throw new NotFoundException(`Music #${id} not found`);
    }
    return deleteMusic;
  }
}
