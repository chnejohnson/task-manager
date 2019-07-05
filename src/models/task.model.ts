import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface ITask extends Document {
  owner: IUser["_id"];
  description: string;
  completed: boolean;
}

const TaskSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<ITask>("Task", TaskSchema);
