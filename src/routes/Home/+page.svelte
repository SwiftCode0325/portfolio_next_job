<script>
  import { writable } from "svelte/store";
  import humanize from 'humanize-plus';
  import {isLoggedIn} from "../../util/auth.js"
  import { onMount } from "svelte";
  import { fetchJobs } from "../component/pagination/pagination.js"
  import NavBar from "../component/navBar/NavBar.svelte";
  import Footer from "../component/Footer/Footer.svelte";

  export let data;
  export let joblist = data.jobs.items;
  let currentMin = 0
  let authData = '';
  let filter = '';
  let filteredJobs = joblist;
  let search;
  let currentJobPage = 1;
  let nav;
  let sideBarOpen = writable(false)
  let minSalary = 0;
  let maxSalary = 20000;
  let maxValue = 19000;
  let currentMax = 1000;
  let salaryDropDownMenu = writable(false);
  let jobTypeDropDownMenu = writable(false);
  let checkboxRemoteChecked = writable(false);
  let checkboxFullTimeChecked = writable(false);
  let checkboxPartTimeChecked = writable(false);
  let selectedJobType = [];
  let numberOfPages = writable(data.jobs.totalPages);
  
  onMount(async () => {
  authData = JSON.parse(await isLoggedIn());
  })

  onMount(() => {
    nav = document.getElementById("totalPage");

    numberOfPages.subscribe( value => {

  // Remove all existing pagination buttons
    while (nav && nav.firstChild) {
      nav.removeChild(nav.firstChild);
    }
  
  // Loop through the total number of pages
  for (let i = 1; i <= value; i++) {
  // Create a new button element
  let button = document.createElement("button");
  
  // Set the attributes and text content of the button
  button.setAttribute("id", "currentPage");
  button.setAttribute("value", i); // Set the value attribute to the page number
  button.textContent = i;
  
  if (i === 1) {
  // If this is the first page button, add the underline class
  button.setAttribute(
    "class",
    "md:text-xl lg:text-base relative items-center pagination px-5 py-4 text-sm font-semibold focus:underline underline"
  );
} else {
  // Otherwise, set the class without the underline class
  button.setAttribute(
    "class",
    "md:text-xl lg:text-base relative items-center pagination px-5 py-4 text-sm font-semibold focus:underline"
  );
}

  // Attach a click event listener to the button
  button.addEventListener("click", getCurrentPage);

  // Append the button to the nav element
  nav.appendChild(button);
}
  })
  })

