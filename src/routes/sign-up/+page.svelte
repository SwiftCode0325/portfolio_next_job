<script>

import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { authenticateUser } from '../../util/auth.js'
import { goto } from '$app/navigation';
import { writable } from 'svelte/store';

let showPassword = writable(true)
let showPasswordConfirmation = writable(true)
let isLoading = writable(false)
let formErrors = {};

  async function postSignUp() {
      goto('/post/new');
    }

  async function createUser(evt) {
    //prevent the page go to the top when button is clicked//
    evt.preventDefault();
    isLoading.set(true);
    const userData = {
      username: evt.target['username'].value,
      email: evt.target['email'].value,
      password: evt.target['password'].value,
      passwordConfirm: evt.target['password-confirmation'].value
    };
    //create and insert the new user data into database//
    const resp = await fetch(PUBLIC_BACKEND_BASE_URL + 'api/collections/users/records', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (resp.status == 200) {
      const res = await authenticateUser(userData.username, userData.password);
      if (res.success) {
        postSignUp();
      } else {
        throw 'Sign up succeeded but authentication failed';
      }
    } else {
      const res = await resp.json();
      formErrors = res.data
    }
      // Check for password confirmation error after API call is completed
    if (evt.target['password'].value != evt.target['password-confirmation'].value) {
        formErrors['password'] = { message: 'Password confirmation does not match' };
    }
    isLoading.set(false);
  }

  // function to toggle the state of the showPassword store //
  function togglePasswordVisibility() {
      showPassword = !showPassword;
  }
  function togglePasswordConfirmationVisibility(){
    showPasswordConfirmation = !showPasswordConfirmation;
  }
  function clearUsernameError(){
    if(formErrors.username){
      formErrors.username.message = '';
    }
  }

   function clearEmailError() {
    if(formErrors.email){
    formErrors.email.message = '';
    }
}
  function clearPasswordError() {
    if(formErrors.password){
    formErrors.password.message = '';
    }
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
</style>

<div class="flex h-screen w-screen">
        <!-- Sign Up Section -->
        <div class="absolute text-gray-200 m-2 top-52 left-14 text-5xl font-bold slideRight">
            <h1>Sign Up</h1>
        </div>

        <!-- Image div -->
        <div class="w-6/12 h-full">
            <img src="background-img4.png" alt="" class="w-full h-full object-cover">
        </div>

        <!-- Form div -->
        <!-- Outer div -->
        <div class="flex items-center justify-center w-7/12 ">
            <!-- Inner div -->
            <div class="flex w-9/12 h-full items-center justify-center ml-10 slide-down">
                  <!-- Form section -->
                  <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-5 dark:bg-gray-800 dark:border-gray-700">
                        <form class="space-y-3" on:submit={createUser}>
                            <div class="flex">
                                <div class="tooltip tooltip-top pr-2" data-tip="Home">
                                    <a href="/Home">
                                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	                                            width="40px" height="40px" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;"
	                                            xml:space="preserve" class="fill-gray-200 dark:text-white">
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
                                <h5 class="text-xl font-medium text-gray-900 dark:text-white flex items-center">Create Account</h5>
                            </div>
                            
                            <!-- username section -->
                            <div>
                                <label for="username" class="block pb-1 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                                <input type="text" name="username" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required
                                on:focus={clearUsernameError}>
                                {#if 'username' in formErrors}
                                <label class="label h-5" for="Username Error">
                                    <span class="label-text-alt text-red-500">{formErrors['username'].message}</span>
                                </label>
                                {/if}
                            </div>
                            
                            <!-- email section -->
                            <div>
                                <label for="email" class="block pb-1 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                                <input type="email" name="email" placeholder="johndoe@example.com" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                                on:focus={clearEmailError}>
                                {#if 'email' in formErrors}
                                <label class="label h-5" for="Email Error">
                                    <span class="label-text-alt text-red-500">{formErrors['email'].message}</span>
                                </label>
                                {/if}
                            </div>

                            <!-- password section -->
                            <div>
                                <label for="password" class="block pb-1 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                                    <div class="relative">
                                        <input type={showPassword ? "password" : "text"} 
                                        name="password" 
                                        placeholder="••••••••" 
                                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                                        on:focus={clearPasswordError}>
                                        <!-- svelte-ignore a11y-interactive-supports-focus -->
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <div class="absolute inset-y-0 top-1.5 right-2.5">
                                            <svg on:click={togglePasswordVisibility} role="button" class="cursor-pointer fill-gray-300" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M15.02 4.5H16.5C17.12 4.5 17.67 4.52 18.16 4.59C20.79 4.88 21.5 6.12 21.5 9.5V14.5C21.5 17.88 20.79 19.12 18.16 19.41C17.67 19.48 17.12 19.5 16.5 19.5H15.02" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M15 2V22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M11.0945 12H11.1035" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M7.09448 12H7.10346" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    {#if 'password' in formErrors}
                                    <label class="label h-5" for="password">
                                        <span class="label-text-alt text-red-500">{formErrors['password'].message}</span>
                                    </label>
                                    {/if}
                            </div>

                            <!-- password-confirmation section -->
                            <div>
                                <label for="password-confirmation" class="pb-1 block text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <div class="relative">
                                    <input type={showPasswordConfirmation ? "password" : "text"} 
                                    name="password-confirmation"
                                    placeholder="••••••••" 
                                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                                    on:focus={clearPasswordError}>
                                    <!-- svelte-ignore a11y-interactive-supports-focus -->
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div class="absolute inset-y-0 top-1.5 right-2.5">
                                        <svg on:click={togglePasswordConfirmationVisibility} role="button" class="cursor-pointer fill-gray-300" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15.02 4.5H16.5C17.12 4.5 17.67 4.52 18.16 4.59C20.79 4.88 21.5 6.12 21.5 9.5V14.5C21.5 17.88 20.79 19.12 18.16 19.41C17.67 19.48 17.12 19.5 16.5 19.5H15.02" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15 2V22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M11.0945 12H11.1035" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M7.09448 12H7.10346" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                {#if 'password' in formErrors}
                                <label class="label h-5" for="password">
                                    <span class="label-text-alt text-red-500">{formErrors['password'].message}</span>
                                </label>
                                {/if}
                            </div>

                            <button type="submit" class="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {#if $isLoading}
                                <span class="loading loading-dots loading-sm"></span>
                            {:else}
                                <span>Create New Account</span>
                            {/if}
                            </button>

                            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                                Registered? <a href="/log-in" class="text-pink-600 hover:underline dark:text-blue-500">Log in HERE</a>
                            </div>
                        </form>
                    </div>
              </div>
        </div>
</div>