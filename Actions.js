import axios from "axios";
export async function postAction(data) {
  let headers = {};

  headers["Content-Type"] = "multipart/form-data";

  let config = { headers };

  axios
    .post(`https://task-21.herokuapp.com/store`, data, config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      console.log(err.response);
    });
}

export async function getAction(url) {
  return axios.get(`${url}`);
}

export default { postAction, getAction };
