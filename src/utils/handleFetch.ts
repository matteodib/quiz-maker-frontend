import { environment } from "../environment/environment";
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: environment.API_URL,
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar', 'Access-Control-Allow-Origin': '*'}
});

const deleteTokenWhenForbidden = function () {
    document.cookie = "token =; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href= "/login"
};

export const httpGet = async (url: string) => {
    return axiosInstance.get(environment.API_URL + url)
    .catch(err => {
        if(err.response.status == 403 || err.response.status == 500) {
            deleteTokenWhenForbidden()
        }
    })
}

export const httpPost = async (url: string, data: object) => {
    return axiosInstance.post(environment.API_URL + url, data)
    .catch(err => {
        if(err.response.status == 403 || err.response.status == 500) {
            deleteTokenWhenForbidden()
        }
    })
}
export const httpDelete = async (url: string) => {
    return axiosInstance.delete(environment.API_URL + url)
    .catch(err => {
        if(err.response.status == 403 || err.response.status == 500) {
            deleteTokenWhenForbidden()
        }
    })
}
export const httpPatch = async (url: string, body: object) => {
    return axiosInstance.patch(environment.API_URL + url, body)
    .catch(err => {
        if(err.response.status == 403 || err.response.status == 500) {
            deleteTokenWhenForbidden()
        }
    })
}