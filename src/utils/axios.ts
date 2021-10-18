import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://172.30.81.120/18182/'
})

// Add a request interceptor
instance.interceptors.request.use(config => {
    // Do something before request is sent
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((res: any) => res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res), error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
export default instance;