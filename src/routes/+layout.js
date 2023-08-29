export const ssr = false;

import { isLoggedIn } from "../util/auth.js";

export async function load() {
    await isLoggedIn();
}