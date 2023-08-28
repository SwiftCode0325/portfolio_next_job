import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

//Get data for specific job id from database using `api/collections/jobs/records/${params.slug}`//
export async function load({ fetch, params }) {
    const resp = await fetch( PUBLIC_BACKEND_BASE_URL + `api/collections/jobs/records/${params.slug}`);

    const res = await resp.json();

    if(resp.status == 200){
        return {
            job: res 
        }
    } else {
        return {
            jobs: []
        }
    }

}