import { VITE_PUBLIC_API_URL, VITE_PUBLIC_SITE_URL } from "$env/static/private";


export const environment = {
    //API_URL: 'http://r2u.online:8081/',
    API_URL: VITE_PUBLIC_API_URL,
    SITE_URL: VITE_PUBLIC_SITE_URL
}