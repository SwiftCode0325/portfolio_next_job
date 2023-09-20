<script>
	import { goto } from '$app/navigation';
	import { authenticateUser } from '../../util/auth.js';
	import { writable } from 'svelte/store';
  	import { showPassword, togglePasswordVisibility } from "../component/passwordVisibility/+page.js";

	let isLoading = writable(false);
	let username = '';
	let password = '';
	let getError = writable(false);
  	let flipCardInner;

	async function signIn(evt) {
		//prevent page go to the top when the button is clicked//
		evt.preventDefault();

		isLoading.set(true);

		const login = await authenticateUser(username, password);
		if (login.success == true) {
			goto('/Home');
			getError.set(false);
		} else {
			getError.set(true);
		}
		isLoading.set(false);
	}

	function closeWindow() {
		getError.set(false);
	}

	function flip() {
		flipCardInner = document.getElementById('flip-card-inner');

		flipCardInner.style.transform = 'rotateY(0deg)';
	}

	function flipBack() {
		flipCardInner = document.getElementById('flip-card-inner');

		flipCardInner.style.transform = 'rotateY(180deg)';
	}
</script>

<svelte:head>
	<title>Login | Next Jobs</title>
</svelte:head>

<div class="flex h-screen w-screen">
	<div id="flip-card" class="sm:w-6/12 w-full h-full">
		<div id="flip-card-inner" class="flip-card-inner">
			<div class="flip-card-front w-full h-full">
				<button
					on:click={flipBack}
					class="flex block sm:hidden absolute bottom-0 right-0 m-5 text-3xl font-bold text-gray-200"
				>
					Next
					<svg
						class="w-6 h-6 mt-2.5 ml-1"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 8 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
						/>
					</svg>
				</button>
				<!-- Log In Section -->
				<div
					class="absolute text-gray-200 m-2 top-72 sm:top-48 left-40 sm:left-80 text-5xl font-bold slideRight"
				>
					<div class="flex">
						<a href="/Home" class="text-3xl sm:text-xl mb-3 hover:underline">Home</a>
						<svg
							class="w-4 h-4 text-gray-200 ml-2 mt-3.5 sm:mt-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 8 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
							/>
						</svg>
					</div>
					<h1>Log In</h1>
				</div>
				<img src="background-img3.png" alt="" class="w-full h-full object-cover" />
			</div>

			<div class="flip-card-back flex justify-center bg-gradient-to-br from-pink-500 to-orange-400">
				<!-- If loginStatus is true, show the warning message -->
				{#if $getError}
					<div
						class="flex absolute z-10 top-2 left-1 warningMessageSlideRight items-center p-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-red-400"
						role="alert"
					>
						<svg
							class="flex-shrink-0 w-4 h-4"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
							/>
						</svg>
						<span class="sr-only">Info</span>
						<div class="ml-3 text-sm font-medium pr-2">Warning: Invalid password/username!</div>
						<button
							on:click={closeWindow}
							type="button"
							class="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
							data-dismiss-target="#alert-2"
							aria-label="Close"
						>
							<span class="sr-only">Close</span>
							<svg
								class="w-3 h-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
						</button>
					</div>
				{/if}

				<button
					on:click={flip}
					class="mr-2 text-2xl sm:text-lg sm:block md:hidden h-20 w-24 absolute left-3 justify-center items-center"
				>
					<div class="flex flex-row">
						<svg
							class="w-3 h-3 mt-3 mr-2 text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 8 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
							/>
						</svg>
						Back
					</div>
				</button>

				<div class="flex justify-center w-9/12 ml-2 sm:ml-10 mb-5">
					<div
						class="w-full h-fit max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow mt-32"
					>
						<form class="space-y-6" on:submit={signIn}>
							<div class="flex">
								<svg
									version="1.1"
									id="Capa_1"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									x="0px"
									y="0px"
									width="50px"
									height="50px"
									viewBox="0 0 511.626 511.627"
									style="enable-background:new 0 0 511.626 511.627;"
									xml:space="preserve"
									class="fill-gray-200 dark:text-white group-hover:fill-black p-2"
								>
									<g>
										<g>
											<path
												d="M319.77,338.039c0,4.949-1.811,9.236-5.424,12.847c-3.617,3.621-7.902,5.428-12.851,5.428h-91.361
			                    c-4.952,0-9.233-1.807-12.85-5.428c-3.616-3.61-5.424-7.897-5.424-12.847V292.36H0v137.044c0,12.56,4.471,23.312,13.418,32.257
			                    c8.945,8.946,19.701,13.419,32.264,13.419h420.266c12.56,0,23.315-4.473,32.261-13.419c8.949-8.945,13.418-19.697,13.418-32.257
			                    V292.36H319.77V338.039L319.77,338.039z"
											/>
											<rect x="219.266" y="292.36" width="73.096" height="36.545" />
											<path
												d="M498.208,123.054c-8.945-8.947-19.701-13.418-32.261-13.418H365.446V63.953c0-7.614-2.663-14.084-7.994-19.414
			                    c-5.325-5.327-11.8-7.993-19.411-7.993H173.589c-7.612,0-14.083,2.666-19.414,7.993s-7.994,11.799-7.994,19.414v45.683H45.682
			                    c-12.562,0-23.318,4.471-32.264,13.418C4.471,132,0,142.75,0,155.313v109.636h511.626V155.313
			                    C511.626,142.75,507.158,132,498.208,123.054z M328.904,109.636H182.725V73.089h146.179V109.636z"
											/>
										</g>
									</g>
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
									<g />
								</svg>
								<h5 class="text-xl font-medium text-gray-900 dark:text-white flex items-center">
									Sign in to our platform
								</h5>
							</div>

							<!-- username section -->
							<div>
								<label
									for="username"
									class="block mb-2 text-lg sm:text-base font-medium text-gray-900 text-left"
									>Your username</label
								>
								<input
									type="text"
									name="username"
									class="bg-white border border-gray-300 text-gray-900 text-base sm:text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
									placeholder="John Doe"
									required
									bind:value={username}
								/>
							</div>

							<!-- password section -->
							<div>
								<label
									for="password"
									class="block pb-1 text-lg sm:text-base font-medium text-gray-900 dark:text-white text-left"
									>Your password</label
								>
								<div class="relative">
									{#if $showPassword}
										<input
											type="password"
											name="password"
											placeholder="••••••••"
											class="bg-white border border-gray-300 text-gray-900 text-base sm:text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
											required
											bind:value={password}
										/>
									{:else}
										<input
											type="text"
											name="password"
											placeholder="••••••••"
											class="bg-white border border-gray-300 text-gray-900 text-base sm:text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
											required
											bind:value={password}
										/>
									{/if}
									<!-- svelte-ignore a11y-interactive-supports-focus -->
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div class="absolute inset-y-0 top-1.5 right-2.5">
										<svg
											on:click={togglePasswordVisibility}
											role="button"
											class="cursor-pointer fill-gray-300"
											width="30px"
											height="30px"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96"
												stroke="#292D32"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M15.02 4.5H16.5C17.12 4.5 17.67 4.52 18.16 4.59C20.79 4.88 21.5 6.12 21.5 9.5V14.5C21.5 17.88 20.79 19.12 18.16 19.41C17.67 19.48 17.12 19.5 16.5 19.5H15.02"
												stroke="#292D32"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M15 2V22"
												stroke="#292D32"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M11.0945 12H11.1035"
												stroke="#292D32"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M7.09448 12H7.10346"
												stroke="#292D32"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
								</div>
							</div>

							<button
								type="submit"
								class="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center"
							>
								{#if $isLoading}
									<span class="loading loading-dots loading-sm" />
								{:else}
									<span class="text-lg sm:text-base">Login</span>
								{/if}
							</button>

							<div class="font-medium text-gray-500 text-base sm:text-sm">
								Not registered? <a href="/sign-up" class="text-pink-600 hover:underline"
									>Create Account</a
								>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Form div -->
	<div
		class="flex items-center flex-col justify-center w-7/12 bg-gradient-to-br from-pink-500 to-orange-400 formDivision"
	>
		<!-- If loginStatus is true, show the warning message -->
		{#if $getError}
			<div
				class="flex absolute z-10 top-2 left-1 warningMessageSlideRight items-center p-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-red-400"
				role="alert"
			>
				<svg
					class="flex-shrink-0 w-4 h-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
					/>
				</svg>
				<span class="sr-only">Info</span>
				<div class="ml-3 text-sm font-medium pr-2">Warning: Invalid password/username!</div>
				<button
					on:click={closeWindow}
					type="button"
					class="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
					data-dismiss-target="#alert-2"
					aria-label="Close"
				>
					<span class="sr-only">Close</span>
					<svg
						class="w-3 h-3"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
						/>
					</svg>
				</button>
			</div>
		{/if}

		<div class="flex justify-center w-9/12 ml-10 mb-5 slide-down">
			<div
				class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
			>
				<form class="space-y-6" on:submit={signIn}>
					<div class="flex">
						<svg
							version="1.1"
							id="Capa_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							x="0px"
							y="0px"
							width="50px"
							height="50px"
							viewBox="0 0 511.626 511.627"
							style="enable-background:new 0 0 511.626 511.627;"
							xml:space="preserve"
							class="fill-gray-200 dark:text-white group-hover:fill-black p-2"
						>
							<g>
								<g>
									<path
										d="M319.77,338.039c0,4.949-1.811,9.236-5.424,12.847c-3.617,3.621-7.902,5.428-12.851,5.428h-91.361
			                    c-4.952,0-9.233-1.807-12.85-5.428c-3.616-3.61-5.424-7.897-5.424-12.847V292.36H0v137.044c0,12.56,4.471,23.312,13.418,32.257
			                    c8.945,8.946,19.701,13.419,32.264,13.419h420.266c12.56,0,23.315-4.473,32.261-13.419c8.949-8.945,13.418-19.697,13.418-32.257
			                    V292.36H319.77V338.039L319.77,338.039z"
									/>
									<rect x="219.266" y="292.36" width="73.096" height="36.545" />
									<path
										d="M498.208,123.054c-8.945-8.947-19.701-13.418-32.261-13.418H365.446V63.953c0-7.614-2.663-14.084-7.994-19.414
			                    c-5.325-5.327-11.8-7.993-19.411-7.993H173.589c-7.612,0-14.083,2.666-19.414,7.993s-7.994,11.799-7.994,19.414v45.683H45.682
			                    c-12.562,0-23.318,4.471-32.264,13.418C4.471,132,0,142.75,0,155.313v109.636h511.626V155.313
			                    C511.626,142.75,507.158,132,498.208,123.054z M328.904,109.636H182.725V73.089h146.179V109.636z"
									/>
								</g>
							</g>
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
							<g />
						</svg>
						<h5 class="text-xl font-medium text-gray-900 dark:text-white flex items-center">
							Sign in to our platform
						</h5>
					</div>

					<!-- username section -->
					<div>
						<label
							for="username"
							class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>Your username</label
						>
						<input
							type="text"
							name="username"
							class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="John Doe"
							required
							bind:value={username}
						/>
					</div>

					<!-- password section -->
					<div>
						<label
							for="password"
							class="block pb-1 text-lg sm:text-base font-medium text-gray-900 dark:text-white text-left"
							>Your password</label
						>
						<div class="relative">
							{#if $showPassword}
								<input
									type="password"
									name="password"
									placeholder="••••••••"
									class="bg-white border border-gray-300 text-gray-900 text-base sm:text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
									required
									bind:value={password}
								/>
							{:else}
								<input
									type="text"
									name="password"
									placeholder="••••••••"
									class="bg-white border border-gray-300 text-gray-900 text-base sm:text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
									required
									bind:value={password}
								/>
							{/if}
							<!-- svelte-ignore a11y-interactive-supports-focus -->
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class="absolute inset-y-0 top-1.5 right-2.5">
								<svg
									on:click={togglePasswordVisibility}
									role="button"
									class="cursor-pointer fill-gray-300"
									width="30px"
									height="30px"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M11.02 19.5H7.5C6.88 19.5 6.33 19.48 5.84 19.41C3.21 19.12 2.5 17.88 2.5 14.5V9.5C2.5 6.12 3.21 4.88 5.84 4.59C6.33 4.52 6.88 4.5 7.5 4.5H10.96"
										stroke="#292D32"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M15.02 4.5H16.5C17.12 4.5 17.67 4.52 18.16 4.59C20.79 4.88 21.5 6.12 21.5 9.5V14.5C21.5 17.88 20.79 19.12 18.16 19.41C17.67 19.48 17.12 19.5 16.5 19.5H15.02"
										stroke="#292D32"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M15 2V22"
										stroke="#292D32"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M11.0945 12H11.1035"
										stroke="#292D32"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M7.09448 12H7.10346"
										stroke="#292D32"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						</div>
					</div>

					<button
						type="submit"
						class="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						{#if $isLoading}
							<span class="loading loading-dots loading-sm" />
						{:else}
							<span>Login</span>
						{/if}
					</button>
					<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
						Not registered? <a
							href="/sign-up"
							class="text-pink-600 hover:underline dark:text-blue-500">Create Account</a
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	@import '../login/+page.css';
</style>
