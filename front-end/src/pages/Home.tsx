import React, { FC, useEffect, useState } from "react";
import { get } from "local-storage";
import { Card, Button, Modal, Form, Input, Checkbox } from "antd";
import { apiClient, Project, Task } from "../api/client";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

export const Home: FC = () => {
  const [reload, setReload] = useState(false);
  const onProjectCreated = () => {
    setReload(!reload);
  };
  return (
    <>
      <h1>Home</h1>
      <Projects reload={reload} />
      <AddProject onProjectCreated={onProjectCreated} />
    </>
  );
};

interface AddProjectProps {
  onProjectCreated: () => void;
}
const AddProject: FC<AddProjectProps> = ({ onProjectCreated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const onFinish = (values: any) => {
    const data = get<{ token: string }>("token");
    apiClient.createProject(data.token, { name: values.name }).then(() => {
      onProjectCreated();
      setIsVisible(false);
    });
  };
  return (
    <>
      <Button onClick={() => setIsVisible(true)} type="primary">
        Add Project
      </Button>
      <Modal
        visible={isVisible}
        onOk={() => setIsVisible(false)}
        onCancel={() => setIsVisible(false)}
        destroyOnClose
      >
        <Form name="c" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please write a name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

interface ProjectsProps {
  reload: boolean;
}
const Projects: FC<ProjectsProps> = (props: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    const data = get<{ token: string }>("token");
    apiClient.fetchProjects(data.token).then((projects) => {
      setProjects(projects);
    });
  }, [reload, props.reload]);
  const onTaskCreated = () => {
    setReload(!reload);
  };
  return (
    <>
      {projects.map((project, i) => (
        <>
          <Card title={project.name}>
            <Tasks projectId={project.id} reload={reload} />
            <AddTask projectId={project.id} onTaskCreated={onTaskCreated} />
          </Card>
        </>
      ))}
    </>
  );
};

interface TasksProps {
  projectId: string;
  reload: boolean;
}
const Tasks: FC<TasksProps> = ({ projectId, reload }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reloadTasks, setReload] = useState(false);
  useEffect(() => {
    const data = get<{ token: string }>("token");
    apiClient.fetchTasks(projectId, data.token).then((tasks) => {
      setTasks(tasks);
    });
  }, [projectId, reload, reloadTasks]);
  const onTaskChange = (task: Task) => (value: CheckboxChangeEvent) => {
    const data = get<{ token: string }>("token");
    apiClient
      .updateTask(projectId, task.id, data.token, {
        done: value.target.checked,
      })
      .then(() => {
        setReload(!reloadTasks);
      });
  };
  return (
    <>
      {tasks.map((task, i) => (
        <div key={i}>
          <Checkbox checked={task.done} onChange={onTaskChange(task)} /> {task.title}
        </div>
      ))}
    </>
  );
};

interface AddTaskProps {
  projectId: string;
  onTaskCreated: () => void;
}
const AddTask: FC<AddTaskProps> = ({ projectId, onTaskCreated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const onFinish = (values: any) => {
    const data = get<{ token: string }>("token");
    apiClient
      .createTask(projectId, data.token, { title: values.title })
      .then(() => {
        onTaskCreated();
        setIsVisible(false);
      });
  };
  return (
    <>
      <Button onClick={() => setIsVisible(true)} type="primary">
        Add Task
      </Button>
      <Modal
        visible={isVisible}
        onOk={() => setIsVisible(false)}
        onCancel={() => setIsVisible(false)}
        destroyOnClose
      >
        <Form name="login" onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please write a title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
