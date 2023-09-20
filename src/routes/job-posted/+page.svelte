<script>
	import { writable } from 'svelte/store';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { isLoggedIn, getUserId } from '../../util/auth.js';
	import { onMount } from 'svelte';
  	import NavBar from '../component/navBar/NavBar.svelte';
	import Footer from '../component/Footer/Footer.svelte';

	export let data;
	let showModal = writable(false);
	let jobIndex = '';
	let authData = '';
	let joblist = data.jobs.items;
	let nav;
	let totalPages;
	let currentJobPage = 1;

	onMount(async () => {
		authData = JSON.parse(await isLoggedIn());
	});

	function popUpModal(job, index) {
		showModal.set(true);
		jobIndex = index;
	}

	function hideModal() {
		showModal.set(false);
	}

	//function to delete specific record//
	async function deleteRecord(id) {
		const response = await fetch(
			PUBLIC_BACKEND_BASE_URL + 'api/collections/jobs/records/' + `${id}`,
			{
				method: 'DELETE',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		if (response.ok) {
			joblist = joblist.filter((record) => record.id != id);
			location.reload();
		} else {
			joblist = '';
		}
	}

	async function nextPage() {
		if (data.jobs.page < data.jobs.totalPages) {
			currentJobPage = data.jobs.page + 1;
		} else {
			currentJobPage = data.jobs.page;
		}

		const userId = await getUserId();

		const response = await fetch(
			PUBLIC_BACKEND_BASE_URL +
				`api/collections/jobs/records?filter=(user.id='${userId}')&page=${currentJobPage}&perPage=4`,
			{
				method: 'GET',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		const res = await response.json();

		if (response.ok) {
			joblist = res.items;

			// Add the following lines to remove the underline from the first page button
			let firstPageButton = document.querySelector("#currentPage[value='1']");
			firstPageButton.classList.remove('underline');

			// Add the following lines to focus the current page number
			let currentPageButton = document.querySelector(`#currentPage[value="${currentJobPage}"]`);
			currentPageButton.focus();
		} else {
			joblist = joblist;
		}
	}

	async function prevPage() {
		if (data.jobs.page < data.jobs.totalPages && data.jobs.page > 1) {
			currentJobPage = data.jobs.page - 1;
		} else {
			currentJobPage = data.jobs.page;
		}

		const userId = await getUserId();

		const response = await fetch(
			PUBLIC_BACKEND_BASE_URL +
				`api/collections/jobs/records?filter=(user.id='${userId}')&page=${currentJobPage}&perPage=4`,
			{
				method: 'GET',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		const res = await response.json();

		if (response.ok) {
			joblist = res.items;

			// Add the following lines to remove the underline from the first page button
			let firstPageButton = document.querySelector("#currentPage[value='1']");
			firstPageButton.classList.remove('underline');

			// Add the following lines to focus the current page number
			let currentPageButton = document.querySelector(`#currentPage[value="${currentJobPage}"]`);
			currentPageButton.focus();
		} else {
			joblist = joblist;
		}
	}

	async function getCurrentPage(event) {
		// Get the clicked button element
		const element = event.target;

		const currentPageNo = element.textContent;

		currentJobPage = currentPageNo;

		const userId = await getUserId();

		const response = await fetch(
			PUBLIC_BACKEND_BASE_URL +
				`api/collections/jobs/records?filter=(user.id='${userId}')&page=${currentPageNo}&perPage=4`,
			{
				method: 'GET',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		const res = await response.json();

		if (response.ok) {
			joblist = res.items;
		} else {
			joblist = joblist;
		}
	}

	onMount(() => {
		nav = document.getElementById('totalPage');
		totalPages = data.jobs.totalPages; // Set the total number of pages

		// Loop through the total number of pages
		for (let i = 1; i <= totalPages; i++) {
			// Create a new button element
			let button = document.createElement('button');

			// Set the attributes and text content of the button
			button.setAttribute('id', 'currentPage');
			button.setAttribute('value', i); // Set the value attribute to the page number
			button.textContent = i;

			if (i === 1) {
				// If this is the first page button, add the underline class
				button.setAttribute(
					'class',
					'md:text-xl lg:text-base relative items-center pagination px-5 py-4 text-sm font-semibold focus:underline underline'
				);
			} else {
				// Otherwise, set the class without the underline class
				button.setAttribute(
					'class',
					'md:text-xl lg:text-base relative items-center pagination px-5 py-4 text-sm font-semibold focus:underline'
				);
			}

			// Attach a click event listener to the button
			button.addEventListener('click', getCurrentPage);

			// Append the button to the nav element
			nav.appendChild(button);
		}
	});
</script>

<div class="bg-gradient-to-bl from-pink-500 to-orange-400">
	<NavBar />

	<div class="p-4">
		<div class="flex justify-between">
			<h1 class="text-3xl font-extrabold job-title p-4 text-white w-96 rounded-lg">Job Posted</h1>

			<p
				class="pagination items-center justify-center flex mb-1 md:mr-1 ml-4 md:ml-0 md:text-2xl lg:text-lg"
			>
				show record page {currentJobPage} of {totalPages}
			</p>
		</div>

		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 body screenSize912 screenSize540 mt-2"
		>
			{#each joblist as job, index}
				<div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow mt-5 h-fit">
					<div class="h-64 flex items-center justify-center">
						<a href="/job/{job.id}" class="h-full w-full">
							{#if job.image_url == ''}
								<img class="object-contain h-full w-full p-1" src="question-mark.png" alt="" />
							{:else}
								<img class="object-cover h-full w-full rounded-t-lg" src={job.image_url} alt="" />
							{/if}
						</a>
					</div>
					<div class="p-5 bg-green-200 rounded-b-lg">
						<div class="h-52">
							<a href="/job/{job.id}">
								<h5
									class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
								>
									{job.title.length > 15 ? job.title.slice(0, 15) + '...' : job.title}
								</h5>
							</a>
							<p class="mb-3 font-normal lg:text-sm md:text-2xl text-xl text-gray-700">
								{job.description.slice(0, 30)}...
							</p>
							<p class="mb-3 font-bold lg:text-sm md:text-lg text-base">Job id: {job.id}</p>
							<p class="mb-3 font-bold lg:text-sm md:text-lg text-base">
								Created: {new Date(job.created).toLocaleDateString(undefined, {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
							<p class="mb-3 font-bold lg:text-sm md:text-lg text-base">
								Updated: {new Date(job.updated).toLocaleDateString(undefined, {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
						</div>
						<div class="flex justify-end screenSize280">
							<a
								href="/job/{job.id}/update"
								class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-emerald-600 rounded-lg"
							>
								Edit
								<svg
									class="w-6 h-6 text-white ml-2"
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
							</a>
							<button
								on:click={popUpModal(job, index)}
								class="inline-flex items-center ml-2 px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg"
							>
								Delete
								<svg
									class="w-6 h-6 text-white ml-2"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 18 20"
								>
									<path
										d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex items-center justify-center">
			<div class="flex justify-center bg-transparent px-4 py-3 sm:px-2 mt-5 w-60">
				<div class="sm:flex sm:items-center sm:justify-between w-fit flex justify-between">
					<button
						on:click={prevPage}
						class="inline-flex items-center rounded-l-md px-2 pagination focus:z-20 focus:outline-offset-0"
					>
						<svg
							class="md:mt-1 lg:mt-0 w-4 h-4 stroke-current"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 10"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 5H1m0 0 4 4M1 5l4-4"
							/>
						</svg>
						<span class="mb-0.5 px-2 md:text-2xl lg:text-lg">Previous</span>
					</button>

					<nav class="inline-flex -space-x-px" aria-label="Pagination" id="totalPage" />

					<button
						on:click={nextPage}
						class="relative inline-flex items-center rounded-r-md px-2 py-2 pagination focus:z-20 focus:outline-offset-0"
					>
						<span class="mb-0.5 px-2 md:text-2xl lg:text-lg">Next</span>
						<svg
							class="md:mt-1 lg:mt-0 w-4 h-4 stroke-current"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 10"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M1 5h12m0 0L9 1m4 4L9 9"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>

	{#each joblist as job, index}
		{#if $showModal && jobIndex == index}
			<div class="flex justify-center items-center">
				<div class="fixed inset-y-36 flex justify-center items-center z-50 max-h-full">
					<!-- Modal Overlay with background blur -->
					<div class="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md" />

					<!-- Modal info -->
					<div
						id="popup-modal"
						tabindex="-1"
						class="p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
					>
						<div class="relative w-full max-w-md max-h-full">
							<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
								<button
									on:click={hideModal}
									type="button"
									class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
									data-modal-hide="popup-modal"
								>
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
									<span class="sr-only">Close modal</span>
								</button>
								<div class="p-6 text-center">
									<svg
										class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 20 20"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
										/>
									</svg>
									<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
										Are you sure you want to delete this record?
									</h3>
									<p class="mb-3 font-bold">Job id: {job.id}</p>
									<button
										on:click|preventDefault={deleteRecord(job.id)}
										data-modal-hide="popup-modal"
										type="button"
										class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
									>
										Yes, I'm sure
									</button>
									<button
										on:click={hideModal}
										data-modal-hide="popup-modal"
										type="button"
										class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
										>No, cancel</button
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/each}
</div>

<Footer />

<style>
	@import '../job-posted/+page.css';
</style>
