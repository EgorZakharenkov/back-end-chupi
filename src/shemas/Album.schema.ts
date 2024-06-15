import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Music } from './music.schema.';
import { Artist } from './artist.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  image: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }],
    default: [],
  })
  songs: Music[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
