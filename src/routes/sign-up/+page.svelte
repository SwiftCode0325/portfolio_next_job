<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { authenticateUser, userIsLoggedIn } from '../../util/auth.js';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { uploadMedia } from '../../util/s3-uploader.js';
	import PasswordVisibility from "../component/passwordVisibility/PasswordVisibity.svelte"
	import PasswordConfirmationVisibility from '../component/passwordVisibility/PasswordConfirmationVisibility.svelte';
	import PasswordVisibity from '../component/passwordVisibility/PasswordVisibity.svelte';
	import { selectedFile, handleFileInputChangeOnCarousel, isUpload, handleFileInputChangeOnFlipCard, isUploadFlipCardFile} from "../component/Carousel/Carousel.js"

	let isLoading = writable(false);
	let formErrors = {};
	let getError = writable(false);
	let getSuccess = writable(false);
	let fileName = '';
	let fileUrl = '';
  	let flipCardInner;

	async function postSignUp() {
		goto('/job/new');
	}

	async function createUser(evt) {
		//prevent the page go to the top when button is clicked//
		evt.preventDefault();
		isLoading.set(true);

		//Target id = fileInput, catch the first file//
		if ($isUpload == true) {
			[fileName, fileUrl] = await uploadMedia(evt.target['file-upload'].files[0]);
		} else if($isUploadFlipCardFile == true){
			[fileName, fileUrl] = await uploadMedia(evt.target['flipCard-file-upload'].files[0])
		} else {
			[fileName, fileUrl] = [];
		}

		const userData = {
			username: evt.target['username'].value,
			profile_picture: fileUrl,
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
				getError.set(false);
				getSuccess.set(true);
			} else {
				throw 'Sign up succeeded but authentication failed';
			}
		} else {
			const res = await resp.json();
			formErrors = res.data;
			getError.set(true);
		}
		// Check for password confirmation error after API call is completed
		if (evt.target['password'].value != evt.target['password-confirmation'].value) {
			formErrors['password'] = { message: 'Password confirmation does not match' };
		}
		isLoading.set(false);
	}

	function closeWindow() {
		getError.set(false);
		getSuccess.set(false);
	}

	setTimeout(function () {
		document.querySelector('.warningMessageSlideRight').remove();
	}, 5000);


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
	<title>Create User | Next Jobs</title>
	<script src="/aws-sdk-s3.min.js"></script>
</svelte:head>

