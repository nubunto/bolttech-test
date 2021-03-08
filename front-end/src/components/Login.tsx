import { FC } from "react";
import { Form, Input, Button } from "antd";
import { apiClient } from "../api/client";
import ls from "local-storage";
import { useHistory } from "react-router-dom";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export interface LoginProps {}

export const Login: FC<LoginProps> = (props: LoginProps) => {
  const history = useHistory();
  const onFinish = (values: any) => {
    apiClient.login(values.username, values.password).then((token: string) => {
      ls("token", { token });
      history.push('/home');
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <h2>Login</h2>
      <Form
        {...layout}
        name="login"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
