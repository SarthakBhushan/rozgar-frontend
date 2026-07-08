import axios from "axios";
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type':'application/json'},
})

api.interceptors.request.use((config) =>{
    console.log("Sending request to:", config.baseURL + config.url);
    const token = localStorage.getItem('rozgar_token')
    if(token) config.headers.Authorization= `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('rozgar_token')
            localStorage.removeItem('rozgar_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api