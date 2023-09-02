<script>
import { writable } from 'svelte/store'
import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public'; 
import { getTokenFromLocalStorage, getUserId } from '../../util/auth.js';

export let data;
let showModal = writable(false)
let jobId = '';
let jobIndex = '';

function popUpModal(job, index){
  showModal.set(true)
  jobIndex = index;
  console.log(index)
  
}

function hideModal(){
  showModal.set(false)
}

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
        data.jobs = data.jobs.filter((record) => record.id != id);
        location.reload()
      }else{
        data.jobs = '';
      }
    }

</script>


<style>
  @keyframes slideDown1 {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.slide-down1 {
  animation: slideDown1 2s ease forwards;
}

footer, .job-title{
  background-color: #20333a;
}
</style>

<div class="bg-gradient-to-bl from-pink-500 to-orange-400 body flex flex-col">

<nav class="bg-amber-500 border-gray-200 dark:bg-gray-900 flex justify-between h-96 bg-no-repeat bg-cover content-center" style="background-image: url('/background-img5.png');">
  <div class="flex items-center p-4 h-24">
    <!-- Left-hand side content -->
  <a href="/Home" class="flex items-center hover:bg-gray-300 rounded-full p-2 group">
      <span class="self-center text-3xl whitespace-nowrap text-gray-200 dark:text-white font-extrabold group-hover:text-black">NEXT JOB</span>

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
    <a href="/job/new" class="block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Post Job</a>
    <a href="/login" class="block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Log In</a>
    <a href="/sign-up" class="block rounded-full px-4 py-2 text-base text-gray-200 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Up</a>
  </div>

  <div class="absolute text-gray-200 m-2 top-40 left-44 text-2xl font-semibold slide-down1">
	<h1>Find Your Dream Job Here</h1>
  </div>
</nav>

<div class="p-4">
  <h1 class="text-3xl font-extrabold job-title p-4 text-white w-96 rounded-lg">Job Posted</h1>
    
<div class="grid grid-cols-4 gap-2">

{#each data.jobs as job, index}
<div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-5">
    <div class="h-80 flex items-center justify-center">
    <a href="/job/{job.id}">
        <img class="mt-2 object-contain h-full w-auto" src="{job.image_url}" alt="" />
    </a>
    </div>
    <div class="p-5 bg-green-200 rounded-b-lg">
        <a href="/job/{job.id}">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{job.title}</h5>
        </a>
        <p class="mb-3 font-normal text-lg text-gray-700">{job.description.slice(0, 240)}... </p>
        <p class="mb-3 font-bold text-xs">Job id: {job.id}</p>
        <p class="mb-3 font-bold text-xs">Created At: {new Date(job.created).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
        <p class="mb-3 font-bold text-xs">Updated At: {new Date(job.updated).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
        <div class="flex justify-end">
        <a href="/job/{job.id}/update" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-emerald-600 rounded-lg">
            Edit
            <svg class="w-6 h-6 text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
              <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
              <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
            </svg>
        </a>
        <button on:click={popUpModal(job, index)} class="inline-flex items-center ml-2 px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg">
            Delete
            <svg class="w-6 h-6 text-white ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
            </svg>
          </button>
        </div>
    </div>
</div>
{/each}
</div>         
</div>

{#each data.jobs as job, index}
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

 <footer class="w-full h-16 flex items-center text-gray-300 fill-gray-300">
    <svg xmlns="http://www.w3.org/2000/svg" class="p-2 w-12 h-12" stroke="current" viewBox="0 0 24 24" id="copyright"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M10.08 10.86c.05-.33.16-.62.3-.87s.34-.46.59-.62c.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29s-.4-.73-.7-1.01-.66-.5-1.08-.66-.88-.23-1.39-.23c-.65 0-1.22.11-1.7.34s-.88.53-1.2.92-.56.84-.71 1.36S8 11.29 8 11.87v.27c0 .58.08 1.12.23 1.64s.39.97.71 1.35.72.69 1.2.91c.48.22 1.05.34 1.7.34.47 0 .91-.08 1.32-.23s.77-.36 1.08-.63.56-.58.74-.94.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58s-.21.33-.36.46-.32.23-.52.3c-.19.07-.39.09-.6.1-.36-.01-.66-.08-.89-.23-.25-.16-.45-.37-.59-.62s-.25-.55-.3-.88-.08-.67-.08-1v-.27c0-.35.03-.68.08-1.01zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
    <span class="font-bold uppercase">next job</span>  
 </footer>

