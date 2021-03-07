import { v4 as uuid } from "uuid";

export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(params: CreateProjectParams): Promise<void> {
    await this.projectRepository.createProject(params);
  }

  async findProjectsByUserId(userId: string): Promise<Project[]> {
    return await this.projectRepository.findProjectsByUserId(userId);
  }

  async updateProjectById(
    projectId: string,
    userId: string,
    params: UpdateProjectParams
  ): Promise<void> {
    return await this.projectRepository.updateProjectById(
      projectId,
      userId,
      params
    );
  }

  async deleteProjectById(projectId: string, userId: string): Promise<void> {
    await this.projectRepository.deleteProjectById(projectId, userId);
  }
}

export interface Project {
  id: string;
  userId: string;
  name: string;
}

export interface ProjectRepository {
  createProject(params: CreateProjectParams): Promise<void>;
  findProjectsByUserId(userId: string): Promise<Project[]>;
  updateProjectById(
    projectId: string,
    userId: string,
    params: UpdateProjectParams
  ): Promise<void>;
  deleteProjectById(projectId: string, userId: string): Promise<void>;
}

export class InMemoryProjectRepository implements ProjectRepository {
  private projects: Project[];

  constructor() {
    this.projects = [];
  }

  async createProject(params: CreateProjectParams): Promise<void> {
    const projectId = uuid();
    this.projects.push({
      ...params,
      id: projectId,
    });
  }

  async findProjectsByUserId(userId: string): Promise<Project[]> {
    return this.projects.filter(
      (project: Project) => project.userId === userId
    );
  }

  async updateProjectById(
    projectId: string,
    userId: string,
    params: UpdateProjectParams
  ): Promise<void> {
    const index = this.projects.findIndex(
      (project) => project.id === projectId && project.userId === userId
    );
    if (index === -1) {
      return;
    }
    this.projects[index] = {
      ...this.projects[index],
      ...params,
    };
  }

  async deleteProjectById(projectId: string, userId: string): Promise<void> {
    const index = this.projects.findIndex(
      (project) => project.id === projectId && project.userId === userId
    );
    if (index === -1) {
      return;
    }
    this.projects.splice(index, 1);
  }
}

export interface CreateProjectParams {
  name: string;
  userId: string;
}

export interface UpdateProjectParams {
  name: string;
}
