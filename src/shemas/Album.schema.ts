import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Music } from './music.schema.';

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
