import mongoose, { HydratedDocument, Mongoose } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Music } from './music.schema.';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema()
export class Artist {
  @Prop({ required: true })
  name: string;
  @Prop()
  image: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }],
  })
  songs: Music[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
