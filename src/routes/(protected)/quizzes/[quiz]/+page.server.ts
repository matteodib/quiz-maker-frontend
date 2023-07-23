import { httpGet } from '../../../../utils/handleFetch.js'

export const load = async ({params}) => {
    return {
        id: params.quiz
    }
}