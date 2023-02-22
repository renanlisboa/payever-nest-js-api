import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: false,
  })
  avatar?: string;

  @Prop()
  name: string;

  @Prop()
  job: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
