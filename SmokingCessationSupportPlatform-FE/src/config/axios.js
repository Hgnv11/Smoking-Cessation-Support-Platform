import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/", 
});

const handleBefore = (config) => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    console.log("Using token for request:", token); // log lại để kiểm tra token trong localStorage
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  };
  
  const handleError = (error) => {
    console.log(error);
  };

  api.interceptors.request.use(handleBefore, handleError);

export default api;
