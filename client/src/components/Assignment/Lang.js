import React, { useState, useEffect } from "react";
import Aside from "../Aside/Aside";
import CodeEditor from "../CodeEditor/CodeEditor";
import { useSelector } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
import openSocket from "socket.io-client";
import { Button, Popover } from "antd";

const Lang = () => {
  const [loading, setLoading] = useState(false);
  const currentTestFromStore = useSelector(
    (state) => state.testReducer.currentTest
  );
  const [online, setOnline] = useState([]);
  const currentUserFromStore = useSelector(
    (state) => state.authReducer.currentUser
  );

  useEffect(() => {
    if (currentTestFromStore) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLoading(true);
    }
    return () => {};
  }, [currentTestFromStore]);

  useEffect(() => {
    const socket = openSocket("http://localhost:8000");
    socket.emit("user", {
      id: currentUserFromStore.id,
      name: currentUserFromStore.name,
    });
    socket.on("get online users", (data) => setOnline(data));
    return () => {};
  }, []);

  const renderLoading = () => (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HashLoader size={80} color={"#1DA57A"} loading={loading} />
    </div>
  );

  const content = (
    <div>
      {online.map((user) => (
        <div>{user.name}</div>
      ))}
    </div>
  );

  return !loading ? (
    <>
      <Aside />
      <CodeEditor
        currentUserFromStore={currentUserFromStore}
        currentTestFromStore={currentTestFromStore}
      />
      <div style={{ position: "fixed", bottom: 0, right: 0 }}>
        <Popover content={content} trigger="hover">
          <Button type="primary">{`${online.length} users online`}</Button>
        </Popover>
      </div>
    </>
  ) : (
    renderLoading()
  );
};

export default Lang;
