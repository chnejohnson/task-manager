import Task, { ITask } from "../models/task.model";
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
}: ICreateTask): Promise<ITask> {
  return Task.create({ owner, description, completed });
}
