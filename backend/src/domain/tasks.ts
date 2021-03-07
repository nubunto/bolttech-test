import { v4 as uuid } from "uuid";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(
    projectId: string,
    userId: string,
    createTaskParams: CreateTaskParams
  ): Promise<void> {
    await this.taskRepository.createTask(projectId, userId, createTaskParams);
  }

  async updateTaskById(
    projectId: string,
    userId: string,
    taskId: string,
    updateTaskParams: UpdateTaskParams
  ): Promise<void> {
    await this.taskRepository.updateTaskById(
      projectId,
      userId,
      taskId,
      updateTaskParams
    );
  }

  async findTasksByProjectId(
    projectId: string,
    userId: string
  ): Promise<Task[]> {
    return await this.taskRepository.findTasksByProjectId(projectId, userId);
  }

  async deleteTaskById(
    projectId: string,
    userId: string,
    taskId: string
  ): Promise<void> {
    return await this.taskRepository.deleteTaskById(projectId, userId, taskId);
  }
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  userId: string;
  done: boolean;
}

export interface TaskRepository {
  createTask(
    projectId: string,
    userId: string,
    createTaskParams: CreateTaskParams
  ): Promise<void>;
  updateTaskById(
    projectId: string,
    userId: string,
    taskId: string,
    updateTaskParams: UpdateTaskParams
  ): Promise<void>;
  findTasksByProjectId(projectId: string, userId: string): Promise<Task[]>;
  deleteTaskById(
    projectId: string,
    userId: string,
    taskId: string
  ): Promise<void>;
}

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[];

  constructor() {
    this.tasks = [];
  }

  async createTask(
    projectId: string,
    userId: string,
    createTaskParams: CreateTaskParams
  ): Promise<void> {
    const id = uuid();
    this.tasks.push({
      ...createTaskParams,
      projectId,
      userId,
      id,
      done: false,
    });
  }

  async updateTaskById(
    projectId: string,
    userId: string,
    taskId: string,
    updateTaskParams: UpdateTaskParams
  ): Promise<void> {
    const taskIndex = this.tasks.findIndex(
      (task) => task.projectId === projectId && task.id === taskId
    );
    if (taskIndex === -1) {
      return;
    }
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateTaskParams,
    };
  }

  async findTasksByProjectId(
    projectId: string,
    userId: string
  ): Promise<Task[]> {
    return this.tasks.filter(
      (task) => task.projectId === projectId && task.userId === userId
    );
  }

  async deleteTaskById(
    projectId: string,
    userId: string,
    taskId: string
  ): Promise<void> {
    const taskIndex = this.tasks.findIndex(
      (task) =>
        task.projectId === projectId &&
        task.id === taskId &&
        task.userId === userId
    );
    if (taskIndex === -1) {
      return;
    }
    this.tasks.splice(taskIndex, 1);
  }
}

export interface CreateTaskParams {
  title: string;
}

export interface UpdateTaskParams {
  title: string;
  done: boolean;
}
