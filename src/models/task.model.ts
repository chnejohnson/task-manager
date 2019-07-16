import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface ITask extends Document {
  owner: IUser["_id"];
  description: string;
  completed: boolean;
}

const TaskSchema: Schema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

export default mongoose.model<ITask>("Task", TaskSchema);
