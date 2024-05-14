import axios from "axios";

const backendURL = 'http://146.190.89.3:9090';

const createConfig = () => {
  const token = localStorage.getItem("jwt");
  // Thiết lập tiêu đề "Authorization" trong yêu cầu Axios
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
}

const getAllDepartment = async () => {

}

const getAllDepartmentByType = async (typeInt) => {
  const config = createConfig();
  return await axios.get(`${backendURL}/api/Department/GetDepartmentByType/${typeInt}`, config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error.response.status
    })
}

const getUserInDepartment = async (id) => {
  const config = createConfig();
  return await axios.get(`${backendURL}/api/Department/GetUserByDepartmentId/${id}`, config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error.response.status
    })
}

export {
  getAllDepartment, getAllDepartmentByType, getUserInDepartment
}