import React, { useState } from "react";
import { Menu, Button, Table, Tag, Space } from "antd";
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Admin from "./Admin";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (tags) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const AdminLayout = () => {
  const [state, setState] = useState("users");
  const renderUsers = () => {
    console.log("user");
  };
  const renderTests = () => {
    console.log("test");
  };
  const Layout = ({ state }) =>
    state === "users" ? <h1>usr</h1> : <h1>test</h1>;
  return (
    <div>
      <div
        style={{
          width: 200,
          height: "100vh",
          background: "white",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="light"
        >
          <Menu.Item
            onClick={() => setState("users")}
            key="1"
            icon={<PieChartOutlined />}
          >
            Users
          </Menu.Item>
          <Menu.Item
            onClick={() => setState("tests")}
            key="2"
            icon={<DesktopOutlined />}
          >
            Tests
          </Menu.Item>
        </Menu>
      </div>
      <div style={{ marginLeft: 210, paddingTop: 20, paddingRight: 30 }}>
        {/* <Layout state={state} /> */}
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default AdminLayout;
