<script>
	import { writable } from 'svelte/store';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { getTokenFromLocalStorage } from '../../util/auth.js';
	import { uploadMedia } from '../../util/s3-uploader.js';
	import { isLoggedIn, isAuthenticated } from '../../util/auth.js';

	let editForUsername = writable(false);
	let formErrors = {};
	let showImage = writable(false);
	let authData = '';
	let userPic = '';
	let getError = writable(false);
  	let flipCardInner;

	async function load() {
		const userIsLoggedIn = await isLoggedIn();
		if (userIsLoggedIn) {
			authData = JSON.parse(localStorage.getItem('auth'));
			showImage.set(true);
			userPic = authData.userProfilePicture;
		} else {
			authData = '';
			showImage.set(false);
		}
	}

	load();

	async function updateUserData(evt) {
		//prevent the page go to the top when button is clicked//
		evt.preventDefault();

		showImage.set(true);

		const fileInput = document.getElementById('file-upload');
		const file = fileInput.files[0];

		// Upload the file
		const [uploadedFileName, fileUrl] = await uploadMedia(file);

		userPic = fileUrl;

		// Create the userData object
		const userData = {
			profile_picture: fileUrl
		};

		const resp = await fetch(
			PUBLIC_BACKEND_BASE_URL + 'api/collections/users/records/' + `${authData.userId}`,
			{
				method: 'PATCH',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: getTokenFromLocalStorage()
				},
				body: JSON.stringify(userData)
			}
		);
	}

	async function updateUsername(evt) {
		evt.preventDefault();

		editForUsername.set(false);

		const userData = {
			username: evt.target['user-name'].value
		};

		const resp = await fetch(
			PUBLIC_BACKEND_BASE_URL + 'api/collections/users/records/' + `${authData.userId}`,
			{
				method: 'PATCH',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: getTokenFromLocalStorage()
				},
				body: JSON.stringify(userData)
			}
		);
		if (resp.status == 200) {
			getError.set(false);
		} else {
			const res = await resp.json();
			formErrors = res.data;
			getError.set(true);
		}
	}

	function usernameEdit() {
		editForUsername.set(true);

		document.getElementById('user-name').removeAttribute('disabled');
		document.getElementById('flip-card-user-name').removeAttribute('disabled');
	}

	function close() {
		editForUsername.set(false), document.getElementById('user-name').setAttribute('disabled', true);
		document.getElementById('flip-card-user-name').setAttribute('disabled', true);

		if ($isAuthenticated == true) {
			document.getElementById('user-name').value = authData.userName;
			document.getElementById('flip-card-user-name').value = authData.userName;
		} else {
			document.getElementById('user-name').value = 'login first to show data';
			document.getElementById('flip-card-user-name').value = 'login first to show data';
		}
	}

	function flip() {
		flipCardInner = document.getElementById('flip-card-inner');

		flipCardInner.style.transform = 'rotateY(0deg)';
	}

	function flipBack() {
		flipCardInner = document.getElementById('flip-card-inner');

		flipCardInner.style.transform = 'rotateY(180deg)';
	}

	function closeWindow() {
		getError.set(false);
	}
</script>

<svelte:head>
	<title>Dashboard | Next Jobs</title>
	<script src="/aws-sdk-s3.min.js"></script>
</svelte:head>

