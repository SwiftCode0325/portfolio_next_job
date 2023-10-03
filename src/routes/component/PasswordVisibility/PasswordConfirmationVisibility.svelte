<script>

import { writable } from "svelte/store";

let showPasswordConfirmation = writable(true);

function togglePasswordConfirmationVisibility() {
	showPasswordConfirmation = !showPasswordConfirmation;
}

</script>


<!-- password-confirmation section -->
							<div>
								<span
									class="pb-1 block text-lg sm:text-sm font-medium text-gray-900 text-left"
									>Confirm Password</span
								>
								<div class="relative">
									<input
										type={showPasswordConfirmation ? 'password' : 'text'}
										name="password-confirmation"
										placeholder="••••••••"
										class="bg-white border border-gray-300 text-gray-900 text-lg sm:text-sm rounded-full focus:ring-pink-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
									
									<button type="button"
									on:click={togglePasswordConfirmationVisibility} class="absolute inset-y-0 top-1.3 sm:top-0.5 right-2.5">
										<svg
											class="fill-gray-300"
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
									</button>
								</div>
							</div>
