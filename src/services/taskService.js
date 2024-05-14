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

const createTaskCategory = async (category_Name) => {
    const config = createConfig();
    return await axios.post(`${backendURL}/api/TaskCategory`, { category_Name }, config)
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.status
        })
}

const assignDivineWork = async (dataObj, onUploadProgress) => {
    const token = localStorage.getItem("jwt");
    return await axios.post(`${backendURL}/api/Task/CreateTaskByDocSendId?DocSendId=${dataObj.document_Send_Id}&UserReceive=${dataObj.userReceive_Id}&Title=${dataObj.task_Title}&Content=${dataObj.task_Content}&TimeStart=${dataObj.task_DateStart}&Deadline=${dataObj.task_DateEnd}&CatagoryId=${dataObj.task_Catagory_Id}`, dataObj.fileArray,
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

const createSendDiscuss = async (dataObj) => {
    const config = createConfig();
    return await axios.post(`${backendURL}/api/Task/CreateSendDiscuss?TaskId=${dataObj.task_Id}&Content=${dataObj.task_DiscussContent}`, '', config)
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.status
        })
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

const getTaskReceiveNotification = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/Task/GetListTaskUserReceiveNotification`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getListTaskByDocSendId = async (docSendId) => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/Task/GetListTaskByDocSendId/${docSendId}`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getDocByDocId = async (docSendId) => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/DocumentSend/GetDocByDocId/${docSendId}`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getListDiscussByTaskId = async (TaskId) => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/Task/GetListDiscussByTaskId/${TaskId}`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getListTaskReceiveCurrentMonth = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/Task/GetListTaskReceiveCurrentMonth`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getListTaskReceiveByMonthAndYear = async (month, year) => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/Task/GetListTaskReceiveMonth?Month=${month}&Year=${year}`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const getByTaskId = async (id) => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/Task/GetByTaskId/${id}`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const updateTaskStateSeen = async (taskId) => {
    const config = createConfig();
    return await axios.put(`${backendURL}/api/Task/UpdateSendTaskTrue?TaskId=${taskId}`, '', config)
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.status
        })
}

const updateConfirmCompletionTask = async (taskId, fileCompleted, onUploadProgress) => {
    const token = localStorage.getItem("jwt");
    return await axios.put(`${backendURL}/api/Task/ConfirmCompletionTask?taskId=${taskId}`, fileCompleted,
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

export {
    createTaskCategory, assignDivineWork, createSendDiscuss,
    getTaskCategory, getTaskReceiveNotification, getListTaskByDocSendId, getDocByDocId, getListDiscussByTaskId, getListTaskReceiveCurrentMonth, getListTaskReceiveByMonthAndYear, getByTaskId,
    updateTaskStateSeen, updateConfirmCompletionTask
};