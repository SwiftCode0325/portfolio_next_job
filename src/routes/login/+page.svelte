<svelte:head>
  <title>Login | Next Jobs</title>
</svelte:head>

<script>
  import { goto } from '$app/navigation';
  import { authenticateUser } from '../../util/auth.js';
  import { writable } from 'svelte/store';
  
  let isLoading = writable(false);
  let username = '';
  let password = '';
  let loginStatus = writable(false);
    

    async function signIn(evt) {
        //prevent page go to the top when the button is clicked//
        evt.preventDefault();

        isLoading.set(true);

        const login = await authenticateUser(username, password);
        if(login.success == true){
            goto('/Home');
            loginStatus.set(false);
        }else{
            loginStatus.set(true);
        }
        isLoading.set(false);
    }

    function slideUp() {
        loginStatus.set(false)
      }

</script>

<style>
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
  animation: slide-to-right 2s
}

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

  @keyframes slideUp {
    0% {
        opacity: 0;
        transform: translateY(100%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
  }

  .slide-up {
    animation: slideUp ease forwards;
  }

</style>

<div class="flex h-screen w-screen">
    <!-- Log In Section -->
    <div class="absolute text-gray-200 m-2 top-40 left-80 text-5xl font-bold slideRight">
        <h1>Log In</h1>
    </div>


    <!-- Image div -->
    <div class="w-6/12 h-full">
        <img src="background-img3.png" alt="" class="w-full h-full object-cover">
    </div>

    <!-- Form div -->
    <div class="flex items-center flex-col justify-center w-7/12">
            <!-- If loginStatus is true, show the warning message -->
            {#if $loginStatus}
            <div class="flex absolute top-2 ml-10 slide-down items-center p-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span class="sr-only">Info</span>
                <div class="ml-3 text-sm font-medium pr-2">
                    Warning: Invalid password/username!
                </div>
                <button on:click={slideUp} type="button" class="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close">
                    <span class="sr-only">Close</span>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
            {/if}

            <div class="flex justify-center w-9/12 ml-10 mb-5">
                  <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <form class="space-y-6" on:submit={signIn}>
                      <div class="flex">
                        <div class="tooltip tooltip-top pr-2" data-tip="Home">
                          <a href="/Home">
                          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	                        width="40px" height="40px" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;"
	                        xml:space="preserve" class="fill-gray-200 dark:text-white group-hover:fill-black">
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
                          <h5 class="text-xl font-medium text-gray-900 dark:text-white flex items-center">Sign in to our platform</h5>
                      </div>

                      <!-- username section -->
                        <div>
                            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                            <input type="text" 
                            name="username" 
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="John Doe" 
                            required
                            bind:value={username}>
                        </div>
                      
                      <!-- password section -->
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                            <input type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required
                            bind:value={password}>
                        </div>

        
                        <button type="submit" class="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          {#if $isLoading}
                                <span class="loading loading-dots loading-sm"></span>
                            {:else}
                                <span>Login</span>
                            {/if}
                        </button>
                        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Not registered? <a href="/sign-up" class="text-pink-600 hover:underline dark:text-blue-500">Create Account</a>
                        </div>
                    </form>
                  </div>
              </div>
      </div>
</div>