import React, { useEffect } from "react";
import classes from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchingTests, gettingTest } from "../actions";
import { CodeOutlined } from "@ant-design/icons";
const Aside = () => {
  const dispatch = useDispatch();
  const tests = useSelector((state) => state.testReducer.tests);
  const currentTest = useSelector((state) => state.testReducer.currentTest);

  useEffect(() => {
    dispatch(fetchingTests());
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClick = (id) => {
    dispatch(gettingTest(id));
  };
  return (
    <aside className={classes.Aside}>
      <nav>
        <ul>
          {tests &&
            tests.map((val, index) => (
              <li
                onClick={() => handleClick(val._id)}
                key={val._id}
                className={
                  currentTest && currentTest._id === val._id
                    ? classes.active
                    : ""
                }
              >
                Challenge {index + 1}
                <CodeOutlined style={{ marginLeft: 5 }} />
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
};

export default React.memo(Aside);
