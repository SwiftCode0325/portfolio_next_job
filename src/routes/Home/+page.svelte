<script>
  import { writable } from "svelte/store";
  import humanize from 'humanize-plus';
  import {isLoggedIn, logOut, isAuthenticated} from "../../util/auth.js"
  import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';

  export let data;
  let joblist = data.jobs.items;
  let filteredJobs = joblist;
  let filter = '';
  let search = '';
  let selectedJobType = [];
  let minSalary = 0;
  let maxSalary = 20000;
  let maxValue = 19000;
  let currentMin = minSalary;
  let currentMax = 1000;
  let jobTypeDropDownMenu = writable(false);
  let salaryDropDownMenu = writable(false);
  let profileDropDownMenu = writable(false);
  let authData = '';
  let userloggedIn = writable(false);
  let currentJobPage = 1;
  let nav;
  let totalPages;
  let sideBarOpen = writable(false)

   async function loadUserData(){
    const userIsLoggedIn = await isLoggedIn();
    if (userIsLoggedIn) {
       authData = JSON.parse(localStorage.getItem("auth"));
       userloggedIn.set(true)
    } else {
      authData = '';
      userloggedIn.set(false)
    }
    }

    loadUserData();

  onMount(() => {
  nav = document.getElementById("totalPage")
  totalPages = data.jobs.totalPages; // Set the total number of pages

  // Loop through the total number of pages
  for (let i = 1; i <= totalPages; i++) {
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

  function openDropDownMenu() {
    jobTypeDropDownMenu.update(value => !value);
  }
  function openSalaryDropDownMenu () {
    salaryDropDownMenu.update(value => !value);
  }
  
  function openProfileDropDownMenu () {
    profileDropDownMenu.update( value => !value );
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
      selectedJobType = selectedJobType.filter(item => item !== jobType)
    }else{
      selectedJobType = [...selectedJobType, jobType]
    }
  }

  function filterJobs() {
  
  if (selectedJobType === 0 && search === '' && currentMin === 0){
    filteredJobs = joblist;
  }else {
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

       const response = await fetch( PUBLIC_BACKEND_BASE_URL + `api/collections/jobs/records?page=${currentJobPage}&perPage=10`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type':'application/json'
        }
      });

      const res = await response.json()

      if(response.ok){

        filteredJobs = res.items

        // Add the following lines to remove the underline from the first page button
        let firstPageButton = document.querySelector("#currentPage[value='1']");
        firstPageButton.classList.remove("underline");
        
        // Add the following lines to focus the current page number
         let currentPageButton = document.querySelector(`#currentPage[value="${currentJobPage}"]`);
        currentPageButton.focus();
      }else{
        filteredJobs = joblist
      }
    }
    
    async function prevPage() {
      if(data.jobs.page < data.jobs.totalPages && data.jobs.page > 1){
       currentJobPage = data.jobs.page - 1
      }else {
        currentJobPage = data.jobs.page
      }

      const response = await fetch( PUBLIC_BACKEND_BASE_URL + `api/collections/jobs/records?page=${currentJobPage}&perPage=10`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type':'application/json'
        }
      });

      const res = await response.json()

      if(response.ok){
        filteredJobs = res.items

        // Add the following lines to remove the underline from the first page button
        let firstPageButton = document.querySelector("#currentPage[value='1']");
        firstPageButton.classList.remove("underline");

        // Add the following lines to focus the current page number
         let currentPageButton = document.querySelector(`#currentPage[value="${currentJobPage}"]`);
        currentPageButton.focus();
      }else{
        filteredJobs = joblist
      }
    }

    async function getCurrentPage(event) {

      // Get the clicked button element
      const element = event.target;

      const currentPageNo = element.textContent

      currentJobPage = currentPageNo
      
      const response = await fetch( PUBLIC_BACKEND_BASE_URL + `api/collections/jobs/records?page=${currentPageNo}&perPage=10`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type':'application/json'
        }
      });

      const res = await response.json()

      if(response.ok){
        filteredJobs = res.items
      }else{
        filteredJobs = joblist
      }
    }

 function loginStatus() {
  if($isAuthenticated == false){
    goto("/sign-up")
  }else{
    goto("/job/new")
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

<style>
	@keyframes slideDown1 {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.slide-down1 {
  animation: slideDown1 2s ease forwards;
}

@keyframes slideDown2 {
  0% {
    opacity: 0;
    transform: translateY(-10%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.slide-down2 {
  animation: slideDown2 1s ease forwards;
}

footer{
  background-color: #20333a;
}

.showRecord{
  color: #20333a;
}

input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: rgb(225 29 72);
      }

  /* slide to right */
@keyframes slide-to-right {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.slideRight {
  animation: slide-to-right 1s
}

@keyframes slide-to-left {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-100%);
  }
}

.hide {
  animation: slide-to-left 1s;
}
</style>

<div class="flex flex-col">
<nav class="flex justify-between h-96 bg-cover bg-no-repeat bg-top" style="background-image: url('background-img5.png');">
  <div class="flex items-center p-4 h-24">
    <!-- Left-hand side content -->
  <a href="/Home" class="flex items-center hover:bg-gray-300 rounded-full p-2 group">
      <span class="self-center text-lg md:text-3xl whitespace-nowrap text-gray-200 font-extrabold group-hover:text-black">NEXT JOB</span>

<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="40px" height="40px" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;"
	 xml:space="preserve" class="fill-gray-200 dark:text-white ml-1 group-hover:fill-black">
<g>
	<g>
		<path d="M319.77,338.039c0,4.949-1.811,9.236-5.424,12.847c-3.617,3.621-7.902,5.428-12.851,5.428h-91.361
			c-4.952,0-9.233-1.807-12.85-5.428c-3.616-3.61-5.424-7.897-5.424-12.847V292.36H0v137.044c0,12.56,4.471,23.312,13.418,32.257
			c8.945,8.946,19.701,13.419,32.264,13.419h420.266c12.56,0,23.315-4.473,32.261-13.419c8.949-8.945,13.418-19.697,13.418-32.257
			V292.36H319.77V338.039L319.77,338.039z"/>
		<rect x="219.266" y="292.36" width="73.096" height="36.545"/>
		<path d="M498.208,123.054c-8.945-8.947-19.701-13.418-32.261-13.418H365.446V63.953c0-7.614-2.663-14.084-7.994-19.414
			c-5.325-5.327-11.8-7.993-19.411-7.993H173.589c-7.612,0-14.083,2.666-19.414,7.993s-7.994,11.799-7.994,19.414v45.683H45.682
			c-12.562,0-23.318,4.471-32.264,13.418C4.471,132,0,142.75,0,155.313v109.636h511.626V155.313
			C511.626,142.75,507.158,132,498.208,123.054z M328.904,109.636H182.725V73.089h146.179V109.636z"/>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
  </a>
  </div>

  <!-- Right-hand side content -->
  <div class="p-4 flex items-center h-24">
    <button on:click={loginStatus} class="hidden md:block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Post Job</button>
    {#if $isAuthenticated}
    <button on:click={logOut} class="hidden md:block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white mr-1">Log Out</button>
    {:else}
    <button class="hidden md:block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"><a href="/login">Log In</a></button>
    <a href="/sign-up" class="mr-2 hidden md:block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Up</a>
    {/if}
    
    <button on:click={openProfileDropDownMenu} class=" border relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full m-2">
      {#if $userloggedIn == false || authData.userProfilePicture == ''}
      <svg class="rounded-full cursor-pointer w-10 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
      {:else}
      <img class="w-10 h-10 p-1 rounded-full ring-1 ring-gray-300" src="{authData.userProfilePicture}" alt="Bordered avatar">
      {/if}
    </button>
  </div>

    <div class="absolute text-gray-200 m-2 top-40 left-30 md:left-32 md:text-2xl text-xl font-semibold slide-down1 w-48 md:w-auto">
	      <h1>Find Your Dream Job Here</h1>
    </div>
</nav>

<div class="z-10 absolute right-6 top-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
    {#if $profileDropDownMenu}
    <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
      {#if $isAuthenticated}
      <div>{authData.userName}</div>
      <div class="font-medium truncate">{authData.userEmail}</div>
      {:else}
      <div>user name</div>
      <div class="font-medium truncate">user email</div>
      {/if}

      
    </div>
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
      <li>
        <a href="/profile" class="block px-4 py-2">Dashboard</a>
      </li>
      <li>
        <a href="/job-posted" class="block px-4 py-2">Job Posted</a>
      </li>
      <li>
      <button on:click={loginStatus} class="block md:hidden px-4 py-2">Post Job</button>
      </li>
      {#if $isAuthenticated}
      <li>
        <button on:click={logOut} class="block md:hidden px-4 py-2">Log Out</button>
      </li>
      {:else}
      <li>
        <button class="block md:hidden px-4 py-2"><a href="/login">Log In</a></button>
      </li>
      <li>
        <button class="block md:hidden px-4 py-2"><a href="/sign-up">Sign Up</a></button>
      </li>
      {/if}
    </ul>
    {/if}
  </div>

<div class="flex p-2 m-2 space-x-5 flex-row justify-between">
    <button class="items-center justify-center p-0.5 mb-2 h-10 mr-2 text-white text-sm font-medium rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl"
    on:click={clearFilter}>
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-transparent dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Clear Filter
        </span>
    </button>

    <p class="text-gray-400 items-center justify-center flex mb-1 showRecord">
      show record page {currentJobPage} of {totalPages}
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
  on:click={openDropDownMenu}
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
  on:click={openDropDownMenu}
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
  <li class="p-3 hover:bg-gray-100 flex justify-between flex-col md:flex-row border border-black m-2 rounded-xl md:border-none">
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

        <button on:click={prevPage} class="inline-flex items-center rounded-l-md px-2 pagination focus:z-20 focus:outline-offset-0">
          <svg class="md:mt-1 lg:mt-0 w-4 h-4 stroke-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
          </svg>
          <span class="mb-0.5 px-2 md:text-2xl lg:text-lg">Previous</span>
        </button>

      <nav class="inline-flex -space-x-px" aria-label="Pagination" id="totalPage">
        
      </nav>

      <button on:click={nextPage} class="relative inline-flex items-center rounded-r-md px-2 py-2 pagination focus:z-20 focus:outline-offset-0">
          <span class="mb-0.5 px-2 md:text-2xl lg:text-lg">Next</span>
          <svg class="md:mt-1 lg:mt-0 w-4 h-4 stroke-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
      </button>
    </div>
</div>
</div>


<footer class="w-full h-16 flex items-center text-gray-300 fill-gray-300">
  <svg xmlns="http://www.w3.org/2000/svg" class="p-2 w-12 h-12" stroke="current" viewBox="0 0 24 24" id="copyright"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M10.08 10.86c.05-.33.16-.62.3-.87s.34-.46.59-.62c.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29s-.4-.73-.7-1.01-.66-.5-1.08-.66-.88-.23-1.39-.23c-.65 0-1.22.11-1.7.34s-.88.53-1.2.92-.56.84-.71 1.36S8 11.29 8 11.87v.27c0 .58.08 1.12.23 1.64s.39.97.71 1.35.72.69 1.2.91c.48.22 1.05.34 1.7.34.47 0 .91-.08 1.32-.23s.77-.36 1.08-.63.56-.58.74-.94.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58s-.21.33-.36.46-.32.23-.52.3c-.19.07-.39.09-.6.1-.36-.01-.66-.08-.89-.23-.25-.16-.45-.37-.59-.62s-.25-.55-.3-.88-.08-.67-.08-1v-.27c0-.35.03-.68.08-1.01zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
  <span class="font-bold uppercase">next job</span>
</footer>
</div>
