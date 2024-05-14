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

const getTaskCategory = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/TaskCategory`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

//đề xuất bên ngoài gửi vào để làm
const createDocSendPublicByDocIn = async (dataObj) => {
    const token = localStorage.getItem("jwt");
    return await axios.post(`${backendURL}/api/DocumentSend/CreateDocSendPublicByDocIn?DocIncommingId=${dataObj.documentIncomming.document_Incomming_Id}&Title=${dataObj.documentIncomming.document_Incomming_Title}&Content=${dataObj.documentIncomming.document_Incomming_Content}&TimeStart=${dataObj.documentIncomming.document_Incomming_TimeStart}&Deadline=${dataObj.documentIncomming.document_Incomming_Deadline}&CatagoryId=${dataObj.documentIncomming.document_Incomming_Category}`, dataObj.fileIds,
        {
            headers: {
                "content-type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        })
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getAllDocSendPublicByUserLogin = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/DocumentSend/GetAllDocSendPublicByUserLogin`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

export {
    getTaskCategory,
    createDocSendPublicByDocIn,
    getAllDocSendPublicByUserLogin
};