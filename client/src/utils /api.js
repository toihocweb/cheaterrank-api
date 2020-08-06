export const apiUrl =
  process.env.REACT_APP_ENV === "prod"
    ? "https://toihocweb.net"
    : "http://localhost:8000";

export const serverUrl =
  process.env.REACT_APP_ENV === "prod"
    ? "https://toihocweb.net"
    : "http://localhost:5000";
