import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  name: string;
  email: string;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validator(value: string) {
      if (!validator.isEmail(value)) throw new Error("Email is invalid");
    }
  }
});

export default mongoose.model<IUser>("User", UserSchema);