function openJobTypeDropDownMenu() {
    jobTypeDropDownMenu.update(value => !value);
}
 
  function openSalaryDropDownMenu () {
    salaryDropDownMenu.update(value => !value);
  }

  function handleRangeChange(event) {
    currentMin = parseInt(event.target.value);
    currentMax = currentMin + 1000;
  // If currentMin exceeds maxSalary, set both currentMin and currentMax to their maximum values
    if (currentMin >= maxValue) {
      currentMin = maxValue;
      currentMax = maxSalary;
    }
  }

  //this function is used to get the desired job type and set into selectedJobType array//
  function updateSelectedJobTypes (jobType) {
    if(selectedJobType.includes(jobType)) {
      selectedJobType = selectedJobType.filter(item => item !== jobType);
    }else{
      selectedJobType = [...selectedJobType, jobType]
    }

    if(selectedJobType.includes('Full Time')){
      checkboxFullTimeChecked.set(true);
    }else if(selectedJobType.includes('Part Time')){
      checkboxPartTimeChecked.set(true);
    }else if(selectedJobType.includes('Remote')){
      checkboxRemoteChecked.set(true);
    }else{
      checkboxFullTimeChecked.set(false);
      checkboxPartTimeChecked.set(false);
      checkboxRemoteChecked.set(false);
    }
  }

  function filterJobs() {

  // Convert selectedJobType to lowercase
  const lowercaseSelectedJobTypes = selectedJobType.map(type => type.toLowerCase());

  // Filter based on selectedJobType and search filter
  filteredJobs = joblist.filter(job => {
  const jobTypeLowerCase = job.job_type.map(type => type.toLowerCase());
  const lowercaseFilterSearches = filter.toLowerCase();
  const minJobSalary = currentMin;

  // Check if job type or other properties match the search filter
  return (
    // Check if job type matches any selected job type
    (lowercaseSelectedJobTypes.length === 0 || jobTypeLowerCase.some(type => lowercaseSelectedJobTypes.includes(type))) &&
    // Check if employer, location, or title matches search filter
    (
      job.employer.toLowerCase().includes(lowercaseFilterSearches) ||
      job.location.toLowerCase().includes(lowercaseFilterSearches) ||
      job.title.toLowerCase().includes(lowercaseFilterSearches)
    ) && 
    // Check if minimum annual compensation is within the specified salary range
    (minJobSalary === 0 || job.minAnnualCompensation == minJobSalary)
  );
});

   if (filteredJobs.length < 10){
     numberOfPages.set(1);
   }else {
     numberOfPages.set(data.jobs.totalPages);
   }
}

  function clearFilter() {
    filter = '';
    search = '';
    selectedJobType = [];
    currentMin = 0;
    //Get all checkbox element and uncheck them//
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(box => {box.checked = false});

    // Reset the slider to its minimum value
    minSalary = 0;
    filterJobs()
  }

    async function nextPage() {
      if(data.jobs.page < data.jobs.totalPages){
       currentJobPage = data.jobs.page + 1
      }else {
        currentJobPage = data.jobs.page
      }

       const res = await fetchJobs(currentJobPage);

    if (res) {
        filteredJobs = res.items;

        // Remove the underline from the first page button
        let firstPageButton = document.querySelector("#currentPage[value='1']");
        firstPageButton.classList.remove("underline");
        
        // Focus the current page number
        let currentPageButton = document.querySelector(`#currentPage[value="${currentJobPage}"]`);
        currentPageButton.focus();
    } else {
        console.log('Error fetching jobs');
        filteredJobs = joblist;
    }
    }
    
    async function prevPage() {
      if(data.jobs.page < data.jobs.totalPages && data.jobs.page > 1){
       currentJobPage = data.jobs.page - 1
      }else {
        currentJobPage = data.jobs.page
      }

      const res = await fetchJobs(currentJobPage);

    if (res) {
        filteredJobs = res.items;

        // Remove the underline from the first page button
        let firstPageButton = document.querySelector("#currentPage[value='1']");
        firstPageButton.classList.remove("underline");
        
        // Focus the current page number
        let currentPageButton = document.querySelector(`#currentPage[value="${currentJobPage}"]`);
        currentPageButton.focus();
    } else {
        console.log('Error fetching jobs');
        filteredJobs = joblist;
    }
    }

    async function getCurrentPage(event) {

      // Get the clicked button element
      const element = event.target;

      const currentPageNo = element.textContent

      currentJobPage = currentPageNo
      
      const res = await fetchJobs(currentJobPage);

      if(res){
        filteredJobs = res.items
      }else{
        filteredJobs = joblist
      }
    }

 function openSideBar() {
    sideBarOpen.set(true)
  }

  function closeSideBar() {

    var sideBar = document.getElementById('sideBar');
    sideBar.classList.add('hide');

    setTimeout ( function() {
    sideBarOpen.set(false);
    }, 1000)
}
</script>

<div class="flex flex-col">

<NavBar /> 

<div class="flex p-2 m-2 space-x-5 flex-row justify-between">
    <button class="items-center justify-center p-0.5 mb-2 h-10 mr-2 text-white text-sm font-medium rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl"
    on:click={clearFilter}>
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-transparent dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Clear Filter
        </span>
    </button>

    <p class="text-gray-400 items-center justify-center flex mb-1 showRecord">
      show record page {currentJobPage} of {$numberOfPages}
    </p>
</div>

