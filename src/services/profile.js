import axios from "axios";
import Config from "config";
async function getUserProjectListById(payload) {
  axios
    .get(
      `${Config.API_ENDPOINT}/user/${payload.id}/project?page=${payload.page}&per_page=${payload.perPage}`
    )
    .then((e) => {
      console.log(e);
    })
    .catch((err) => {
      console.log(err);
    });
}
export default getUserProjectListById;
