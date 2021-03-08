import { deserializeArray } from "class-transformer";

const defaultHeaders = {
  "Content-Type": "application/json",
};

class APIClient {
  constructor(private readonly apiURL: string) {}

  async signup(username: string, password: string): Promise<void> {
    await fetch(`${this.apiURL}/signup`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        ...defaultHeaders,
      },
    });
  }

  async login(username: string, password: string): Promise<string> {
    const response = await fetch(`${this.apiURL}/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        ...defaultHeaders,
      },
    });
    const data = await response.json();
    return data ? data.token : "";
  }

  async fetchProjects(token: string): Promise<Project[]> {
    const response = await fetch(`${this.apiURL}/projects`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        ...defaultHeaders,
      },
    });
    const data = await response.json();
    if (data) {
      return data.projects;
    }
    return [];
  }

  async fetchTasks(projectId: string, token: string): Promise<Task[]> {
    const response = await fetch(`${this.apiURL}/projects/${projectId}/tasks`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        ...defaultHeaders,
      },
    });
    const data = await response.json();
    if (data) {
      return data.tasks;
    }
    return [];
  }

  async createProject(token: string, project: CreateProject): Promise<void> {
    await fetch(`${this.apiURL}/projects`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        ...defaultHeaders,
      },
      body: JSON.stringify({
        ...project,
      }),
    });
  }

  async createTask(
    projectId: string,
    token: string,
    task: CreateTask
  ): Promise<void> {
    await fetch(`${this.apiURL}/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify({
        ...task,
      }),
      headers: {
        authorization: `Bearer ${token}`,
        ...defaultHeaders,
      },
    });
  }

  async updateTask(
    projectId: string,
    taskId: string,
    token: string,
    task: UpdateTask
  ): Promise<void> {
    await fetch(`${this.apiURL}/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify({
        ...task,
      }),
      headers: {
        authorization: `Bearer ${token}`,
        ...defaultHeaders,
      },
    });
  }
}

export const apiClient: APIClient = new APIClient("/api");

export interface Project {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export interface CreateProject {
  name: string;
}

export interface CreateTask {
  title: string;
}

export interface UpdateTask {
    done: boolean;
}