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

const getDisscussReceiveNotification = async () => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/Task/GetListDiscussByUsserNotification`, config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.status
        })
}

const updateDiscussStateSeen = async (taskId) => {
    const config = createConfig();
    return await axios.put(`${backendURL}/api/Task/UpdateSendDiscussTrue?TaskId=${taskId}`, '', config)
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            return error.response.status
        })
}

export {
    getDisscussReceiveNotification,
    updateDiscussStateSeen
};