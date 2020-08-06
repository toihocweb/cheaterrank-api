import Axios from "axios";
import { apiUrl } from "../utils/api";

export const login = async (dataPost) => {
  const res = await Axios.post(
    `${apiUrl}/api/v1/cheaterrank/auth/login`,
    dataPost
  );
  return res.data;
};

export const register = async (dataPost) => {
  const res = await Axios.post(
    `${apiUrl}/api/v1/cheaterrank/auth/register`,
    dataPost
  );
  return res.data;
};
