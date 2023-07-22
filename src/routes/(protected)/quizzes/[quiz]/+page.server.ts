import { httpGet } from '../../../../utils/handleFetch.js'

export const load = async ({params}) => {
    let response = await httpGet("quizzes/"+params.quiz).catch(err => err)
    if(response) response = response.data
    return response
}