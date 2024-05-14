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

const getFileById = async (fileId) => {
    const config = createConfig();
    return await axios.get(`${backendURL}/api/File/GetFileById/${fileId}`, { ...config, responseType: 'arraybuffer' })
        .then(function (response) {
            return response
        })
        .catch(function (error) {
            return error.response.status
        })
}

export {
    getFileById
};