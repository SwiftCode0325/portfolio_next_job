<script>
	import { onMount } from 'svelte';
	import { Carousel } from 'flowbite';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { getTokenFromLocalStorage, getUserId } from '../../../../util/auth.js';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { fileUrl, selectedFile, handleFileInputChangeOnCarousel, isUpload, handleFileInputChangeOnFlipCard, isUploadFlipCardFile} from "../../../component/UploadMedia/UploadMedia.js"

	let currentPosition = writable(0);
	let showModal = writable(false);
	let isLoading = writable(false);
	let isRemote = writable(false);
	let isFullTime = writable(false);
	let isPartTime = writable(false);
	export let data;
	let jobType = data.jobs.job_type;
	let carousel1 = 0;
	let carousel2 = 0;
	let flipCardInner;
	let formErrors = '';

	//Carousel 1 (bigger screen size)//
	onMount(() => {
		// Initialize the Carousel once the component is mounted
		const items = [
			{
				position: 0,
				el: document.getElementById('carousel-item-1')
			},
			{
				position: 1,
				el: document.getElementById('carousel-item-2')
			},
			{
				position: 2,
				el: document.getElementById('carousel-item-3')
			},
			{
				position: 3,
				el: document.getElementById('carousel-item-4')
			},
			{
				position: 4,
				el: document.getElementById('carousel-item-5')
			}
		];
		const options = {
			defaultPosition: 0,
			interval: null,

			indicators: {
				activeClasses: 'bg-white',
				inactiveClasses: 'bg-white/50',
				items: [
					{
						position: 0,
						el: document.getElementById('carousel-indicator-1')
					},
					{
						position: 1,
						el: document.getElementById('carousel-indicator-2')
					},
					{
						position: 2,
						el: document.getElementById('carousel-indicator-3')
					},
					{
						position: 3,
						el: document.getElementById('carousel-indicator-4')
					},
					{
						position: 4,
						el: document.getElementById('carousel-indicator-5')
					}
				]
			},
			onChange: (items) => {
				currentPosition.set(items._activeItem.position);
			}
		};
		carousel1 = new Carousel(items, options);
	});
	function prevSlideCarousel1() {
		carousel1.prev();
	}
	function nextSlideCarousel1() {
		carousel1.next();
	}

	// Carousel 2 (flip-card-back) //
	onMount(() => {
		// Initialize the Carousel once the component is mounted
		const items = [
			{
				position: 0,
				el: document.getElementById('flip-card-carousel-item-1')
			},
			{
				position: 1,
				el: document.getElementById('flip-card-carousel-item-2')
			},
			{
				position: 2,
				el: document.getElementById('flip-card-carousel-item-3')
			},
			{
				position: 3,
				el: document.getElementById('flip-card-carousel-item-4')
			},
			{
				position: 4,
				el: document.getElementById('flip-card-carousel-item-5')
			}
		];
		const options = {
			defaultPosition: 0,
			interval: null,

			indicators: {
				activeClasses: 'bg-white',
				inactiveClasses: 'bg-white/50',
				items: [
					{
						position: 0,
						el: document.getElementById('flip-card-carousel-indicator-1')
					},
					{
						position: 1,
						el: document.getElementById('flip-card-carousel-indicator-2')
					},
					{
						position: 2,
						el: document.getElementById('flip-card-carousel-indicator-3')
					},
					{
						position: 3,
						el: document.getElementById('flip-card-carousel-indicator-4')
					},
					{
						position: 4,
						el: document.getElementById('flip-card-carousel-indicator-5')
					}
				]
			},
			onChange: (items) => {
				currentPosition.set(items._activeItem.position);
			}
		};
		carousel2 = new Carousel(items, options);
	});
	function prevSlideCarousel2() {
		carousel2.prev();
	}
	function nextSlideCarousel2() {
		carousel2.next();
	}

	// function to show up delete modal //
	function popUpModal() {
		showModal.set(true);
	}

	// function to hide delete modal //
	function hideModal() {
		showModal.set(false);
	}

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
		)

		if (response.ok) {
			goto('/Home')
		}else{
			console.log(response.data)
		}
	}

	// post job into database //
	async function updateJob(evt) {
		//prevent page go to the top when the button is clicked//
		evt.preventDefault();

		isLoading.set(true);

		const userID = await getUserId();

		const JobsData = {
			user: userID,
			title: evt.target['job-title'].value,
			minAnnualCompensation: evt.target['min-annual'].value,
			maxAnnualCompensation: evt.target['max-annual'].value,
			description: evt.target['description'].value,
			requirements: evt.target['requirements'].value,
			applicationInstructions: evt.target['application-instructions'].value,
			employer: evt.target['company-name'].value,
			location: evt.target['job-location'].value,
			job_type: [
				evt.target['list-checklist-full'].checked ? 'Full Time' : '',
				evt.target['list-checklist-part'].checked ? 'Part Time' : '',
				evt.target['list-checklist-remote'].checked ? 'Remote' : ''
			],
			image_url: $isUploadFlipCardFile ? fileUrl : data.jobs.image_url
		};

		const resp = await fetch(
			PUBLIC_BACKEND_BASE_URL + 'api/collections/jobs/records/' + `${data.jobs.id}`,
			{
				method: 'PATCH',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: getTokenFromLocalStorage()
				},
				body: JSON.stringify(JobsData)
			}
		);

		const res = await resp.json();

		if (resp.status == 200) {
			goto(`/job-posted`);
		} else {
			formErrors = res.data;
		}
		isLoading.set(false);
	}

	//check if meet requirement set the store to true so that the system will checked for the respective job type//
	if (jobType.some((item) => item.toLowerCase().includes('full time'))) {
		isFullTime.set(true);
	} else {
		isFullTime.set(false);
	}

	if (jobType.some((item) => item.toLowerCase().includes('part time'))) {
		isPartTime.set(true);
	} else {
		isPartTime.set(false);
	}

	if (jobType.some((item) => item.toLowerCase().includes('remote'))) {
		isRemote.set(true);
	} else {
		isRemote.set(false);
	}

	function flip() {
		flipCardInner = document.getElementById('flip-card-inner');

		flipCardInner.style.cssText = "-o-transform: rotateY(0); -webkit-transform: rotateY(0); -ms-transform: rotateY(0); transform: rotateY(0);";
	}

	function flipBack() {
		flipCardInner = document.getElementById('flip-card-inner');

		flipCardInner.style.cssText = "-o-transform: rotateY(-180deg); -webkit-transform: rotateY(-180deg); -ms-transform: rotateY(-180deg); transform: rotateY(-180deg);";
	}
