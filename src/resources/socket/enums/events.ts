import { Task } from "src/resources/task/entity/task.entity";

export enum EventType {
  NEW_TASK="NEW_TASK",
}

export class NewTaskEvent {
  eventType: EventType.NEW_TASK;
  payload: Task;
}