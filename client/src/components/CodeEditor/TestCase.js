import React, { useRef } from "react";
import classes from "./style.module.scss";
import { useSelector } from "react-redux";
import { CheckOutlined, CloseOutlined, SyncOutlined } from "@ant-design/icons";
const TestCase = ({ currentTest }) => {
  const result = useSelector((state) => state.resultReducer.results);
  const loading = useSelector((state) => state.resultReducer.isLoading);

  const refs = useRef([]);
  refs.current = [];

  const renderIcon = (passed) => {
    return passed ? (
      <CheckOutlined style={{ marginLeft: 10 }} />
    ) : (
      <CloseOutlined
        style={{ marginLeft: 10, color: "#e74c3c", fontSize: 16 }}
      />
    );
  };

  const handleActive = (idx) => {
    if (refs.current[idx].style.display !== "none") {
      refs.current[idx].style.display = "none";
    } else {
      refs.current[idx].style.display = "block";
    }
  };

  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      el.style.display = "none";
      refs.current.push(el);
    }
  };

  const renderResult = (index) => {
    if (result) {
      if (loading) {
        return <SyncOutlined spin style={{ marginLeft: 10, fontSize: 16 }} />;
      } else {
        return result.failed_cases.includes(index + 1)
          ? renderIcon(false)
          : renderIcon(true);
      }
    }
  };

  return (
    <div style={{ marginLeft: 20 }} className={classes.cases}>
      <ul>
        {JSON.parse(currentTest.inputs.split("'").join('"')).map(
          (val, index) => (
            <li key={index}>
              <div
                onClick={() => handleActive(index)}
                className={classes.caseTitle}
                style={{ display: "flex", alignItems: "center" }}
              >
                Test Case {index + 1}
                {renderResult(index)}
              </div>
              <div ref={addToRefs} style={{ display: "none" }}>
                <div className={classes.caseDetail}>
                  <p>Input</p>
                  <span>{JSON.stringify(val)}</span>
                  <p style={{ marginTop: 20 }}>Output</p>
                  <span>
                    {JSON.stringify(
                      JSON.parse(currentTest.outputs.split("'").join('"'))[
                        index
                      ]
                    )}
                  </span>

                  {result && (
                    <>
                      <p style={{ marginTop: 20 }}>Your Result</p>
                      <span
                        style={{
                          color: result.failed_cases.includes(index + 1)
                            ? "#e74c3c"
                            : "#e67e22",
                        }}
                      >
                        {typeof result.code_result[index] !== "undefined"
                          ? JSON.stringify(result.code_result[index])
                          : "undefined"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default React.memo(TestCase);
