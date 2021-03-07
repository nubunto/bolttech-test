import { plainToClass } from "class-transformer";
import express, {
  Handler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { Config } from "./config";
import { User } from "./domain/users";
import { CreateUserRequest } from "./requests/CreateUserRequest";
import { LoginRequest } from "./requests/LoginRequest";
import { Services } from "./services";
import jwt from "jsonwebtoken";
import { CreateProjectRequest } from "./requests/CreateProjectRequest";
import { UpdateProjectRequest } from "./requests/UpdateProjectRequest";
import { CreateTaskRequest } from "./requests/CreateTaskRequest";
import { UpdateTaskRequest } from "./requests/UpdateTaskRequest";

const wrap = (handler: Handler) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Promise.resolve(handler(req, res, next)).catch(next);
};

const jwtVerify = (jwtSecret: string): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization?.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "forbidden",
    });
  }
  const verified = jwt.verify(
    authorization.substring("Bearer ".length),
    jwtSecret
  ) as Record<string, unknown>;
  if (verified) {
    req.user = {
      id: verified.id as string,
    };
    return next();
  }
  return res.status(403).json({
    message: "not authorized",
  });
};

export const installRoutes = (services: Services, config: Config): Router => {
  const router = express.Router();
  router.post(
    "/signup",
    wrap(async (req: Request, res: Response) => {
      const user: CreateUserRequest = plainToClass(CreateUserRequest, req.body);
      await services.userService.createUser(user);
      return res.status(202).json({
        ok: true,
        user,
      });
    })
  );

  router.post(
    "/login",
    wrap(async (req: Request, res: Response) => {
      const login: LoginRequest = plainToClass(LoginRequest, req.body);
      const user: User | null = await services.userService.findByUsernameAndPassword(
        login
      );
      if (!user) {
        return res.status(400).json({
          message: "not found",
        });
      }
      const token = jwt.sign({ userId: user.username }, config.jwtSecret);
      return res.status(200).json({
        token,
      });
    })
  );

  /* PROJECTS */
  router.get(
    "/projects",
    jwtVerify(config.jwtSecret),
    wrap(async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
      const projects = await services.projectService.findProjectsByUserId(
        req.user.id
      );
      return res.status(200).json({
        projects,
      });
    })
  );

  router.post(
    "/projects",
    jwtVerify(config.jwtSecret),
    wrap(async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
      const project = plainToClass(CreateProjectRequest, req.body);
      await services.projectService.createProject({
        ...project,
        userId: req.user.id,
      });
      return res.status(201).json({
        ok: true,
        message: "created successfully",
      });
    })
  );

  router.put(
    "/projects/:id",
    jwtVerify(config.jwtSecret),
    wrap(async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
      const body = plainToClass(UpdateProjectRequest, req.body);
      const userId = req.user.id;
      const projectId = req.params.id;
      await services.projectService.updateProjectById(projectId, userId, body);
      return res.json({
        ok: true,
        message: "updated successfully",
      });
    })
  );

  router.delete(
    "/projects/:id",
    jwtVerify(config.jwtSecret),
    wrap(async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
      const userId = req.user.id;
      const projectId = req.params.id;
      await services.projectService.deleteProjectById(projectId, userId);
      return res.json({
        ok: true,
        message: "deleted successfully",
      });
    })
  );

  /* TASKS */
  router.get(
    "/projects/:id/tasks",
    jwtVerify(config.jwtSecret),
    wrap(async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
      const projectId = req.params.id;
      const userId = req.user.id;
      const tasks = await services.taskService.findTasksByProjectId(
        projectId,
        userId
      );
      return res.json({
        tasks,
      });
    })
  );

  router.post(
    "/projects/:id/tasks",
    jwtVerify(config.jwtSecret),
    wrap(async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
      const createTaskRequest = plainToClass(CreateTaskRequest, req.body);
      const projectId = req.params.id;
      const userId = req.user.id;
      await services.taskService.createTask(
        projectId,
        userId,
        createTaskRequest
      );
      return res.json({
          ok: true
      });
    })
  );

  router.put(
    "/projects/:projectId/tasks/:id",
    jwtVerify(config.jwtSecret),
    wrap(async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
      const updateTaskRequest = plainToClass(UpdateTaskRequest, req.body);
      const projectId = req.params.projectId;
      const taskId = req.params.id;
      const userId = req.user.id;
      await services.taskService.updateTaskById(
        projectId,
        userId,
        taskId,
        updateTaskRequest
      );
      return res.json({
        ok: true,
      });
    })
  );

  router.delete(
    "/projects/:projectId/tasks/:id",
    jwtVerify(config.jwtSecret),
    wrap(async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
      const projectId = req.params.projectId;
      const userId = req.user.id;
      const taskId = req.params.id;
      await services.taskService.deleteTaskById(projectId, userId, taskId);
      return res.json({
        ok: true,
      });
    })
  );

  router.get(
    "/",
    wrap(async (_req: Request, res: Response) => {
      return res.json({
        message: "ok",
      });
    })
  );

  return router;
};
