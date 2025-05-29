import axios from "axios";

const API_URL = "http://192.168.164.5:8000/account";

export const changePassword = async (userId, formData) => {
    try {
        const apiUrl = `${API_URL}/change-password/${userId}`;
        const response = await axios.put(apiUrl, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.data; // Trả về dữ liệu từ server
    } catch (error) {
        console.log("Lỗi khi đổi mật khẩu:", error.response?.data || error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
};
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email: email,
            mat_khau: password
        });

        return response.data; // Trả về dữ liệu đăng nhập
    } catch (error) {
        console.log("Lỗi đăng nhập:", error.response?.data || error.message);
        throw error; // Ném lỗi để xử lý ở component
    }
};
export const signup = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/register`,
            data
        );

        return response.data; // Trả về dữ liệu đăng nhập
    } catch (error) {
        // console.error("Lỗi đăng nhập:", error.response?.data || error.message);
        // throw error; // Ném lỗi để xử lý ở component
    }
};
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgotpassword`, { email });
        return response.data;
    } catch (error) {
        console.log("Lỗi quên mật khẩu:", error.response?.data || error.message);
        throw error;
    }
};