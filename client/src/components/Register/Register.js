import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import classes from "./style.module.scss";
import { useForm } from "antd/lib/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { postingRegister } from "../actions";
import { Link } from "react-router-dom";
import {
  LoginOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { GET_AUTH_ERROR } from "../../saga/types";

const Register = ({ history }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.authErrorReducer.error);

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

  const onFinish = (values) => {
    const { name, email, password, password2 } = values;
    setLoading(true);
    dispatch(postingRegister({ name, email, password, password2, history }));
  };

  const onFinishFailed = (errorInfo) => {};
  return (
    <div className={classes.Wrapper}>
      <div className={classes.Register}>
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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
              {
                min: 6,
                max: 30,
                message: "Name must be between 6 and 30 characters!",
              },
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
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
            <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="password2"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Link to="/login">I have an account</Link>
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
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
