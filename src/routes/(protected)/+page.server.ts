export const load = ({cookies}) => {
    const allCookies = cookies.getAll();
    console.log(allCookies)
    return {
        data: allCookies
    }
}