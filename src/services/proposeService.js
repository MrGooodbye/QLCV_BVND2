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

const createPropose = async (dataObj, onUploadProgress) => {
    const token = localStorage.getItem("jwt");
    return await axios.post(`${backendURL}/api/DocumentIncomming/SendDepartmentHead?Title=${dataObj.document_Incomming_Title}&Content=${dataObj.document_Incomming_Content}`, dataObj.proposeFile,
        {
            headers: {
                "content-type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            onUploadProgress,
        })
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.data
        })
}

const createProposeByHeader = async (dataObj, idDepartment, onUploadProgress) => {
    const token = localStorage.getItem("jwt");
    return await axios.post(`${backendURL}/api/DocumentIncomming/CreateSendByDepartmentId?Title=${dataObj.document_Incomming_Title}&Content=${dataObj.document_Incomming_Content}&DepartmentIdReceive=${idDepartment}`, dataObj.proposeFile,
        {
            headers: {
                "content-type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            onUploadProgress,
        })
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.data
        })
}

const moveupProposeByHeader = async (dataObj, idDepartment) => {
    const token = localStorage.getItem("jwt");
    return await axios.post(`${backendURL}/api/DocumentIncomming/CreateSendByDepartmentId?Title=${dataObj.document_Incomming_Title}&Content=${dataObj.document_Incomming_Content}&DepartmentIdReceive=${idDepartment}&DocIdForward=${dataObj.document_Incomming_Id}`, dataObj.proposeFile, {
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

//chuyển tiếp đề xuất từ DP type = 2 sang DP type = 2 khác
const moveupProposeDepartmentOut = async (dataObj, idDepartment) => {
    const token = localStorage.getItem("jwt");
    return await axios.post(`${backendURL}/api/DocumentIncomming/CreateSendByDepartmentId?Title=${dataObj.documentIncomming.document_Incomming_Title}&Content=${dataObj.documentIncomming.document_Incomming_Content}&Comment=${dataObj.documentIncomming.document_Incomming_Transition_Reason}&DepartmentIdReceive=${idDepartment}&DocIdForward=${dataObj.documentIncomming.document_Incomming_Id}`, dataObj.proposeFileMoveUp,
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

const getProposeSend = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/DocumentIncomming/GetAllDocSendByUserLogin`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getProposeReceiveIn = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/DocumentIncomming/GetAllDocReceiveInDepartment`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getProposeReceiveOut = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/DocumentIncomming/GetAllDocReceiveOutDepartment`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getProposeReceiveById = async (doc_id) => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/DocumentIncomming/GetDocByDocId/${doc_id}`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getProposeReceiveNotification = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/DocumentIncomming/GetListDocReceiveByUserNotification`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const updateProposeState = async (dataObj, state) => {
    const config = createConfig();
    return await axios.put(`${backendURL}/api/DocumentIncomming/UpdateState?docId=${dataObj.documentIncomming.document_Incomming_Id}&state=${state}&Comment=${dataObj.documentIncomming.document_Incomming_Comment}`, '', config)
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.status
        })
}

const updateProposeStateSeen = async (proposeId) => {
    const config = createConfig();
    return await axios.put(`${backendURL}/api/DocumentIncomming/UpdateSeenTrue/${proposeId}`, '', config)
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.status
        })
}

export {
    createPropose, createProposeByHeader, moveupProposeByHeader, moveupProposeDepartmentOut,
    getProposeSend, getProposeReceiveIn, getProposeReceiveOut, getProposeReceiveNotification, getProposeReceiveById,
    updateProposeState, updateProposeStateSeen
};