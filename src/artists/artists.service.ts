import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../shemas/artist.schema';
import { HydratedDocument, Model, ModifyResult } from 'mongoose';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.artistModel.create(createArtistDto);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistModel.find().exec();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistModel.findById(id).populate('songs').exec();
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const updatedArtist = await this.artistModel
      .findByIdAndUpdate(id, updateArtistDto, { new: true })
      .exec();
    if (!updatedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedArtist;
  }

  async remove(
    id: string,
  ): Promise<ModifyResult<HydratedDocument<ArtistDocument, {}, {}>>> {
    const deletedArtist = await this.artistModel.findByIdAndDelete(id).exec();
    if (!deletedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return deletedArtist;
  }

  async addMusic(id: string, musicId: string): Promise<Artist> {
    const updatedArtist = await this.artistModel
      .findByIdAndUpdate(id, { $push: { songs: musicId } }, { new: true })
      .exec();
    if (!updatedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedArtist;
  }

  async removeMusic(id: string, musicId: string): Promise<Artist> {
    const updatedArtist = await this.artistModel
      .findByIdAndUpdate(id, { $pull: { songs: musicId } }, { new: true })
      .exec();
    if (!updatedArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return updatedArtist;
  }
}
