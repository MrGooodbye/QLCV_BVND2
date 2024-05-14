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

const createDocIncoming = async (dataObj) => {
  const token = localStorage.getItem("jwt");
  return await axios.post(`${backendURL}/api/DocumentIncomming/Create?Title=${dataObj.docName}&Content=${dataObj.docDes}&TimeStart=${dataObj.docExpireStart}&TimeEnd=${dataObj.docExpireEnd}`,
    dataObj.files, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function (response) {
      return response.status
    })
    .catch(function (error) {
      return error.response.status
    })
}

//lấy văn bản theo dạng không phân trang
const getAllDocSendUserLogin = async () => {
  const config = createConfig();
  return await axios.get(`${backendURL}/api/DocumentIncomming/GetAllDocSendUserLogin`, config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error.response.status
    })
}

//lấy văn bản theo dạng phân trang
const getListByUserLimitNumberPage = async (limit, page) => {
  const config = createConfig();
  return await axios.get(`${backendURL}/api/DocumentSend/GetListDocSendByUserLimitNumberPage/${limit}/${page}`, config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error.response.status
    })
}

const createDocSendPublicByDocIn = () => {

}

export {
  createDocIncoming, getAllDocSendUserLogin, getListByUserLimitNumberPage,

  createDocSendPublicByDocIn,
};