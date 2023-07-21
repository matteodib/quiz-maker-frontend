import type { HandleFetch } from "@sveltejs/kit";
import { environment } from "../environment/environment";

export const handleFetch = (async ({ request, fetch }) => {
    const newRequest = new Request(environment.API_URL + request.url, request);
    return fetch(newRequest);
}) satisfies HandleFetch;