<div class="flex">
<!-- Filter search -->
<div class="flex flex-col">

  <button on:click={openSideBar} type="button" class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   <span class="sr-only">Open sidebar</span>
   <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
   </svg>
  </button>

  <div class="sidebar-container hide">
  {#if $sideBarOpen == true}
    <aside id="sideBar" class="slideRight absolute z-40 top-96 w-fit h-screen mt-14" aria-label="Sidebar">
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50">
        <ul class="space-y-2 font-medium">
          <li class="flex flex-row justify-between">
            <span class="ml-4">Filter</span>
            <button on:click={closeSideBar} type="button" class="ml-auto -mx-1.5 -my-1.5 bg-pink-100 text-pink-600 rounded-lg focus:ring-2 focus:ring-pink-400 p-1.5 hover:bg-pink-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800" data-dismiss-target="#alert-2" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
          </li>
          <li>
            <form class="w-64 m-4" on:submit|preventDefault={ () => { filter = search; filterJobs(); }} >   
    <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="text" id="search" name="search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-pink-600 focus:border-pink-600" placeholder="Company, job role..."
        bind:value={search}/>
        <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-4 py-2">Search</button>
    </div>
</form>
          </li>
          <li>
            <!-- Job Type Selection -->
<button
  class="text-black bg-transparent focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
  type="button"
  on:click={openJobTypeDropDownMenu}
>
Employment

  {#if $jobTypeDropDownMenu == true}
  <svg
    class="w-2.5 h-2.5 ml-2.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 10 6"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m1 1 4 4 4-4"
    />
  </svg>
  {:else}
  <svg class="w-2.5 h-2.5 ml-2.5 mt-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
  </svg>
  {/if}
</button>

<!-- Dropdown menu -->
{#if $jobTypeDropDownMenu == true}
  <div
    class="slide-down2 mt-2 ml-2 w-48 bg-transparent divide-y divide-gray-100 rounded-lg dark:bg-gray-700 dark:divide-gray-600"
>
    <ul
      class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
    >
      <li>
        <div class="flex items-center ">
          <input
            id="checkbox-item-1"
            type="checkbox"
            bind:checked={$checkboxFullTimeChecked}
            value=""
            class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-600 focus:ring-2"
            on:change={() => { updateSelectedJobTypes('Full Time'), filterJobs()} }/>
          <label
            for="checkbox-item-1"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Full Time
          </label>
        </div>
      </li>
  
      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-2"
            type="checkbox"
            bind:checked={$checkboxPartTimeChecked}
            value=""
            class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-600 focus:ring-2"
            on:change={() => { updateSelectedJobTypes('Part Time'), filterJobs()}}/>
          <label
            for="checkbox-item-2"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Part Time
          </label>
        </div>
      </li>

      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-3"
            type="checkbox"
            bind:checked={$checkboxRemoteChecked}
            value=""
            class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-600 focus:ring-2"
            on:change={() => {updateSelectedJobTypes('Remote'), filterJobs()}} />
          <label
            for="checkbox-item-3"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remote
          </label>
        </div>
      </li>
    </ul>
  </div> 
{/if}
          </li>
          <li>
            <!-- Salary indicator -->
<button
  class="text-black bg-transparent focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
  type="button"
  on:click={openSalaryDropDownMenu}
>
  Salary Range

  {#if $salaryDropDownMenu == true}
  <svg
    class="w-2.5 h-2.5 ml-2.5 mt-1"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 10 6"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m1 1 4 4 4-4"
    />
  </svg>

  {:else}
  <svg class="w-2.5 h-2.5 ml-2.5 mt-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
  </svg>
  {/if}

</button>

{#if $salaryDropDownMenu == true}
    <div
    class="slide-down2 mt-2 ml-5 w-48 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 dark:divide-gray-600"
>

<label for="minmax-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Min Job Salary : {currentMin}</label>
<input id="minmax-range" 
type="range"
min={minSalary}
max={maxSalary}
bind:value={currentMin}
on:change={(event) => {handleRangeChange(event); filterJobs(); }}
step="1000"
class="w-full h-2 bg-gray-200 rounded-lg appearance-none 
cursor-pointer dark:bg-gray-700"/>
</div>
{/if}
          </li>
        </ul>
      </div>
    </aside>
  {/if}
  </div>
  

<form class="hidden md:block w-64 m-4" on:submit|preventDefault={ () => { filter = search; filterJobs(); }} >   
    <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="text" id="search" name="search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-pink-600 focus:border-pink-600" placeholder="Company, job role..."
        bind:value={search}/>
        <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-4 py-2">Search</button>
    </div>
</form>

<!-- Job Type Selection -->
<button
  class="hidden md:block text-black bg-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
  type="button"
  on:click={openJobTypeDropDownMenu}
>

<div class="flex flex-row">
<span>Employment</span>

  {#if $jobTypeDropDownMenu == true}
  <svg
    class="w-2.5 h-2.5 ml-2.5 mt-1.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 10 6"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m1 1 4 4 4-4"
    />
  </svg>
  {:else}
  <svg class="w-2.5 h-2.5 ml-2.5 mt-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
  </svg>
  {/if}
</div>
</button>

<!-- Dropdown menu -->
{#if $jobTypeDropDownMenu == true}
  <div
    class="hidden md:block slide-down2 mt-2 ml-2 w-48 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 dark:divide-gray-600"
>
    <ul
      class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
    >
      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-1"
            type="checkbox"
            value=""
            class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-600 focus:ring-2"
            on:change={() => { updateSelectedJobTypes('Full Time'), filterJobs()} }/>
          <label
            for="checkbox-item-1"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Full Time
          </label>
        </div>
      </li>
  
      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-2"
            type="checkbox"
            value=""
            class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-600 focus:ring-2"
            on:change={() => { updateSelectedJobTypes('Part Time'), filterJobs()}}/>
          <label
            for="checkbox-item-2"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Part Time
          </label>
        </div>
      </li>

      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-3"
            type="checkbox"
            value=""
            class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-600 focus:ring-2"
            on:change={() => {updateSelectedJobTypes('Remote'), filterJobs()}} />
          <label
            for="checkbox-item-3"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remote
          </label>
        </div>
      </li>
    </ul>
  </div> 
{/if}

<!-- Salary indicator -->
<button
  class="hidden md:block text-black bg-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
  type="button"
  on:click={openSalaryDropDownMenu}
>

<div class="flex flex-row">
  <span>Salary Range</span>

  {#if $salaryDropDownMenu == true}
  <svg
    class="w-2.5 h-2.5 ml-2.5 mt-1.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 10 6"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m1 1 4 4 4-4"
    />
  </svg>

  {:else}
  <svg class="w-2.5 h-2.5 ml-2.5 mt-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
  </svg>
  {/if}
  </div>
</button>

{#if $salaryDropDownMenu == true}
    <div
    class="hidden md:block slide-down2 mt-2 ml-5 w-48 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 dark:divide-gray-600"
>

<label for="minmax-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Min Job Salary : {currentMin}</label>
<input id="minmax-range" 
type="range"
min={minSalary}
max={maxSalary}
bind:value={currentMin}
on:change={(event) => {handleRangeChange(event); filterJobs(); }}
step="1000"
class="w-full h-2 bg-gray-200 rounded-lg appearance-none 
cursor-pointer dark:bg-gray-700"/>
</div>
{/if}

</div>

<!-- Job Listing -->
<ul class="shrink w-full divide-y divide-gray-200 dark:divide-gray-700 ml-10">
  {#each filteredJobs as job (job.id)}
  <a href="/job/{job.id}">
  <li id="job-listing" class="p-3 hover:bg-gray-100 flex justify-between flex-col md:flex-row border border-black m-2 rounded-xl md:border-none">
    <div class="flex gap-x-4 flex-col md:flex-row">
      {#if job.image_url}
      <img class="h-12 w-12 flex-none rounded-full" src={job.image_url} alt="">
      {:else}
      <img class="h-12 w-12 flex-none rounded-full" src="question-mark.png" alt="question-mark logo">
      {/if}
      <div class="w-42 flex-auto">
        <p class="md:text-sm text-lg font-semibold leading-6 text-gray-900 sm:w-36 w-full capitalize">{job.title}</p>
        <p class="mt-1 truncate md:text-xs text-sm leading-5 text-gray-500 capitalize">{job.employer}</p>
        <p class="mt-1 truncate md:text-xs text-sm leading-5 text-gray-500">USD {humanize.formatNumber(job.minAnnualCompensation)} - USD {humanize.formatNumber(job.maxAnnualCompensation)}</p>
      </div>

    <div class="flex items-center ml-0 md:ml-16 p-0 md:p-2 grid grid-cols-2 md:grid-cols-3 gap-x-1">
        {#if job.job_type.includes('Full Time')}
        <div class="border bg-gradient-to-br from-pink-500 to-orange-400 text-white round rounded-xl p-4 h-10 flex items-center justify-center mt-1.5">
          Full Time
        </div>
        {/if}

        {#if job.job_type.includes('Part Time')}
        <div class="border bg-gradient-to-br from-pink-500 to-orange-400 text-white round rounded-xl p-4 h-10 flex items-center justify-center mt-1.5">
          Part Time
        </div>
        {/if}

        {#if job.job_type.includes('Remote')}
        <div class="border bg-gradient-to-br from-pink-500 to-orange-400 text-white round rounded-xl p-4 h-10 flex items-center justify-center mt-1.5">
          Remote
        </div>
        {/if}
    </div>
    </div>
    <div class="sm:items-end flex flex-col justify-center">
      <p class="text-sm leading-6 text-gray-900 capitalize">{job.location}</p>
      <p class="mt-1 text-sm md:text-xs leading-5 text-gray-500">Created At {new Date(job.created).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
    </div>
  </li>
  </a>
  {/each}
</ul>

</div>

<div class="flex items-center justify-center">
<div class="flex justify-center bg-transparent px-4 py-3 sm:px-2 mt-5 w-60">
  <div class="sm:flex sm:items-center sm:justify-between w-fit flex justify-between">

        <button on:click={$numberOfPages > 1 ? prevPage : undefined} class="inline-flex items-center rounded-l-md px-2 pagination focus:z-20 focus:outline-offset-0">
          <svg class="md:mt-1 lg:mt-0 w-4 h-4 stroke-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
          </svg>
          <span class="mb-0.5 px-2 md:text-2xl lg:text-lg">Previous</span>
        </button>

      <nav class="inline-flex -space-x-px" aria-label="Pagination" id="totalPage">
        
      </nav>

      <button on:click={$numberOfPages > 1 ? nextPage : undefined} class="relative inline-flex items-center rounded-r-md px-2 py-2 pagination focus:z-20 focus:outline-offset-0">
          <span class="mb-0.5 px-2 md:text-2xl lg:text-lg">Next</span>
          <svg class="md:mt-1 lg:mt-0 w-4 h-4 stroke-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
      </button>
    </div>
</div>
</div>

<Footer />
</div>

<style>
  @import '../Home/+page.css';
</style>