<div class="flex h-screen w-screen">
	<!-- Sign Up Section -->
	<div id="flip-card" class="sm:w-6/12 w-full h-full">
		<div id="flip-card-inner" class="flip-card-inner">
			<div class="flip-card-front w-full h-full">
				<!-- If isAuthenticated is false, show this warning message -->
					{#if $userIsLoggedIn == true}
						<div
							class="text-lg flex absolute top-2 warningMessageSlideRight items-center p-4 text-yellow-800 rounded-lg bg-yellow-50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="stroke-current shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/></svg
							>
							<span>Please sign up first before proceed to post new job page</span>
						</div>
					{/if}

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
				<div
					class="absolute text-gray-200 m-2 left-14 top-72 sm:top-52 text-5xl font-bold slideRight"
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
					<h1>Sign Up</h1>
				</div>
				<!-- Image div -->
				<img src="background-img4.png" alt="" class="w-full h-full object-cover" />
			</div>

			<div
				class="flip-card-back flex justify-center bg-gradient-to-br from-pink-500 to-orange-400 block md:hidden"
			>
				<!-- If getError, show the warning message -->
				{#if $getError}
					<div
						class="z-10 text-lg border border-black flex absolute top-2 items-center p-4 text-yellow-800 rounded-lg bg-yellow-50 warningMessageSlideRight"
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
						<div class="ml-3 text-lg font-medium pr-2">
							{#if 'username' in formErrors}
								Warning: {formErrors['username'].message}
							{:else if 'email' in formErrors}
								Warning: {formErrors['email'].message}
							{:else if 'password' in formErrors}
								Warning: {formErrors['password'].message}
							{:else}
								Warning: ''
							{/if}
						</div>
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

				<!-- If success sign up show success notification -->
				{#if $getSuccess}
					<div
						class="z-10 border border-black flex absolute top-2 left-1 items-center p-4 text-green-800 rounded-lg bg-green-50 slideRight"
						role="alert"
					>
						<svg
							class="w-4 h-4 text-gray-800 dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 16 12"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M1 5.917 5.724 10.5 15 1.5"
							/>
						</svg>
						<span class="sr-only">Info</span>
						<div class="ml-3 text-lg pr-2">User successfully sign up !</div>
						<button
							on:click={closeWindow}
							type="button"
							class="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 inline-flex items-center justify-center h-8 w-8"
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

				<!-- Inner div -->
				<div class="flex w-9/12 h-full items-center justify-center ml-5">
					<!-- Form section -->
					<div
						class="w-full h-fit p-5 max-w-sm bg-white border border-gray-200 rounded-lg shadow overflow-y-auto flip-card-back-form"
					>
						<form class="space-y-3" on:submit={createUser}>
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
									class="fill-gray-200 dark:text-white p-2"
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
									Create Account
								</h5>
							</div>

							<!-- username section -->
							<div>
								<label for="username" class="block pb-1 text-lg font-medium text-left text-gray-900"
									>Your username</label
								>
								<input
									type="text"
									name="username"
									class="bg-white border border-gray-300 text-gray-900 text-base rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="John Doe"
									required
								/>
								<div class="mt-2 flex items-center gap-x-3">
									{#if $isUploadFlipCardFile == true}
										<img src="/{$selectedFile}" class="w-10 h-10 object-cover rounded-full" alt="" />
									{:else}
										<div class="border p-3 rounded-full bg-gray-200 my-1">
											<svg
												class="rounded-full cursor-pointer w-6 h-6 text-gray-400"
												fill="currentColor"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
												><path
													fill-rule="evenodd"
													d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
													clip-rule="evenodd"
												/></svg
											>
										</div>
									{/if}

									<label
										for="flipCard-file-upload"
										class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
									>
										<input
											type="file"
											name="flipCard-file-upload"
											class="sr-only"
											id="flipCard-file-upload"
											on:change={handleFileInputChangeOnFlipCard}
											accept=".jpg, .jpeg, .png"
										/>
										<span>Add Profile Picture</span>
									</label>
									<label for="fileInput" class="text-gray-500 h-4 flex items-center"
										>{$selectedFile}</label
									>
								</div>
							</div>

							<!-- email section -->
							<div>
								<label for="email" class="block pb-1 text-lg font-medium text-gray-900 text-left"
									>Your Email</label
								>
								<input
									type="email"
									name="email"
									placeholder="johndoe@example.com"
									class="bg-white border border-gray-300 text-gray-900 text-base rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
							</div>

							<PasswordVisibity />

							<PasswordConfirmationVisibility />

							<button
								type="submit"
								class="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							>
								{#if $isLoading}
									<span class="loading loading-dots loading-sm" />
								{:else}
									<span>Create New Account</span>
								{/if}
							</button>

							<div class="text-base font-medium text-gray-500">
								Registered? <a href="/login" class="text-pink-600 hover:underline">Log in HERE</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Form div -->
	<!-- Outer div -->
	<div
		class="border border-black flex items-center justify-center w-7/12 formDivision bg-gradient-to-br from-pink-500 to-orange-400"
	>

		<!-- If getError, show the warning message -->
		{#if $getError}
			<div
				class="border border-black flex absolute top-2 left-1 items-center p-4 text-yellow-800 rounded-lg bg-yellow-50"
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
				<div class="ml-3 text-sm font-medium pr-2">
					{#if 'username' in formErrors}
						Warning: {formErrors['username'].message}
					{:else if 'email' in formErrors}
						Warning: {formErrors['email'].message}
					{:else if 'password' in formErrors}
						Warning: {formErrors['password'].message}
					{:else}
						Warning: ''
					{/if}
				</div>
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

		<!-- If success sign up show success notification -->
		{#if $getSuccess}
			<div
				class="border border-black flex absolute top-2 left-1 items-center p-4 text-green-800 rounded-lg bg-green-50"
				role="alert"
			>
				<svg
					class="w-4 h-4 text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 16 12"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M1 5.917 5.724 10.5 15 1.5"
					/>
				</svg>
				<span class="sr-only">Info</span>
				<div class="ml-3 text-sm font-medium pr-2">User successfully sign up !</div>
				<button
					on:click={closeWindow}
					type="button"
					class="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 inline-flex items-center justify-center h-8 w-8"
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

		<!-- Inner div -->
		<div class="flex w-9/12 h-full items-center justify-center ml-10 slide-down">
			<!-- Form section -->
			<div
				class="w-full p-5 max-w-sm bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-5 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto createUserWindow"
			>
				<form class="space-y-3" on:submit={createUser}>
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
							class="fill-gray-200 dark:text-white p-2"
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
							Create Account
						</h5>
					</div>

					<!-- username section -->
					<div>
						<label
							for="username"
							class="block pb-1 text-sm font-medium text-gray-900 dark:text-white"
							>Your username</label
						>
						<input
							type="text"
							name="username"
							class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="John Doe"
							required
						/>
						<div class="mt-2 flex items-center gap-x-3">
							{#if $isUpload == true}
								<img src="/{$selectedFile}" class="w-10 h-10 object-cover rounded-full" alt="" />
							{:else}
								<div class="border p-3 rounded-full bg-gray-200 my-1">
									<svg
										class="rounded-full cursor-pointer w-6 h-6 text-gray-400"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
										><path
											fill-rule="evenodd"
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clip-rule="evenodd"
										/></svg
									>
								</div>
							{/if}

							<label
								for="file-upload"
								class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								<input
									type="file"
									name="file-upload"
									class="sr-only"
									id="file-upload"
									on:change={handleFileInputChangeOnCarousel}
									accept=".jpg, .jpeg, .png"
								/>
								<span>Add Profile Picture</span>
							</label>
							<label for="fileInput" class="text-gray-500 h-4 flex items-center"
								>{$selectedFile}</label
							>
						</div>
					</div>

					<!-- email section -->
					<div>
						<label for="email" class="block pb-1 text-sm font-medium text-gray-900 dark:text-white"
							>Your Email</label
						>
						<input
							type="email"
							name="email"
							placeholder="johndoe@example.com"
							class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							required
						/>
					</div>

					<PasswordVisibility />
					
					<PasswordConfirmationVisibility />

					<button
						type="submit"
						class="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						{#if $isLoading}
							<span class="loading loading-dots loading-sm" />
						{:else}
							<span>Create New Account</span>
						{/if}
					</button>

					<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
						Registered? <a href="/login" class="text-pink-600 hover:underline dark:text-blue-500"
							>Log in HERE</a
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	@import '../sign-up/+page.css';
</style>
