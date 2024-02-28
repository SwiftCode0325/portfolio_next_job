<script>

import { get } from 'svelte/store';
import { isAuthenticated, logOut, isLoggedIn, userIsLoggedIn } from "../../../util/auth.js"
import { goto } from '$app/navigation';
import { writable } from "svelte/store";
import { onMount } from 'svelte';

let profileDropDownMenu = writable(false);
let authData = '';
let background_image;

onMount( () => {
  background_image = "/background-img5.png"
})


onMount(async () => {
  authData = JSON.parse(await isLoggedIn());
  })

function loginStatus() {
    if(get(isAuthenticated) == false) {
      userIsLoggedIn.set(true);
      goto("/sign-up");
    }else{
      goto("/job/new")
    }
}

function signUp() {
  userIsLoggedIn.set(false);
  goto('/sign-up');
}

export function openProfileDropDownMenu () {
    profileDropDownMenu.update( value => !value );
}
</script>


<nav class="flex justify-between h-96 bg-cover bg-no-repeat bg-top" style="background-image: url({background_image});">
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
    <button on:click={signUp} class="mr-2 hidden md:block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Up</button>
    {/if}
    
    <button on:click={openProfileDropDownMenu} class=" border relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full m-2">
      {#if $isAuthenticated == false || authData.userProfilePicture == ''}
      <svg class="rounded-full cursor-pointer w-10 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
      {:else}
      <img class="w-10 h-10 p-1 rounded-full ring-1 ring-gray-300" src="{authData.userProfilePicture}" alt="Bordered avatar">
      {/if}
    </button>
  </div>

    <div class="absolute text-gray-200 m-2 top-40 left-30 md:left-32 md:text-2xl text-xl font-semibold w-48 md:w-auto">
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
        <button on:click={signUp} class="block md:hidden px-4 py-2">Sign Up</button>
      </li>
      {/if}
    </ul>
    {/if}
  </div>