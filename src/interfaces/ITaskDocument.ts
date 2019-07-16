import { Document } from "mongoose";
import { IUser } from "../models/user.model";

export interface ITaskDocument extends Document {
  description: string;
  completed: boolean;
  owner: IUser["_id"];
}
