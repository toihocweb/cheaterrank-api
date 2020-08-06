import Axios from "axios";
import { serverUrl } from "../utils/api";

export const getResults = async (userCode) => {
  try {
    /*eslint-disable no-eval */
    let res = await Axios.post(`${serverUrl}/api/test`, userCode);

    if (res.data.includes("Error")) {
      return res.data;
    } else {
      return eval("(" + res.data + ")");
    }
  } catch (error) {}
};
