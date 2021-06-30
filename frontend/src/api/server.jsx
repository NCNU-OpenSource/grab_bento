import axios from "axios";
const serverURL = {replace this};
const localURL = "http://192.168.0.100:8080";

const userRequest = axios.create({
  baseURL: `${serverURL}`,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
    "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
    "Content-Type": "multipart/form-data",
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
});

const update_jwt = async (tok) => {
  userRequest.defaults.headers.common["Authorization"] = tok;
  console.log(userRequest.defaults.headers.common["Authorization"]);
};

const makeFd = (data) => {
  let fd = new FormData();
  for (const key in data) {
    fd.append(key, data[key]);
  }
  return fd;
};

const create_enroll = async (data) =>
  userRequest.post(`/reserve`, makeFd(data));
const delete_enroll = async (data) =>
  userRequest.post(`/cancel`, makeFd(data));

const get_all_event = async () => userRequest.get(`/user_events`);

export { get_all_event, create_enroll, delete_enroll, update_jwt, localURL, serverURL };
