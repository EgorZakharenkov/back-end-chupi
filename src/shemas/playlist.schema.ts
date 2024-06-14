import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Music } from './music.schema.';
import { User } from './user.shema';

export type PlayListDocument = Playlist & Document;

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }] })
  tracks: Music[];
}
export const PlayListSchema = SchemaFactory.createForClass(Playlist);
