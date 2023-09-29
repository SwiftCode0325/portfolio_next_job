<!-- Job Details Page -->

<script>
 import SvelteMarkdown from 'svelte-markdown';
 import humanize from "humanize-plus";
 import { isAuthenticated, getUserId, isLoggedIn, logOut} from '../../../util/auth.js';
 import { writable } from 'svelte/store';
 import { goto } from '$app/navigation';
 import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
 import { onMount } from 'svelte';
 import NavBar from '../../component/NavBar/NavBar.svelte';
 import Footer from '../../component/Footer/Footer.svelte';

export let data;
let showModal = writable(false)
let authData = '';
let animationTrigger = false;

onMount(async () => {
  authData = JSON.parse(await isLoggedIn());
  })

 function popUpModal () {
  showModal.set(true)
 }

 function hideModal () {
  showModal.set(false)
 }

onMount(() => {
    const handleScroll = () => {
      // Check if screen width is at least 768px
      if (window.innerWidth >= 768){
        const currentposition = window.scrollY

        // target requirement division //
        const slideUpDivision = document.getElementById('slideUpDiv');
        const triggerPosition = 100

        // target how to apply division //
        const slideUpDivision1 = document.getElementById('slideUpDiv1');
        const triggerPosition1 = 190

        if (currentposition >= triggerPosition) {
          slideUpDivision.style.display = "block"
          animationTrigger = true
        }else{
          slideUpDivision.style.display = "none"
        }

        if (currentposition >= triggerPosition1) {
          slideUpDivision1.style.display = "block";
          animationTrigger = true;
        } else {
          slideUpDivision1.style.display = "none";
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // Cleanup when component is unmounted
      window.removeEventListener('scroll', handleScroll);
    };
  });

 //function to delete specific record//
async function deleteRecord(id){

    const response = await fetch( PUBLIC_BACKEND_BASE_URL + 'api/collections/jobs/records/' + `${id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Content-Type':'application/json'
        }
      });

      if(response.ok){
        goto('/job-posted')
      }else{
        console.log(response.data)
      }
    }
</script>

<svelte:head>
  <title>Job Details | Next Jobs</title>
</svelte:head>

<div class="bg-gradient-to-bl from-pink-500 to-orange-400">

  <NavBar />

<div class="p-4 body">
  <div class="flex justify-between display">
    <h1 class="text-3xl font-extrabold job-title p-4 text-white w-64 sm:w-96 rounded-lg capitalize">{data.jobs.title}</h1>
    <!-- Show edit button for user that has log in and check whether the user is the user that create this job post-->
    {#if $isAuthenticated == true && data.jobs.user == getUserId()}
    <div class="w-32 sm:ml-2 md:w-auto md:justify-center md:items-center md:flex">
    <div class="inline-flex h-12 w-28 text-lg text-white bg-emerald-600 rounded-lg ml-2 mt-1">
        <a href="/job/{data.jobs.id}/update" class="h-full w-full flex items-center justify-center">
            Edit
            <svg class="w-6 h-6 text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
              <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
              <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
            </svg>
        </a>
    </div>
    <button on:click={popUpModal} class="inline-flex h-12 w-28 items-center justify-center ml-2 px-3 py-2 text-lg text-white bg-red-500 rounded-lg mt-1">
        Delete
        <svg class="w-6 h-6 text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
          <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
        </svg>
    </button>
    </div>
    {/if}
  </div>

  {#if $showModal}
<div class="flex justify-center items-center">
								<div class="fixed inset-y-56 flex justify-center items-center z-50 max-h-full">
									<!-- Modal Overlay with background blur -->
									<div class="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md" />

									<!-- Modal info -->
									<div
										id="popup-modal"
										tabindex="-1"
										class="p-4 md:inset-0"
									>
										<div class="relative w-full">
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
                          								<p class="mb-3 font-bold">Job id: {data.jobs.id}</p>
													<button on:click|preventDefault={deleteRecord(data.jobs.id)}
														type="button"
														class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
													>
														Yes, I'm sure
													</button>
													<button
														on:click={hideModal}
														type="button"
														class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
														>No, cancel</button
													>
												</div>
											</div>
										</div>
									</div>
								</div>
              </div>
							{/if}

    <p class="text-xl mt-2 capitalize">{data.jobs.employer}</p>
 
    <div class="flex flex-col sm:flex-row w-full mt-8">
        <div class="basis-2/3 max-w-none w-full">
          <div class="slide-up">
            <h2 class="text-xl font-semibold mb-2 text-black">Description</h2>
            <p class="border border-pink-600 mb-4"></p>
            <div class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl"> 
              <span class="text-xl md:text-lg"><SvelteMarkdown source={data.jobs.description}/></span>
            </div>
          </div>

            <div class="mt-6" />
          <div id="slideUpDiv" class="slide-up">
            <h2 class="text-xl font-semibold text-black mb-2">Requirements</h2>
            <p class="border border-pink-600 mb-4"></p>
            <div class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl">
              <span class="text-xl md:text-lg"><SvelteMarkdown source={data.jobs.requirements} /></span>
            </div>
          </div>

            <div class="mt-6" />
          <div id="slideUpDiv1" class="slide-up2">
            <h2 class="text-xl font-semibold text-black mb-2">How to Apply?</h2>
            <p class="border border-pink-600 mb-4"></p>
            <div class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl">
              <p class="text-xl md:text-lg break-all">{data.jobs.applicationInstructions}</p>
            </div>
          </div>
        </div>

        <div class="basis-1/3 md:ml-4 md:mt-0 mt-6">
          <div class="slide-up2">
            <h2 class="text-xl font-semibold mb-2">Location</h2>
            <p class="border md:border-orange-400 border-pink-600 mb-4"></p>
            <p class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl text-xl md:text-lg">{data.jobs.location}</p>
          </div>

            <div class="mt-6" />

          <div class="slide-up3">
            <h2 class="text-xl font-semibold mb-2">Salary Range</h2>
            <p class="border md:border-orange-400 border-pink-600 mb-4"></p>
            <p class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl text-xl md:text-lg">
                USD {humanize.formatNumber(data.jobs.minAnnualCompensation)} - USD {humanize.formatNumber(
                    data.jobs.maxAnnualCompensation
                )}
            </p>
          </div>

          <div class="mt-6 "/>

          <div class="slide-up4">
          <h2 class="text-xl font-semibold mb-2">Job Type</h2>
          <p class="border md:border-orange-400 border-pink-600 mb-4"></p>
          <div class="flex flex-row text-white text-lg">
            {#if data.jobs.job_type.includes('Full Time')}
            <h2 class="rounded-lg p-2 job-type ml-2">Full Time</h2>
            {/if}
            {#if data.jobs.job_type.includes('Part Time') }
            <h2 class="rounded-lg p-2 job-type ml-2">Part Time</h2>
            {/if}
            {#if data.jobs.job_type.includes('Remote')}
            <h2 class="rounded-lg p-2 job-type ml-2 flex items-center">Remote</h2>
            {/if}
          </div>
          </div>
        </div>
    </div>
</div>

<Footer />

</div>

<style>
    @import "../[slug]/+page.css";
</style>