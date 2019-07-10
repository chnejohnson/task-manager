import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
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
  }
});

UserSchema.statics.findByCredentials = async function(
  email: string,
  password: string
) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Can't find the user with email.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("password isn't correct.");

  return user;
};

UserSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

export default mongoose.model<IUser>("User", UserSchema);
