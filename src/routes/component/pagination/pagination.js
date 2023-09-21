import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function fetchJobs(page) {
    const response = await fetch(PUBLIC_BACKEND_BASE_URL + `api/collections/jobs/records?page=${page}&perPage=10`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type':'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return await response.json();
    }
}