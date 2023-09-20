import { writable } from "svelte/store";

export let showPassword = writable(true);

// function to toggle the state of the showPassword store //
export function togglePasswordVisibility() {
    showPassword != showPassword;
}