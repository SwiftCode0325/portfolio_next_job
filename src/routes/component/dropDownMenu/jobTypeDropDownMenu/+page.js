import { writable } from "svelte/store";

export let jobTypeDropDownMenu = writable(false);
export let selectedJobType = [];

export function openJobTypeDropDownMenu() {
    jobTypeDropDownMenu.update(value => !value);
}

//this function is used to get the desired job type and set into selectedJobType array//
export function updateSelectedJobTypes (jobType) {
    if(selectedJobType.includes(jobType)) {
      selectedJobType = selectedJobType.filter(item => item !== jobType)
    }else{
      selectedJobType = [...selectedJobType, jobType]
    }
  }