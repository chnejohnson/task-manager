import mongoose, { Schema, Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserDocument } from "../interfaces/IUserDocument";

export interface IUser extends IUserDocument {
  generateAuthToken(): string;
}

export interface IUserModel extends Model<IUser> {
  findByCredentials(email: string, password: string): IUser;
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
    unique: true,
    trim: true,
    lowercase: true,
    validator(value: string) {
      if (!validator.isEmail(value)) throw new Error("Email is invalid");
    }
  },
  password: {
    type: String,
    required: true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ id: user._id.toString() }, "thisisprivatekey");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

UserSchema.statics.findByCredentials = async function(
  email: string,
  password: string
) {
  const user: IUser = await this.findOne({ email });
  if (!user) throw new Error("Can't find the user with email.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("password isn't correct.");

  return user;
};

UserSchema.pre<IUser>("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
