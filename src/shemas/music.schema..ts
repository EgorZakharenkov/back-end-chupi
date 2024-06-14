import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MusicDocument = HydratedDocument<Music>;

@Schema()
export class Music {
  @Prop({ required: true })
  songName: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ required: true })
  textSong: string;

  @Prop({ default: 0 })
  viewSong: number;

  @Prop({ required: true })
  song: string;

  @Prop()
  imgSong: string;

  @Prop({ required: true })
  duration: string;
}

export const MusicSchema = SchemaFactory.createForClass(Music);