<div class="flex h-screen w-screen">
	<!-- Profile Section -->

	<!-- Image div -->
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
				<div
					class="absolute text-gray-200 m-2 top-72 sm:top-40 left-10 text-5xl font-bold slideRight"
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
					<h1>Dashboard</h1>
				</div>
				<img src="background-img1.png" alt="" class="w-full h-full object-cover" />
			</div>

			<div class="flip-card-back flex justify-center bg-gradient-to-br from-pink-500 to-orange-400">
				<!-- Profile detail -->
				<!-- If loginStatus is true, show the warning message -->
				{#if $getError}
					<div
						class="warningMessageSlideRight z-10 flex absolute top-2 right-0 items-center p-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-red-400"
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

				<div class="mt-32 sm:mt-20 w-10/12 flex justify-center">
					<div class="w-full flex flex-col items-center">
						{#if $showImage}
							<img
								class="w-40 h-40 p-1 rounded-full ring-1 ring-gray-300"
								src={userPic}
								alt="Bordered avatar"
							/>
						{:else}
							<div class="p-3 rounded-full relative w-40 h-40 bg-gray-200">
								<svg
									id="avatarButton"
									data-dropdown-toggle="userDropdown"
									data-dropdown-placement="bottom-start"
									class="rounded-full cursor-pointer w-32 h-40 text-gray-400 text-center ml-1"
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
							class="mt-5 rounded-md bg-white px-2.5 py-1.5 text-base sm:text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<input
								type="file"
								name="file-upload"
								class="sr-only"
								id="file-upload"
								on:change={updateUserData}
								accept=".jpg, .jpeg, .png"
							/>
							<span>Change Profile Picture</span>
						</label>

						<div class="mt-5 flex flex-col items-center justify-between w-full">
							<!-- Username -->
							<form on:submit={updateUsername} class="flex flex-row">
								<div class="p-2 m-2 flex flex-col sm:flex-row gap-1 mr-2">
									<div class="flex flex-row mb-2 sm:mb-0">
										<span
											class="userData p-2 text-white rounded-lg text-center w-24 text-lg sm:text-base"
											name="username">Username</span
										>
										<svg
											class="ml-1 w-6 h-6 text-gray-800 mt-2 mr-10"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 16"
										>
											<path
												d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z"
											/>
										</svg>
									</div>
									<input
										class="py-2 w-48 text-black text-center bg-white rounded-lg border-none text-lg sm:text-base focus:ring-pink-600 focus:border-pink-600"
										value={$isAuthenticated ? authData.userName : 'login first to show data'}
										type="text"
										name="user-name"
										id="flip-card-user-name"
										disabled
									/>
								</div>

								{#if $editForUsername == true}
									<div class="mt-1 flex flex-col">
										<button
											type="submit"
											class="rounded-lg w-10 h-10 text-center flex items-center justify-center bg-white p-2 my-2 mr-2 mt-3 sm:mt-0"
										>
											<svg
												class="w-6 h-6 text-emerald-600"
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
										</button>

										<button
											on:click={close}
											class="rounded-lg w-10 h-10 text-center flex items-center justify-center bg-white p-2 my-2"
										>
											<svg
												class="w-5 h-5 text-red-500"
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
								{:else}
									<button
										on:click={usernameEdit}
										class="rounded-lg w-10 h-10 text-center flex items-center justify-center bg-white p-2 my-4"
									>
										<svg
											class="w-6 h-6 text-emerald-600"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 18"
										>
											<path
												d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"
											/>
											<path
												d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"
											/>
										</svg>
									</button>
								{/if}
							</form>

							<!-- email -->
							<div class="p-1 mr-10 flex flex-col sm:flex-row gap-1">
								<div class="flex flex-row">
									<span
										class="userData p-2 text-white rounded-lg text-center w-24 mr-1 text-lg sm:text-base"
										>Email</span
									>
									<svg
										class="w-6 h-6 text-gray-800 dark:text-white mt-2 mr-10"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 20 16"
									>
										<path
											d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z"
										/>
									</svg>
								</div>
								<input
									class="py-2 w-48 text-black text-center bg-white rounded-lg border-none mt-2 sm:mt-0 text-lg sm:text-base"
									value={$isAuthenticated ? authData.userEmail : 'login first to show data'}
									type="email"
									name="user-email"
									id="user-email"
									disabled
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Profile Detail Division -->
	<div class="w-1/2 flex justify-center bg-gradient-to-br from-pink-500 to-orange-400 formDivision">
		{#if $getError}
			<div
				class="warningMessageSlideRight flex absolute top-2 left-2 items-center p-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-red-400"
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

		<div class="mt-20 w-10/12 flex justify-center slide-down">
			<div class="w-full flex flex-col items-center">
				{#if $showImage}
					<img
						class="w-40 h-40 p-1 rounded-full ring-1 ring-gray-300"
						src={userPic}
						alt="Bordered avatar"
					/>
				{:else}
					<div class="p-3 rounded-full relative w-40 h-40 bg-gray-200">
						<svg
							id="avatarButton"
							data-dropdown-toggle="userDropdown"
							data-dropdown-placement="bottom-start"
							class="rounded-full cursor-pointer w-32 h-40 text-gray-400 text-center ml-1"
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
					class="mt-5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
				>
					<input
						type="file"
						name="file-upload"
						class="sr-only"
						id="file-upload"
						on:change={updateUserData}
						accept=".jpg, .jpeg, .png"
					/>
					<span>Change Profile Picture</span>
				</label>

				<div class="mt-5 flex flex-col items-center justify-between w-full">
					<!-- Username -->
					<form on:submit={updateUsername} class="flex">
						<p class="p-2 m-2 flex flex-row gap-1">
							<span class="userData p-2 text-white rounded-lg text-center w-24" name="username"
								>Username</span
							>
							<svg
								class="w-6 h-6 text-gray-800 mt-2 mr-10"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 16"
							>
								<path
									d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z"
								/>
							</svg>
							<input
								class="py-2 w-48 text-black text-center bg-white rounded-lg border-none focus:ring-pink-600 focus:border-pink-600 focus:ring-2"
								value={$isAuthenticated ? authData.userName : 'login first to show data'}
								type="text"
								name="user-name"
								id="user-name"
								disabled
							/>
						</p>

						{#if $editForUsername == true}
							<button
								type="submit"
								class="border rounded-lg w-10 h-10 text-center flex items-center justify-center bg-white p-2 my-4 mr-2"
							>
								<svg
									class="w-6 h-6 text-emerald-600"
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
							</button>

							<button
								on:click={close}
								class="border rounded-lg w-10 h-10 text-center flex items-center justify-center bg-white p-2 my-4"
							>
								<svg
									class="w-5 h-5 text-red-500"
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
						{:else}
							<button
								on:click={usernameEdit}
								class="border rounded-lg w-10 h-10 text-center flex items-center justify-center bg-white p-2 my-4"
							>
								<svg
									class="w-6 h-6 text-emerald-600"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 18"
								>
									<path
										d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"
									/>
									<path
										d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"
									/>
								</svg>
							</button>
						{/if}
					</form>

					<!-- email -->
					<p class="p-2 m-2 flex flex-row gap-1 mr-11">
						<span class="userData p-2 text-white rounded-lg text-center w-24">Email</span>
						<svg
							class="w-6 h-6 text-gray-800 dark:text-white mt-2 mr-10"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 16"
						>
							<path
								d="m19.822 7.431-4.846-7A1 1 0 0 0 14.153 0H1a1 1 0 0 0-.822 1.569L4.63 8 .178 14.431A1 1 0 0 0 1 16h13.153a1.001 1.001 0 0 0 .823-.431l4.846-7a1 1 0 0 0 0-1.138Z"
							/>
						</svg>
						<input
							class="py-2 w-48 text-black text-center bg-white rounded-lg border-none"
							value={$isAuthenticated ? authData.userEmail : 'login first to show data'}
							type="email"
							name="user-email"
							id="user-email"
						/>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@import '../profile/+page.css';
</style>
