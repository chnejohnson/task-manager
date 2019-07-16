import mongoose, { Schema, Document } from "mongoose";
import { ITaskDocument } from "../interfaces/ITaskDocument";

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

export default mongoose.model<ITaskDocument>("Task", TaskSchema);
