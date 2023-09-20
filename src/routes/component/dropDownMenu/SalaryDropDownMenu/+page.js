import { writable } from "svelte/store";

export let salaryDropDownMenu = writable(false);

export function openSalaryDropDownMenu () {
    salaryDropDownMenu.update(value => !value);
}

