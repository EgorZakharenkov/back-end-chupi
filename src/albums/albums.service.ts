import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, ModifyResult } from 'mongoose';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../shemas/Album.schema';

@Injectable()
export class AlbumsService {
  constructor(@InjectModel(Album.name) private albumModel: Model<Album>) {}

  async create(createArtistDto: CreateAlbumDto): Promise<Album> {
    return await this.albumModel.create(createArtistDto);
  }

  async findAll(): Promise<Album[]> {
    return this.albumModel.find().exec();
  }

  async findOne(id: string): Promise<Album> {
    const artist = await this.albumModel.findById(id).populate('songs').exec();
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateAlbumDto): Promise<Album> {
    const updatedArtist = await this.albumModel
      .findByIdAndUpdate(id, updateArtistDto, { new: true })
      .exec();
    if (!updatedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedArtist;
  }

  async remove(
    id: string,
  ): Promise<ModifyResult<HydratedDocument<Album, {}, {}>>> {
    const deletedArtist = await this.albumModel.findByIdAndDelete(id).exec();
    if (!deletedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return deletedArtist;
  }

  async addMusic(id: string, musicId: string): Promise<Album> {
    const updatedArtist = await this.albumModel
      .findByIdAndUpdate(id, { $push: { songs: musicId } }, { new: true })
      .exec();
    if (!updatedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedArtist;
  }

  async removeMusic(id: string, musicId: string): Promise<Album> {
    const updatedArtist = await this.albumModel
      .findByIdAndUpdate(id, { $pull: { songs: musicId } }, { new: true })
      .exec();
    if (!updatedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedArtist;
  }
}
