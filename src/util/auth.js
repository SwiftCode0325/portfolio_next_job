import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function authenticateUser(username, password) {
    const resp = await fetch(
        PUBLIC_BACKEND_BASE_URL + 'api/collections/users/auth-with-password',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identity: username,
                password
            })
        }
    );

    const res = await resp.json();

    if(resp.status == 200) {
        localStorage.setItem("auth", JSON.stringify({
            "token": res.token,
            "userId": res.record.id
        }));
        return {
            success: true,
            res: res
        }
    }

    return {
        success: false,
        res: res
    }
}