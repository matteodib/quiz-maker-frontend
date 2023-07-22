import { environment } from "../environment/environment";
import axios from "axios";

export const httpGet = async (url:string) => {
    return axios.get(environment.API_URL+url)
}

export const httpPost = async (url:string, data: object) => {
    return axios.post(environment.API_URL+url, data)
}
export const httpDelete = async (url:string) => {
    return axios.delete(environment.API_URL+url)
}
export const httpPatch = async (url:string, body: object) => {
    return axios.patch(environment.API_URL+url, body)
}