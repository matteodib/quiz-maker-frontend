import { redirect } from '@sveltejs/kit'
import { httpPost } from './utils/handleFetch'

//è un file che viene runnato server side quindi non potendo accedere al localstorage del browser bisogna utilizzare i cookies
export const handle = async ({event, resolve }) => {

    let isLogged = false

    const token = event.cookies.get("token")
    if(token) {
        const response = await httpPost("user/is-logged", {token}).catch(err => console.log(err))
        if(response) isLogged = response.data
    }

    if(event.route.id?.startsWith("/(protected)") && !isLogged) {
        throw redirect(303, "/login")
    }
    
    if(event.route.id?.startsWith("/login") && isLogged) {
        throw redirect(303, "/quizzes")
    }

    return await resolve(event)
}