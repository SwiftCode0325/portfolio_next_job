<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let progress = 0;
	let quotes = [
		'Your journey to success begins here!',
		'Embrace challenges and seize opportunities.',
		'Perseverance is the key to unlocking your dream job.',
		'Every step you take brings you closer to your career goals.'
	];
	let backgrounds = [
		'background-img1.png',
		'background-img2.png',
		'background-img3.png',
		'background-img4.png'
	];
	let currentQuote = quotes[0];
	let currentBgIndex = backgrounds[0];
	let quoteIndex = 0;
	let BgIndex = 0;
	let fadeIn = true; // To track the fade-in/fade-out state
	onMount(() => {
		// Simulate loading progress increment
		const interval = setInterval(() => {
			progress += 10; // Increment by 10 for smoother transitions
			if (progress === 100) {
				clearInterval(interval);
				// Navigate to the main homepage after loading
				goto('/Home');
			} else if (progress % 10 === 0) {
				if (fadeIn) {
					fadeIn = false;
					// Wait for 2 seconds before starting the fade-out animation
					setTimeout(() => {
						fadeIn = true;
						// Increment the quoteIndex to show the next quote
						quoteIndex = (quoteIndex + 1) % quotes.length;
						currentQuote = quotes[quoteIndex];
						// Increment the BgIndex to show the next background image
						BgIndex = (BgIndex + 1) % backgrounds.length;
						currentBgIndex = backgrounds[BgIndex];
					}, 3000);
				}
			}
		}, 2500);
	});
</script>

<div>
	<div
		class="h-screen bg-cover bg-no-repeat bg-top ease-in-out duration-1000 delay-500 md:bg-cover"
		style="background-image: url('{[currentBgIndex]}')"
	/>
	<div class="absolute inset-0 flex flex-col items-center justify-center mt-12">
		<div class="flex items-center">
			<h1 class="text-5xl text-gray-200 font-extrabold md:text-6xl">NEXT JOB</h1>
			<svg
				version="1.1"
				id="Capa_1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				width="60px"
				height="60px"
				viewBox="0 0 511.626 511.627"
				style="enable-background:new 0 0 511.626 511.627;"
				xml:space="preserve"
				class="fill-gray-200 ml-2"
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
		</div>
		<div class="w-80 bg-gray-200 rounded-full h-2.5 md:w-96 mt-2">
			<div class="w-80 bg-blue-600 h-2.5 rounded-full md:w-96" style="width: {progress}%" />
		</div>
		<!-- Use the fadeIn variable to control the fade-in/fade-out effect -->
		{#if currentQuote}
			<h2
				class="mt-2 text-gray-200 {fadeIn
					? 'opacity-100 transition-opacity delay-3500 duration-2500 ease-in'
					: 'opacity-0 transition-opacity delay-1000 duration-2000 ease-out'} text-base text-center mb-8 md:text-xl"
			>
				{currentQuote}
			</h2>
		{/if}
	</div>
</div>
