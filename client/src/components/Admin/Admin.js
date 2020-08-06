import React, { useState } from "react";
import classes from "./style.module.scss";
import Axios from "axios";
import { apiUrl } from "../../utils/api";
import { Form, Input, Button, Select, Space, message } from "antd";
import { Link } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";

const { Option } = Select;
const { TextArea } = Input;

const Admin = () => {
  const [form] = useForm();
  const [level, setLevel] = useState(0);
  const [lang, setLang] = useState("javascript");

  const onFinish = async (values) => {
    const { desc } = values;
    const inputs = [];
    const outputs = [];

    if (values?.testcases) {
      for (let caseObj of values.testcases) {
        inputs.push(caseObj.input);
        outputs.push(caseObj.output);
      }
    }
    const dataPost = {
      language: lang,
      level,
      inputs: `[${String(inputs)}]`,
      outputs: `[${String(outputs)}]`,
      desc,
    };
    const res = await Axios.post(`${apiUrl}/api/v1/cheaterrank/test`, dataPost);
    if (res) {
      message.success("Post Test Successfully!");
    }
  };

  const handleChangeLevel = (values) => {
    setLevel(values);
  };
  const handleChangeLang = (values) => {
    setLang(values);
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <div className={classes.addTestForm}>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        style={{ padding: 40, background: "white", width: 500 }}
        form={form}
      >
        <Link to="/" style={{ marginBottom: 20, textDecoration: "underline" }}>
          Back
        </Link>

        <Form.Item label="Level" name="level">
          <Select defaultValue="0" value={level} onChange={handleChangeLevel}>
            <Option value="0">Easy</Option>
            <Option value="1">Hard</Option>
            <Option value="2">Expert</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Language" name="language">
          <Select
            defaultValue="javascript"
            value={lang}
            onChange={handleChangeLang}
          >
            <Option value="javascript" selected>
              Javascript
            </Option>
            <Option value="c">C++</Option>
          </Select>
        </Form.Item>
        <Form.List name="testcases">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "input"]}
                      fieldKey={[field.fieldKey, "input"]}
                      rules={[{ required: true, message: "Missing test case" }]}
                    >
                      <Input placeholder="input" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "output"]}
                      fieldKey={[field.fieldKey, "output"]}
                      rules={[
                        { required: true, message: "Missing expected output" },
                      ]}
                    >
                      <Input placeholder="output" />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> Add Case
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        <Form.Item name="desc" rules={[{ required: true }]}>
          <TextArea placeholder="Test Description" allowClear rows="5" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            size="large"
            type="primary"
            htmlType="submit"
            // disabled={loading ? "disabled" : ""}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Admin;