</script>

<svelte:head>
	<title>Update Job | Next Jobs</title>
	<script src="/aws-sdk-s3.min.js"></script>
</svelte:head>

<div class="flex h-screen w-screen">
	<!-- Flip Card Division -->
	<div id="flip-card" class="sm:w-6/12 w-full h-full">
		<div id="flip-card-inner" class="flip-card-inner">
			<div class="flip-card-front w-full h-full">
				<div
					class="absolute text-gray-200 m-2 top-72 sm:top-40 left-10 sm:left-14 text-5xl font-bold slideRight"
				>
					<div class="flex">
						<a href="/Home" class="text-3xl sm:text-xl mb-3 hover:underline">Home</a>
						<svg
							class="w-4 h-4 text-gray-200 ml-2 mt-3 sm:mt-2"
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
					<h1>Edit Job</h1>
					<h1 class="indent-7 absolute text-gray-200 left-16 text-5xl font-bold mt-5">Section</h1>
				</div>

				<button
					on:click={flipBack}
					class="flex block sm:hidden absolute bottom-0 right-0 m-5 text-3xl font-bold text-gray-200"
				>
					Next
					<svg
						class="w-6 h-6 mt-2 ml-1"
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

				<!-- Image div -->
				<img src="/background-img2.png" alt="" class="w-full h-full object-cover" />
			</div>

			<div class="flip-card-back flex flex-col h-full p-2 md:hidden block">
				<button
					on:click={flip}
					class="text-gray-300 text-2xl sm:text-lg sm:block md:hidden h-12 w-24 mt-2 absolute left-2 top-0"
				>
					<div class="flex flex-row">
						<svg
							class="w-3 h-3 mt-2.5 mr-2 text-gray-300"
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

				<form
					on:submit={updateJob}
					class="w-full h-5/6 mt-16 flex items-center flip-card-carousel-form-division"
				>
					<div class="pb-2 w-full h-full">
						<div class="flex flex-col">
							<section class="flex flex-row flip-card-carousel-division">
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
									class="fill-gray-200 p-2"
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

								<h2 class="text-2xl font-semibold text-gray-900 flex items-center">
									Job Details
								</h2>
							</section>

							<p class="mt-5 text-xl text-gray-600">
								This information will be displayed publicly so be careful what you share.
							</p>
						</div>

						<div
							id="indicators-carousel"
							class="flip-back-card-division relative w-full h-5/6"
							data-carousel="static"
						>
							<!-- Carousel wrapper -->
							<div class="relative h-5/6 overflow-hidden rounded-lg">
								<!-- Item 1 -->
								<div
									id="flip-card-carousel-item-1"
									class="carousel-item hidden"
									data-carousel-item="active"
								>
									<div
										class="block absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
									>
										<div class="grid grid-cols-1 gap-x-6 gap-y-8 overflow-y-auto h-96">
											<!-- Job Title section -->
											<div class="sm:col-span-6">
												<label
													for="job-title"
													class="block text-xl font-medium text-gray-900 p-1 text-left"
													>Job Title</label
												>
												<div class="mt-1 p-1">
													<input
														type="text"
														name="job-title"
														id="job-title"
														required
														class="bg-white border border-gray-300 text-gray-900 text-lg rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 capitalize"
														placeholder="Software Engineer"
														value={data.jobs.title}
													/>
												</div>

												<!-- job type -->

												<div class="mt-2 py-4">
													<h3 class="font-semibold text-gray-900 text-xl text-left">Job Type :</h3>
													<ul
														class="w-72 ml-1 text-sm font-medium text-gray-900 bg-transparent rounded-lg"
													>
														<li class="rounded-t-lg">
															<div class="flex items-center mt-1 py-3">
																<!-- full time selection -->
																<input
																	id="list-checklist-full"
																	type="checkbox"
																	value=""
																	name="list-checklist"
																	class="w-6 h-6 rounded-full text-pink-600 bg-gray-100 border-gray-300 focus:ring-3 focus:ring-pink-600 checked:bg-pink-600"
																	bind:checked={$isFullTime}
																/>
																<label
																	for="list-checklist-full"
																	class="w-full ml-2 text-xl font-medium text-gray-900"
																	>Full Time</label
																>

																<!-- part time selection -->
																<input
																	id="list-checklist-part"
																	type="checkbox"
																	value=""
																	name="list-checklist"
																	class="w-6 h-6 rounded-full text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-600"
																	bind:checked={$isPartTime}
																/>
																<label
																	for="list-checklist-part"
																	class="w-full ml-2 text-xl font-medium text-gray-900"
																	>Part Time</label
																>

																<!-- remote selection -->
																<input
																	id="list-checklist-remote"
																	type="checkbox"
																	value=""
																	name="list-checklist"
																	class="w-6 h-6 rounded-full text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-600"
																	bind:checked={$isRemote}
																/>
																<label
																	for="list-checklist-remote"
																	class="w-full ml-2 text-xl font-medium text-gray-900"
																	>Remote</label
																>
															</div>
														</li>
													</ul>
												</div>

												<div class="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-6">
													<!-- Min Annual Compensation section -->
													<div class="sm:col-span-3">
														<label
															for="min-annual"
															class="block text-xl font-medium text-gray-900 p-1 text-left"
															>Min Annual Compensation</label
														>
														<div class="mt-1 p-1">
															<input
																type="number"
																name="min-annual"
																id="min-annual"
																required
																class="bg-white border border-gray-300 text-gray-900 text-lg rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
																placeholder="40000"
																value={data.jobs.minAnnualCompensation}
															/>
														</div>
													</div>

													<!-- Max Annual Compensation section -->
													<div class="sm:col-span-3">
														<label
															for="max-annual"
															class="block text-xl font-medium text-gray-900 p-1 text-left"
															>Max Annual Compensation</label
														>
														<div class="mt-1 p-1">
															<input
																type="number"
																name="max-annual"
																id="max-annual"
																required
																class="bg-white border border-gray-300 text-gray-900 text-lg rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
																placeholder="250000"
																value={data.jobs.maxAnnualCompensation}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div id="flip-card-carousel-item-2" class="carousel-item hidden" data-carousel-item>
									<div
										class="block absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
									>
										<div
											class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 overflow-y-auto h-96"
										>
											<!-- Company Name section -->
											<div class="sm:col-span-6">
												<label
													for="company-name"
													class="block text-xl font-medium text-gray-900 text-left"
													>Company Name</label
												>
												<div class="mt-1 p-1">
													<input
														type="text"
														name="company-name"
														id="company-name"
														required
														class="bg-white border border-gray-300 text-gray-900 text-lg rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
														placeholder="e.g. Facebook"
														value={data.jobs.employer}
													/>
												</div>
											</div>

											<!-- Upload Company Logo -->
											<div class="sm:col-span-6 col-span-full p-2">
												<span class="block text-xl font-medium text-gray-900 text-left"
													>Upload Company Logo</span
												>
												<div class="mt-2 flex items-center gap-x-3">
													{#if $isUploadFlipCardFile == true}
														<img
															src="{$selectedFile}"
															class="w-8 h-8 object-cover rounded-full"
															alt=""
														/>
													{:else}
														<img
															src={data.jobs.image_url}
															class="w-8 h-8 object-cover rounded-full"
															alt=""
															/>
													{/if}

													<label
														for="flipCard-file-upload"
														class="rounded-md bg-white px-2.5 py-1.5 text-xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
													>
														<input
															type="file"
															name="flipCard-file-upload"
															class="sr-only"
															id="flipCard-file-upload"
															on:change={handleFileInputChangeOnFlipCard}
															accept=".jpg, .jpeg, .png"
														/>
														<span>Change Image</span>
													</label>
													{#if $isUploadFlipCardFile == true}
													<label for="flipCard-file-upload" class="text-gray-900 h-4 flex items-center"
														>{$selectedFile.slice(0, 20)}...</label
													>
													{:else}
													<label for="flipCard-file-upload" class="text-gray-900 h-4 flex items-center"
														>{data.jobs.image_url.slice(0, 20)}...</label
													>
													{/if}
												</div>
											</div>

											<!-- Job Location section -->
											<div class="sm:col-span-6 mb-2">
												<label
													for="job-location"
													class="block text-xl text-left font-medium text-gray-900"
													>Job Location</label
												>
												<div class="mt-2 p-1">
													<input
														type="text"
														name="job-location"
														id="job-location"
														required
														class="bg-white border border-gray-300 text-gray-900 text-lg rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
														placeholder="e.g. Singapore"
														value={data.jobs.location}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Item 3 -->
								<div id="flip-card-carousel-item-3" class="carousel-item hidden" data-carousel-item>
									<div
										class="block absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
									>
										<div
											class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 overflow-y-auto h-96"
										>
											<!-- Decription section -->
											<div class="sm:col-span-6 p-1">
												<label
													for="company-name"
													class="block text-xl text-left font-medium text-gray-900 mt-4"
													>Description</label
												>
												<div class="mt-1 p-1">
													<textarea
														type="text"
														name="description"
														id="description"
														required
														class="bg-white border border-gray-300 text-gray-900 text-lg rounded-xl w-full h-80 focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
														placeholder="Job Description"
														value={data.jobs.description}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Item 4 -->
								<div id="flip-card-carousel-item-4" class="carousel-item hidden" data-carousel-item>
									<div
										class="block absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
									>
										<div
											class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 overflow-y-auto h-96"
										>
											<!-- Requirements section -->
											<div class="sm:col-span-6 p-1">
												<label
													for="requirements"
													class="block text-xl text-left font-medium text-gray-900 mt-4"
													>Requirements</label
												>
												<div class="mt-1 p-1">
													<textarea
														type="text"
														name="requirements"
														id="requirements"
														required
														class="bg-white border border-gray-300 text-gray-900 text-lg rounded-xl w-full h-80 focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
														placeholder="Job Requirement"
														value={data.jobs.requirements}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Item 5 -->
								<div id="flip-card-carousel-item-5" class="carousel-item hidden" data-carousel-item>
									<div
										class="block absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
									>
										<div
											class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 overflow-y-auto h-96"
										>
											<!-- Application Instructions section -->
											<div class="sm:col-span-6 p-1">
												<label
													for="application-instructions"
													class="block text-xl text-left font-medium text-gray-900 mt-4"
													>How to Apply ?</label
												>
												<div class="mt-2">
													<textarea
														type="text"
														name="application-instructions"
														id="application-instructions"
														required
														class="bg-white border border-gray-300 text-gray-900 text-lg rounded-xl w-full h-80 focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
														placeholder="Instruction to Apply This Job"
														value={data.jobs.applicationInstructions}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- Slider indicators -->
								<div
									class="carousel-indicator absolute z-30 flex space-x-3 -translate-x-1/2 bottom-2 left-1/2"
								>
									<button
										id="flip-card-carousel-indicator-1"
										type="button"
										class="carousel-indicator w-3 h-3 rounded-full"
									/>
									<button
										id="flip-card-carousel-indicator-2"
										type="button"
										class="w-3 h-3 rounded-full"
									/>
									<button
										id="flip-card-carousel-indicator-3"
										type="button"
										class="w-3 h-3 rounded-full"
									/>
									<button
										id="flip-card-carousel-indicator-4"
										type="button"
										class="w-3 h-3 rounded-full"
									/>
									<button
										id="flip-card-carousel-indicator-5"
										type="button"
										class="w-3 h-3 rounded-full"
									/>
								</div>
							</div>

							<div class="flex items-center justify-center p-2">
								<div class="flex justify-center space-x-4 p-2 w-56">
									{#if $currentPosition > 0}
										<!-- prev button -->
										<button
											on:click={prevSlideCarousel2}
											type="button"
											class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-full text-sm h-10 w-10 text-center mr-2 mb-2
                                flex items-center justify-center shadow-md"
										>
											<svg
												class="w-4 h-4 text-white"
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 6 10"
											>
												<path
													stroke="currentColor"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 1 1 5l4 4"
												/>
											</svg>
										</button>
									{/if}

									{#if $currentPosition >= 0 && $currentPosition < 4}
										<!-- Next Button -->
										<button
											on:click={nextSlideCarousel2}
											type="button"
											class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-full text-sm h-10 w-10 text-center mr-2 mb-2
                                flex items-center justify-center shadow-md"
										>
											<svg
												class="w-4 h-4 text-white"
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 6 10"
											>
												<path
													stroke="currentColor"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="m1 9 4-4-4-4"
												/>
											</svg>
										</button>
									{/if}

									{#if $currentPosition == 4}
										<!-- cancel -->
										<button
											on:click={popUpModal}
											data-modal-target="popup-modal"
											data-modal-toggle="popup-modal"
											type="button"
											class="slide-up bounce text-white bg-rose-400 focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-full text-sm h-10 w-10 text-center mr-2 mb-2
                                flex items-center justify-center shadow-md"
										>
											<svg
												class="w-6 h-6 text-gray-800"
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 18 20"
											>
												<path
													stroke="currentColor"
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
												/>
											</svg>
										</button>

										{#if $showModal}
											<div class="fixed inset-y-52 flex justify-center items-center z-50 h-full">
												<!-- Modal Overlay with background blur -->
												<div class="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md" />

												<!-- Modal info -->
												<div
													id="popup-modal"
													tabindex="-1"
													class="p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full mr-3"
												>
													<div class="relative w-full max-w-md max-h-full">
														<div class="relative bg-white rounded-lg shadow">
															<button
																on:click={hideModal}
																type="button"
																class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
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
																	class="mx-auto mb-4 text-gray-400 w-12 h-12"
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
																<h3
																	class="mb-5 text-xl font-normal text-gray-500"
																>
																	Are you sure you want to delete this record?
																</h3>
																<button
																	on:click={deleteRecord(data.jobs.id)}
																	type="button"
																	class="w-36 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-lg inline-flex items-center px-5 py-2.5 text-center mr-2"
																>
																	Yes, I'm sure
																</button>
																<button
																	on:click={hideModal}
																	type="button"
																	class="w-36 mr-2 mt-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-lg font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
																	>No, cancel</button
																>
															</div>
														</div>
													</div>
												</div>
											</div>
										{/if}

										<!-- save -->
										<button
											type="submit"
											class="slide-up bounce text-white bg-green-400 font-medium rounded-full text-sm h-10 w-10 text-center mr-2 mb-2
                                flex items-center justify-center shadow-md"
										>
											<svg
												class="w-6 h-6"
												version="1.1"
												id="Layer_1"
												xmlns="http://www.w3.org/2000/svg"
												xmlns:xlink="http://www.w3.org/1999/xlink"
												x="0px"
												y="0px"
												viewBox="0 0 122.73 122.88"
												style="enable-background:new 0 0 122.73 122.88"
												xml:space="preserve"
												><style type="text/css">
													.st0 {
														fill-rule: evenodd;
														clip-rule: evenodd;
													}
												</style><g
													><path
														class="st0"
														d="M109.5,113.68L109.5,113.68l-6.09,0c-0.4,0-0.73-0.32-0.73-0.72V69.48l0-0.1c0-0.9-0.17-1.65-0.49-2.22 c-0.06-0.11-0.14-0.22-0.2-0.31c-0.06-0.09-0.16-0.18-0.23-0.27l-0.02-0.02c-0.3-0.3-0.68-0.53-1.12-0.69l-0.25-0.07l-0.04-0.01 l-0.01,0c-0.41-0.11-0.88-0.17-1.38-0.17h-0.05l-0.08,0H36.75c-0.89,0-1.62,0.17-2.18,0.49l-0.02,0.01l-0.27,0.17l-0.04,0.04 c-0.09,0.07-0.18,0.15-0.27,0.23l-0.02,0.02l-0.01,0.01c-0.62,0.63-0.92,1.57-0.92,2.82l0,0.04l0,43.54h0 c0,0.4-0.33,0.72-0.73,0.72l-9.85,0c0,0,0,0,0,0c-0.19,0-0.38-0.08-0.51-0.21L9.87,101.41c-0.18-0.14-0.29-0.36-0.29-0.59l0-87.91 l0-0.08c0-0.83,0.15-1.52,0.44-2.07l0,0c0.05-0.11,0.11-0.2,0.17-0.29l0.02-0.03c0.07-0.11,0.19-0.18,0.25-0.29l0.01-0.02 l0.02-0.02l0,0c0.25-0.25,0.57-0.45,0.92-0.59l0.04-0.02l0.02-0.01l0.02-0.01l0.18-0.06v0l0.01-0.01c0.42-0.14,0.9-0.2,1.44-0.21 l0.09-0.01l26.21,0c0.4,0,0.73,0.32,0.73,0.72v28.75c0,0.52,0.05,1.03,0.13,1.5c0.09,0.46,0.15,0.98,0.39,1.34l0.01,0.02l0,0.01v0 c0.18,0.44,0.42,0.87,0.67,1.25c0.24,0.37,0.56,0.77,0.9,1.13l0.02,0.02l0,0.01l0.01,0c0.48,0.5,0.94,1.15,1.62,1.27l0.01,0l0.01,0 l0.01,0.01l0.32,0.17l0,0l0.4,0.18v0l0.01,0l0,0l0,0v0c0.33,0.14,0.67,0.26,1,0.34l0.01,0l0.03,0l0.01,0l0.03,0l0.26,0.05v0 c0.45,0.09,0.93,0.14,1.42,0.14l0.02,0h47.8c1.03,0,1.98-0.18,2.85-0.53l0.01-0.01c0.87-0.36,1.67-0.9,2.39-1.61l0.03-0.03 c0.36-0.36,0.69-0.75,0.96-1.16c0.26-0.38,0.58-0.76,0.66-1.22l0-0.01l0.01-0.01l0.01-0.02c0.18-0.43,0.34-0.88,0.41-1.34l0-0.03 c0.09-0.47,0.13-0.97,0.13-1.49V9.92c0-0.4,0.33-0.73,0.73-0.73h6c0.58,0,1.09,0.07,1.54,0.21c0.48,0.15,0.89,0.39,1.2,0.7 c0.68,0.67,0.88,1.67,0.9,2.59l0.01,0.09v0.05l0,0.02v97.19c0,0.56-0.07,1.07-0.21,1.51l-0.01,0.03v0l0,0.02l-0.08,0.22l0,0 l-0.02,0.06l-0.09,0.2l-0.01,0.04l-0.02,0.04l0,0l-0.03,0.06l-0.15,0.22l0,0l-0.05,0.08l-0.14,0.17l-0.06,0.07 c-0.15,0.16-0.33,0.3-0.53,0.42c-0.17,0.1-0.36,0.19-0.55,0.26l-0.06,0.02c-0.16,0.05-0.34,0.1-0.53,0.14l-0.02,0l-0.01,0l-0.02,0 l-0.09,0.01l-0.02,0l0,0l-0.02,0c-0.22,0.03-0.49,0.05-0.76,0.06H109.5L109.5,113.68z M53.93,104.43c-1.66,0-3-1.34-3-3 c0-1.66,1.34-3,3-3h31.12c1.66,0,3,1.34,3,3c0,1.66-1.34,3-3,3H53.93L53.93,104.43z M53.93,89.03c-1.66,0-3-1.34-3-3s1.34-3,3-3 h31.12c1.66,0,3,1.34,3,3s-1.34,3-3,3H53.93L53.93,89.03z M94.03,9.39l-45.32-0.2v25.86H48.7c0,0.46,0.06,0.86,0.17,1.2 c0.03,0.06,0.04,0.1,0.07,0.15c0.09,0.23,0.22,0.44,0.4,0.61l0.03,0.03v0c0.06,0.06,0.11,0.1,0.17,0.15 c0.06,0.05,0.13,0.09,0.2,0.14c0.39,0.23,0.92,0.34,1.58,0.34v0l40.1,0.25v0l0,0v0c0.91,0,1.57-0.21,1.98-0.63 c0.42-0.43,0.63-1.1,0.63-2.02h0V9.39L94.03,9.39z M41.91,73.23h53.07v0c0.35,0,0.65,0.29,0.65,0.64l0,39.17 c0,0.35-0.29,0.65-0.65,0.65H41.91v0c-0.35,0-0.65-0.29-0.65-0.64l0-39.17C41.26,73.52,41.56,73.23,41.91,73.23L41.91,73.23 L41.91,73.23z M9.68,0h104.26c4.91,0,8.79,3.86,8.79,8.79V114c0,4.95-3.9,8.88-8.79,8.88l-96.61,0l-0.24-0.25L1.05,106.6L0,105.9 V8.76C0,3.28,4.81,0,9.68,0L9.68,0L9.68,0z"
													/></g
												></svg
											>
										</button>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>

	<!-- Carousel div -->
	<div class="flex items-center justify-center w-6/12 formDivision">
		<div class="flex flex-col w-9/12 h-full items-center justify-center">
			<div class="slide-down">
				<form on:submit={updateJob}>
					<div class="space-y-10">
						<div class="pb-2">
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
									class="fill-gray-200 p-2"
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

								<h2 class="text-base font-semibold text-gray-900 flex items-center">
									Job Details
								</h2>
							</div>
							<p class="mt-1 text-sm text-gray-600">
								This information will be displayed publicly so be careful what you share.
							</p>

							<div class="flex flex-col items-center justify-center">
								<div id="indicators-carousel" class="relative w-full mt-2" data-carousel="static">
									<!-- Carousel wrapper -->
									<div class="relative h-56 overflow-hidden rounded-lg md:h-96">
										<!-- Item 1 -->
										<div
											id="carousel-item-1"
											class="carousel-item hidden"
										>
											<div
												class="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
											>
												<div
													class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 overflow-y-auto h-80"
												>
													<!-- Job Title section -->
													<div class="sm:col-span-6">
														<label
															for="job-title"
															class="block text-sm font-medium text-gray-900 p-1"
															>Job Title</label
														>
														<div class="mt-1 p-1">
															<input
																type="text"
																name="job-title"
																id="job-title"
																required
																class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 capitalize"
																placeholder="Software Engineer"
																value={data.jobs.title}
															/>
														</div>

														<!-- job type -->

														<div class="mt-2 py-4">
															<h3 class="font-semibold text-gray-900">
																Job Type :
															</h3>
															<ul
																class="w-72 ml-1 text-sm font-medium text-gray-900 bg-transparent rounded-lg"
															>
																<li class="rounded-t-lg">
																	<div class="flex items-center mt-1 py-3">
																		<!-- full time selection -->
																		<input
																			id="list-checklist-full"
																			type="checkbox"
																			bind:checked={$isFullTime}
																			name="list-checklist"
																			class="w-4 h-4 rounded-full text-pink-600 bg-gray-100 border-gray-300 focus:ring-3 focus:ring-pink-600 checked:bg-pink-600"
																		/>
																		<label
																			for="list-checklist-full"
																			class="w-full ml-2 text-sm font-medium text-gray-900"
																			>Full Time</label
																		>

																		<!-- part time selection -->
																		<input
																			id="list-checklist-part"
																			type="checkbox"
																			bind:checked={$isPartTime}
																			name="list-checklist"
																			class="w-4 h-4 rounded-full text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-600"
																		/>
																		<label
																			for="list-checklist-part"
																			class="w-full ml-2 text-sm font-medium text-gray-900"
																			>Part Time</label
																		>

																		<!-- remote selection -->
																		<input
																			id="list-checklist-remote"
																			type="checkbox"
																			bind:checked={$isRemote}
																			name="list-checklist"
																			class="w-4 h-4 rounded-full text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-600"
																		/>
																		<label
																			for="list-checklist-remote"
																			class="w-full ml-2 text-sm font-medium text-gray-900"
																			>Remote</label
																		>
																	</div>
																</li>
															</ul>
														</div>

														<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
															<!-- Min Annual Compensation section -->
															<div class="sm:col-span-3">
																<label
																	for="min-annual"
																	class="block text-sm font-medium text-gray-900 p-1"
																	>Min Annual Compensation</label
																>
																<div class="mt-1 p-1">
																	<input
																		type="number"
																		name="min-annual"
																		id="min-annual"
																		required
																		class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
																		placeholder="40000"
																		value={data.jobs.minAnnualCompensation}
																	/>
																</div>
															</div>

															<!-- Max Annual Compensation section -->
															<div class="sm:col-span-3">
																<label
																	for="max-annual"
																	class="block text-sm font-medium text-gray-900 p-1"
																	>Max Annual Compensation</label
																>
																<div class="mt-1 p-1">
																	<input
																		type="number"
																		name="max-annual"
																		id="max-annual"
																		required
																		class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
																		placeholder="250000"
																		value={data.jobs.maxAnnualCompensation}
																	/>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<!-- Item 2 -->
										<div id="carousel-item-2" class="carousel-item hidden" data-carousel-item>
											<div
												class="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
											>
												<div
													class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 overflow-y-auto h-80 mb-4"
												>
													<!-- Company Name section -->
													<div class="sm:col-span-6">
														<label
															for="company-name"
															class="block text-sm font-medium text-gray-900"
															>Company Name</label
														>
														<div class="mt-1 p-1">
															<input
																type="text"
																name="company-name"
																id="company-name"
																required
																class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
																placeholder="e.g. Facebook"
																value={data.jobs.employer}
															/>
														</div>
													</div>

													<!-- Upload Company Logo -->
													<div class="sm:col-span-6 col-span-full p-2">
														<span
															class="block text-sm font-medium text-gray-900 text-left"
															>Upload Company Logo</span
														>
														<div class="mt-2 flex items-center gap-x-3">
															{#if $isUpload == true}
																	<img
																		src="{$selectedFile}"
																		class="w-8 h-8 object-cover rounded-full"
																		alt=""
																	/>
															{:else}
																	<img
																		src={data.jobs.image_url}
																		class="w-8 h-8 object-cover rounded-full"
																		alt=""
																	/>
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
																<span>Change Image</span>
															</label>
															{#if $isUpload}
																<label for="file-upload" class="text-gray-900 h-4 flex items-center"
																	>{$selectedFile.slice(0, 20)}...</label
																>
															{:else}
																<label for="file-upload" class="text-gray-900 h-4 flex items-center"
																	>{data.jobs.image_url.slice(0, 20)}...</label
																>
															{/if}
														</div>
													</div>

													<!-- Job Location section -->
													<div class="sm:col-span-6 mb-2">
														<label
															for="job-location"
															class="block text-sm font-medium text-gray-900"
															>Job Location</label
														>
														<div class="mt-2 p-1">
															<input
																type="text"
																name="job-location"
																id="job-location"
																required
																class="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 w-full p-2.5"
																placeholder="e.g. Singapore"
																value={data.jobs.location}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>

										<!-- Item 3 -->
										<div id="carousel-item-3" class="carousel-item hidden" data-carousel-item>
											<div
												class="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
											>
												<div
													class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 overflow-y-auto h-80"
												>
													<!-- Decription section -->
													<div class="sm:col-span-6 p-1">
														<label
															for="company-name"
															class="block text-sm font-medium text-gray-900 mt-4"
															>Description</label
														>
														<div class="mt-1 p-1">
															<textarea
																type="text"
																name="description"
																id="description"
																required
																class="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl w-full h-56 focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
																placeholder="Job Description"
																value={data.jobs.description}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>

										<!-- Item 4 -->
										<div id="carousel-item-4" class="carousel-item hidden" data-carousel-item>
											<div
												class="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
											>
												<div
													class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 overflow-y-auto h-80"
												>
													<!-- Requirements section -->
													<div class="sm:col-span-6 p-1">
														<label
															for="requirements"
															class="block text-sm font-medium text-gray-900 mt-4"
															>Requirements</label
														>
														<div class="mt-1 p-1">
															<textarea
																type="text"
																name="requirements"
																id="requirements"
																required
																class="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl w-full h-56 focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
																placeholder="Job Requirement"
																value={data.jobs.requirements}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>

										<!-- Item 5 -->
										<div id="carousel-item-5" class="carousel-item hidden" data-carousel-item>
											<div
												class="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 p-8 border round rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"
											>
												<div
													class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 overflow-y-auto h-80"
												>
													<!-- Application Instructions section -->
													<div class="sm:col-span-6 p-1">
														<label
															for="application-instructions"
															class="block text-sm font-medium text-gray-900 mt-4"
															>How to Apply ?</label
														>
														<div class="mt-2">
															<textarea
																type="text"
																name="application-instructions"
																id="application-instructions"
																required
																class="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl w-full h-56 focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5"
																placeholder="Instruction to Apply This Job"
																value={data.jobs.applicationInstructions}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									<!-- Slider indicators -->
									<div class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
										<button id="carousel-indicator-1" type="button" class="w-3 h-3 rounded-full" />
										<button id="carousel-indicator-2" type="button" class="w-3 h-3 rounded-full" />
										<button id="carousel-indicator-3" type="button" class="w-3 h-3 rounded-full" />
										<button id="carousel-indicator-4" type="button" class="w-3 h-3 rounded-full" />
										<button id="carousel-indicator-5" type="button" class="w-3 h-3 rounded-full" />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="flex items-center justify-center">
						<div class="flex justify-center space-x-4 p-2 w-56">
							{#if $currentPosition > 0}
								<!-- prev button -->
								<button
									on:click={prevSlideCarousel1}
									type="button"
									class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-full text-sm h-10 w-10 text-center mr-2 mb-2
                                flex items-center justify-center shadow-md"
								>
									<svg
										class="w-4 h-4 text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 6 10"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 1 1 5l4 4"
										/>
									</svg>
								</button>
							{/if}

							{#if $currentPosition >= 0 && $currentPosition < 4}
								<!-- Next Button -->
								<button
									on:click={nextSlideCarousel1}
									type="button"
									class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-full text-sm h-10 w-10 text-center mr-2 mb-2
                                flex items-center justify-center shadow-md"
								>
									<svg
										class="w-4 h-4 text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 6 10"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="m1 9 4-4-4-4"
										/>
									</svg>
								</button>
							{/if}

							{#if $currentPosition == 4}
								<!-- cancel -->
								<button
									on:click={popUpModal}
									data-modal-target="popup-modal"
									data-modal-toggle="popup-modal"
									type="button"
									class="slide-up bounce text-white bg-rose-400 focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-full text-sm h-10 w-10 text-center mr-2 mb-2
                                flex items-center justify-center shadow-md"
								>
									<svg
										class="w-6 h-6 text-gray-800"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 18 20"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
										/>
									</svg>
								</button>

								{#if $showModal}
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
												<div class="relative bg-white rounded-lg shadow">
													<button
														on:click={hideModal}
														type="button"
														class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
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
															class="mx-auto mb-4 text-gray-400 w-12 h-12"
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
														<h3 class="mb-5 text-lg font-normal text-gray-500">
															Are you sure you want to delete this record?
														</h3>
														<button
															on:click={deleteRecord(data.jobs.id)}
															data-modal-hide="popup-modal"
															type="button"
															class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
														>
															Yes, I'm sure
														</button>
														<button
															on:click={hideModal}
															data-modal-hide="popup-modal"
															type="button"
															class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
															>No, cancel</button
														>
													</div>
												</div>
											</div>
										</div>
									</div>
								{/if}

								<!-- save -->
								<button
									type="submit"
									class="slide-up bounce text-white bg-green-400 font-medium rounded-full text-sm h-10 w-10 text-center mr-2 mb-2
                                flex items-center justify-center shadow-md"
								>
									<svg
										class="w-6 h-6"
										version="1.1"
										id="Layer_1"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
										x="0px"
										y="0px"
										viewBox="0 0 122.73 122.88"
										style="enable-background:new 0 0 122.73 122.88"
										xml:space="preserve"
										><style type="text/css">
											.st0 {
												fill-rule: evenodd;
												clip-rule: evenodd;
											}
										</style><g
											><path
												class="st0"
												d="M109.5,113.68L109.5,113.68l-6.09,0c-0.4,0-0.73-0.32-0.73-0.72V69.48l0-0.1c0-0.9-0.17-1.65-0.49-2.22 c-0.06-0.11-0.14-0.22-0.2-0.31c-0.06-0.09-0.16-0.18-0.23-0.27l-0.02-0.02c-0.3-0.3-0.68-0.53-1.12-0.69l-0.25-0.07l-0.04-0.01 l-0.01,0c-0.41-0.11-0.88-0.17-1.38-0.17h-0.05l-0.08,0H36.75c-0.89,0-1.62,0.17-2.18,0.49l-0.02,0.01l-0.27,0.17l-0.04,0.04 c-0.09,0.07-0.18,0.15-0.27,0.23l-0.02,0.02l-0.01,0.01c-0.62,0.63-0.92,1.57-0.92,2.82l0,0.04l0,43.54h0 c0,0.4-0.33,0.72-0.73,0.72l-9.85,0c0,0,0,0,0,0c-0.19,0-0.38-0.08-0.51-0.21L9.87,101.41c-0.18-0.14-0.29-0.36-0.29-0.59l0-87.91 l0-0.08c0-0.83,0.15-1.52,0.44-2.07l0,0c0.05-0.11,0.11-0.2,0.17-0.29l0.02-0.03c0.07-0.11,0.19-0.18,0.25-0.29l0.01-0.02 l0.02-0.02l0,0c0.25-0.25,0.57-0.45,0.92-0.59l0.04-0.02l0.02-0.01l0.02-0.01l0.18-0.06v0l0.01-0.01c0.42-0.14,0.9-0.2,1.44-0.21 l0.09-0.01l26.21,0c0.4,0,0.73,0.32,0.73,0.72v28.75c0,0.52,0.05,1.03,0.13,1.5c0.09,0.46,0.15,0.98,0.39,1.34l0.01,0.02l0,0.01v0 c0.18,0.44,0.42,0.87,0.67,1.25c0.24,0.37,0.56,0.77,0.9,1.13l0.02,0.02l0,0.01l0.01,0c0.48,0.5,0.94,1.15,1.62,1.27l0.01,0l0.01,0 l0.01,0.01l0.32,0.17l0,0l0.4,0.18v0l0.01,0l0,0l0,0v0c0.33,0.14,0.67,0.26,1,0.34l0.01,0l0.03,0l0.01,0l0.03,0l0.26,0.05v0 c0.45,0.09,0.93,0.14,1.42,0.14l0.02,0h47.8c1.03,0,1.98-0.18,2.85-0.53l0.01-0.01c0.87-0.36,1.67-0.9,2.39-1.61l0.03-0.03 c0.36-0.36,0.69-0.75,0.96-1.16c0.26-0.38,0.58-0.76,0.66-1.22l0-0.01l0.01-0.01l0.01-0.02c0.18-0.43,0.34-0.88,0.41-1.34l0-0.03 c0.09-0.47,0.13-0.97,0.13-1.49V9.92c0-0.4,0.33-0.73,0.73-0.73h6c0.58,0,1.09,0.07,1.54,0.21c0.48,0.15,0.89,0.39,1.2,0.7 c0.68,0.67,0.88,1.67,0.9,2.59l0.01,0.09v0.05l0,0.02v97.19c0,0.56-0.07,1.07-0.21,1.51l-0.01,0.03v0l0,0.02l-0.08,0.22l0,0 l-0.02,0.06l-0.09,0.2l-0.01,0.04l-0.02,0.04l0,0l-0.03,0.06l-0.15,0.22l0,0l-0.05,0.08l-0.14,0.17l-0.06,0.07 c-0.15,0.16-0.33,0.3-0.53,0.42c-0.17,0.1-0.36,0.19-0.55,0.26l-0.06,0.02c-0.16,0.05-0.34,0.1-0.53,0.14l-0.02,0l-0.01,0l-0.02,0 l-0.09,0.01l-0.02,0l0,0l-0.02,0c-0.22,0.03-0.49,0.05-0.76,0.06H109.5L109.5,113.68z M53.93,104.43c-1.66,0-3-1.34-3-3 c0-1.66,1.34-3,3-3h31.12c1.66,0,3,1.34,3,3c0,1.66-1.34,3-3,3H53.93L53.93,104.43z M53.93,89.03c-1.66,0-3-1.34-3-3s1.34-3,3-3 h31.12c1.66,0,3,1.34,3,3s-1.34,3-3,3H53.93L53.93,89.03z M94.03,9.39l-45.32-0.2v25.86H48.7c0,0.46,0.06,0.86,0.17,1.2 c0.03,0.06,0.04,0.1,0.07,0.15c0.09,0.23,0.22,0.44,0.4,0.61l0.03,0.03v0c0.06,0.06,0.11,0.1,0.17,0.15 c0.06,0.05,0.13,0.09,0.2,0.14c0.39,0.23,0.92,0.34,1.58,0.34v0l40.1,0.25v0l0,0v0c0.91,0,1.57-0.21,1.98-0.63 c0.42-0.43,0.63-1.1,0.63-2.02h0V9.39L94.03,9.39z M41.91,73.23h53.07v0c0.35,0,0.65,0.29,0.65,0.64l0,39.17 c0,0.35-0.29,0.65-0.65,0.65H41.91v0c-0.35,0-0.65-0.29-0.65-0.64l0-39.17C41.26,73.52,41.56,73.23,41.91,73.23L41.91,73.23 L41.91,73.23z M9.68,0h104.26c4.91,0,8.79,3.86,8.79,8.79V114c0,4.95-3.9,8.88-8.79,8.88l-96.61,0l-0.24-0.25L1.05,106.6L0,105.9 V8.76C0,3.28,4.81,0,9.68,0L9.68,0L9.68,0z"
											/></g
										></svg
									>
								</button>
							{/if}
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

