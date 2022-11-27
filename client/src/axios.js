import axios from "axios";

// 로그인이 안되어있는 경우에 사용하는 API(토큰이 없는경우 요청)
export const API = axios.create({
    // baseURL: "http://127.0.0.1:5000",
    baseURL: "http://54.180.141.7:5000",
    headers:{
        "Content-Type": "application/json",
    },
});


// 로그인이 되어있는 경우 사용하는 API(토큰이 있는경우 요청)
export const LogAPI = axios.create({
    baseURL: "http://54.180.141.7:5000",
    headers:{
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("user")}`
    },
})