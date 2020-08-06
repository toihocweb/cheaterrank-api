import Axios from "axios";
import { apiUrl } from "../utils/api";

export const submit = async (dataPost) => {
  const res = await Axios.post(
    `${apiUrl}/api/v1/cheaterrank/test/submit`,
    dataPost
  );
  return res.data;
};
