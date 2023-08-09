<script>
  import { writable } from "svelte/store";
  const show_menu = writable(false);
  const show_menu1 = writable(false);
  function openDropDownMenu() {
    show_menu.update(value => !value);
  }
  function openSalaryDropDownMenu () {
    show_menu1.update(value => !value);
  }
  show_menu.set(false);
  show_menu1.set(false);
  
  let minSalary = 0;
  let maxSalary = 20000;
  let maxValue = 19000;
  let currentMin = minSalary;
  let currentMax = 1000;
  function handleRangeChange(event) {
    currentMin = parseInt(event.target.value);
    currentMax = currentMin + 1000;
  // If currentMin exceeds maxSalary, set both currentMin and currentMax to their maximum values
    if (currentMin >= maxValue) {
      currentMin = maxValue;
      currentMax = maxSalary;
    }
    
  }
</script>

<nav class="bg-amber-500 border-gray-200 dark:bg-gray-900 flex justify-between h-96 bg-no-repeat bg-cover content-center" style="background-image: url('background-img5.png');">
  <div class="flex items-center p-4 h-24">
    <!-- Left-hand side content -->
  <a href="/Home" class="flex items-center hover:bg-gray-300 rounded-full p-2 group">
      <span class="self-center text-3xl whitespace-nowrap text-gray-200 dark:text-white font-extrabold group-hover:text-black">NEXT JOB</span>
<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
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
    <a href="/post/new" class="block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Post Job</a>
    <a href="/log-in" class="block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Log In</a>
    <a href="/sign-up" class="block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Up</a>
  </div>

  <style>
	@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.slide-down {
  animation: slideDown 2s ease forwards;
}
  </style>


  <div class="absolute text-gray-200 m-2 top-40 left-44 text-2xl font-semibold slide-down">
	<h1>Find Your Dream Job Here</h1>
  </div>


<form class="absolute inset-y-0 left-1/2 transform -translate-x-1/2 top-72 w-3/5">   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Jobs..." required>
        <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
</form>

</nav>

<div class="flex p-2 m-2 space-x-5">
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Full-Time
        </span>
    </button>
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Part-Time
        </span>
    </button>
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Remote
        </span>
    </button>
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Junior Level
        </span>
    </button>
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Senior Level
        </span>
    </button>
</div>

<div class="flex flex-row">
<!-- Filter search -->
<div>
  <span class="ml-4">Filter</span>

<form class="w-64 m-4">   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Company, skill, tag..." required>
        <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
</form>

<div class="flex flex-col">
<!-- Job Type Selection -->
<button
  id="dropdownCheckboxButton"
  data-dropdown-toggle="dropdownDefaultCheckbox"
  class="text-black bg-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
  type="button"
  on:click={openDropDownMenu}
>
  Employment
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
</button>

<style>
@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-10%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.slide-down {
  animation: slideDown 1s ease forwards;
}
</style>

  <!-- Dropdown menu -->
{#if $show_menu == true}
  <div
    id="dropdownDefaultCheckbox"
    class="slide-down mt-2 ml-2 w-48 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 dark:divide-gray-600"
>
    <ul
      class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
      aria-labelledby="dropdownCheckboxButton"
    >
      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-1"
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="checkbox-item-1"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Fulltime
          </label>
        </div>
      </li>
      <li>
        <div class="flex items-center">
          <input
            checked
            id="checkbox-item-2"
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="checkbox-item-2"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Junior Level
          </label>
        </div>
      </li>
      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-3"
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="checkbox-item-3"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Senior Level
          </label>
        </div>
      </li>
      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-3"
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="checkbox-item-3"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remote
          </label>
        </div>
      </li>
      <li>
        <div class="flex items-center">
          <input
            id="checkbox-item-3"
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            for="checkbox-item-3"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Contract
          </label>
        </div>
      </li>
    </ul>
  </div>
{/if}

<!-- Salary indicator -->
<button
  id="dropdownCheckboxButton"
  data-dropdown-toggle="dropdownDefaultCheckbox"
  class="text-black bg-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
  type="button"
  on:click={openSalaryDropDownMenu}
>
  Salary Range
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
</button>

{#if $show_menu1 == true}
    <div
    id="dropdownDefaultCheckbox"
    class="slide-down mt-2 ml-5 w-48 bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 dark:divide-gray-600"
>

<label for="minmax-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{currentMin} - {currentMax}</label>
<input id="minmax-range" 
type="range"
min={minSalary}
max={maxSalary}
on:change={handleRangeChange}
step="1000"
class="w-full h-2 bg-gray-200 rounded-lg appearance-none 
cursor-pointer dark:bg-gray-700">
</div>
{/if}

</div>
</div>

<!-- Job Listing -->
<ul role="list" class="divide-y divide-gray-100 ml-28 w-full pr-20">
  <li class="flex justify-between gap-x-6 py-5 ">
    <div class="flex gap-x-4">
      <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="netflix-logo.jpg" alt="netflix-logo">
      <div class="min-w-0 flex-auto">
        <p class="text-sm font-semibold leading-6 text-gray-900">UX Researcher</p>
        <p class="mt-1 truncate text-xs leading-5 text-gray-500">Netflix</p>
      </div>

    <div class="flex justify-center ml-20">
        <div class="border bg-gradient-to-br from-pink-500 to-orange-400 text-gray-200 round rounded-xl p-4 h-10 flex items-center justify-center mt-1.5 ml-2">
          full time
        </div>

        <div class="border bg-gradient-to-br from-pink-500 to-orange-400 text-gray-200 round rounded-xl p-4 h-10 flex items-center justify-center mt-1.5 ml-2">
          Senior Level
        </div>

        <div class="border bg-gradient-to-br from-pink-500 to-orange-400 text-gray-200 round rounded-xl p-4 h-10 flex items-center justify-center mt-1.5 ml-2">
          Remote
        </div>
    </div>
    </div>
    <div class="hidden sm:flex sm:flex-col sm:items-end">
      <p class="text-sm leading-6 text-gray-900">California, CA</p>
      <p class="mt-1 text-xs leading-5 text-gray-500">Created At 24/07/2023</p>
    </div>
  </li>
</ul>

</div>