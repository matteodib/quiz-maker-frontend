export const load = async ({params}) => {
    console.log(params)
    return {
        session: params.quizsession
    }
}