import Task from "../models/task.model";
import { ITaskDocument } from "../interfaces/ITaskDocument";
import { IUser } from "../models/user.model";

interface ICreateTask {
  owner: IUser["_id"];
  description: string;
  completed: boolean;
}

export function createTask({
  owner,
  description,
  completed
}: ICreateTask): Promise<ITaskDocument> {
  return Task.create({ owner, description, completed });
}
