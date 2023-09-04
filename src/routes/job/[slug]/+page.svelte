<!-- Job Details Page -->

<script>
 import SvelteMarkdown from 'svelte-markdown';
 import humanize from "humanize-plus";
 export let data;

 let showModal = writable(false)
 let profileDropDownMenu = writable(false);
let userloggedIn = writable(false);
let authData = '';

 // get scroll Y position and show up the division when meet the position//
 window.addEventListener('scroll', function(){
    const currentposition = window.scrollY

    // target requirement division //
    const slideUpDivision = document.getElementById('slideUpDiv');
    const triggerPosition = 200

    // target how to apply division //
    const slideUpDivision1 = document.getElementById('slideUpDiv1');
    const triggerPosition1 = 300
    

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
 })
</script>

<svelte:head>
  <title>Job Details | Next Jobs</title>
</svelte:head>

<style>
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
  animation: slideUp 2s ease forwards;
}

.slide-up2 {
  animation: slideUp 5s ease forwards;
}

.slide-up3 {
  animation: slideUp 6s ease forwards;
}

.slide-up4 {
  animation: slideUp 9s ease forwards;
}

.body{
  height: 1800px;
}

footer, .job-title, .job-type{
  background-color: #20333a;
}

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
    <h1 class="text-3xl font-extrabold job-title p-4 text-white w-96 rounded-lg capitalize">{data.job.title}</h1>
    <p class="text-xl">{data.job.employer}</p>
 
    <div class="flex flex-row w-full mt-8">
        <div class="basis-2/3 prose max-w-none w-full">
          <div class="slide-up">
            <h2 class="text-xl font-semibold mb-2 text-black">Description</h2>
            <p class="border border-pink-600 mb-4"></p>
            <div class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl"> 
              <SvelteMarkdown source={data.job.description} />
            </div>
          </div>

            <div class="mt-6" />
          <div id="slideUpDiv" class="slide-up">
            <h2 class="text-xl font-semibold text-black mb-2">Requirements</h2>
            <p class="border border-pink-600 mb-4"></p>
            <div class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl">
              <SvelteMarkdown source={data.job.requirements} />
            </div>
          </div>

            <div class="mt-6" />
          <div id="slideUpDiv1" class="slide-up2">
            <h2 class="text-xl font-semibold text-black mb-2">How to Apply?</h2>
            <p class="border border-pink-600 mb-4"></p>
            <div class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl">
              <p>{data.job.applicationInstructions}</p>
            </div>
          </div>
        </div>

        <div class="basis-1/3 ml-4">
          <div class="slide-up2">
            <h2 class="text-xl font-semibold mb-2">Location</h2>
            <p class="border border-orange-400 mb-4"></p>
            <p class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl">{data.job.location}</p>
          </div>

            <div class="mt-6" />

          <div class="slide-up3">
            <h2 class="text-xl font-semibold mb-2">Salary Range</h2>
            <p class="border border-orange-400 mb-4"></p>
            <p class="border rounded-lg p-4 bg-white border-slate-400 shadow-xl">
                USD {humanize.formatNumber(data.job.minAnnualCompensation)} - USD {humanize.formatNumber(
                    data.job.maxAnnualCompensation
                )}
            </p>
          </div>

          <div class="mt-6 "/>

          <div class="flex flex-row text-white text-lg slide-up4">
            {#if data.job.job_type.includes('Full Time')}
            <h2 class="rounded-lg p-2 job-type ml-2">Full Time</h2>
            {/if}
            {#if data.job.job_type.includes('Part Time') }
            <h2 class="rounded-lg p-2 job-type ml-2">Part Time</h2>
            {/if}
            {#if data.job.job_type.includes('Remote')}
            <h2 class="rounded-lg p-2 job-type ml-2">Remote</h2>
            {/if}
          </div>
        </div>
    </div>
</div>
</div>

 <footer class="w-full h-16 flex items-center text-gray-300 fill-gray-300">
    <svg xmlns="http://www.w3.org/2000/svg" class="p-2 w-12 h-12" stroke="current" viewBox="0 0 24 24" id="copyright"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M10.08 10.86c.05-.33.16-.62.3-.87s.34-.46.59-.62c.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29s-.4-.73-.7-1.01-.66-.5-1.08-.66-.88-.23-1.39-.23c-.65 0-1.22.11-1.7.34s-.88.53-1.2.92-.56.84-.71 1.36S8 11.29 8 11.87v.27c0 .58.08 1.12.23 1.64s.39.97.71 1.35.72.69 1.2.91c.48.22 1.05.34 1.7.34.47 0 .91-.08 1.32-.23s.77-.36 1.08-.63.56-.58.74-.94.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58s-.21.33-.36.46-.32.23-.52.3c-.19.07-.39.09-.6.1-.36-.01-.66-.08-.89-.23-.25-.16-.45-.37-.59-.62s-.25-.55-.3-.88-.08-.67-.08-1v-.27c0-.35.03-.68.08-1.01zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
    <span class="font-bold uppercase">next job</span>  
 </footer>


