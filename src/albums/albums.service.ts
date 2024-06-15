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
    const album = await this.albumModel.findById(id).populate('songs').exec();
    if (!album) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return album;
  }

  async update(id: string, updateArtistDto: UpdateAlbumDto): Promise<Album> {
    const updatedAlbum = await this.albumModel
      .findByIdAndUpdate(id, updateArtistDto, { new: true })
      .exec();
    if (!updatedAlbum) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedAlbum;
  }

  async remove(
    id: string,
  ): Promise<ModifyResult<HydratedDocument<Album, {}, {}>>> {
    const deletedAlbum = await this.albumModel.findByIdAndDelete(id).exec();
    if (!deletedAlbum) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return deletedAlbum;
  }

  async addMusic(id: string, musicId: string): Promise<Album> {
    const updatedAlbum = await this.albumModel
      .findByIdAndUpdate(id, { $push: { songs: musicId } }, { new: true })
      .exec();
    if (!updatedAlbum) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedAlbum;
  }

  async removeMusic(id: string, musicId: string): Promise<Album> {
    const updatedAlbum = await this.albumModel
      .findByIdAndUpdate(id, { $pull: { songs: musicId } }, { new: true })
      .exec();
    if (!updatedAlbum) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedAlbum;
  }
}
