import Axios from "axios";

export const formatDate = (taskDate) => {
  const date = new Date(taskDate);
  return date.getMonth() + "/" + date.getDate() + ", " + date.getHours() + ":" + date.getMinutes();
};

export const setAuthToken = (token) => {
  if (token) Axios.defaults.headers.common["x-auth-token"] = token;
  else delete Axios.defaults.headers.common["x-auth-token"];
};
