import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UsersDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, min: 1 })
  username: string;
  @Prop({ required: true, min: 1 })
  password: string;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  image: string;
  @Prop({ default: 'user' })
  role: string;
  _id: mongoose.Types.ObjectId | string;
  _doc: any;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
