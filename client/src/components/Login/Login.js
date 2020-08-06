import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import classes from "./style.module.scss";
import { useForm } from "antd/lib/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { postingLogin } from "../actions";
import { Link } from "react-router-dom";
import { LoginOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { GET_AUTH_ERROR } from "../../saga/types";

const Login = ({ history }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.authErrorReducer.error);
  const currentUser = useSelector((state) => state.authReducer.currentUser);
  useEffect(() => {
    if (error) {
      const fieldErr = error.field;
      setLoading(false);
      form.setFields([
        {
          name: fieldErr,
          errors: [error.msg],
        },
      ]);
    }
    return () => {
      dispatch({ type: GET_AUTH_ERROR, error: null });
    };
  }, [error]);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }
    return () => {};
  }, [currentUser]);

  const onFinish = (values) => {
    const { email, password } = values;
    setLoading(true);
    dispatch(postingLogin({ email, password, history }));
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <div className={classes.Wrapper}>
      <div className={classes.Login}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          form={form}
        >
          <Link
            to="/"
            style={{ marginBottom: 20, textDecoration: "underline" }}
          >
            Back
          </Link>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input your email!",
              },
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Link to="/register">Don't have an account?</Link>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: "100%" }}
              size="large"
              type="primary"
              htmlType="submit"
              disabled={loading ? "disabled" : ""}
              icon={<LoginOutlined />}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
