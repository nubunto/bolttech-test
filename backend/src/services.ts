import { InMemoryProjectRepository, ProjectService } from "./domain/projects";
import { InMemoryTaskRepository, TaskService } from "./domain/tasks";
import { InMemoryUserRegistry, UserService } from "./domain/users";

export interface Services {
  userService: UserService;
  projectService: ProjectService;
  taskService: TaskService;
}

export const services: Services = {
  userService: new UserService(new InMemoryUserRegistry()),
  projectService: new ProjectService(new InMemoryProjectRepository()),
  taskService: new TaskService(new InMemoryTaskRepository()),
};
