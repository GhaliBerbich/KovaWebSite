<script>
	import "./layout.css";
	import Globe from "../components/landing/Globe.svelte";
</script>

<main class="overflow-x-hidden">
	<section
		class="h-screen w-screen flex shrink-0 flex-row pl-12 bg-linear-to-br to-green-200 from-white via-green-50 overflow-x-hidden"
		id="hero"
	>
		<!-- HERO LEFT -->
		<div class="w-1/2 flex flex-col justify-center content-center h-full gap-5">
			<!-- PILL -->
			<div
				class="inline-flex flex-row content-center w-fit gap-4 items-center bg-green-200/25 px-8 py-0.5 rounded-full ring-emerald-200 ring-1 text-md"
			>
				<div class="relative z-10">
					<span class="w-2 h-2 block rounded-full bg-emerald-400 z-10"></span>
					<span
						class="w-3 h-3 top-1/2 left-1/2 -translate-1/2 absolute block rounded-full bg-emerald-200 -z-10 animate-ping"
					></span>
				</div>
				<span class="font-light text-green-800">Purdue - West Lafayette</span>
			</div>

			<!-- HERO TEXT -->
			<h1 class="text-7xl font-black">
				Stop missing <br />
				<span
					class="text-green-500 text-shadow-[0_0_2px_rgb(0, 201, 80.5)] text-shadow-green-200"
					>out.</span
				>
			</h1>
			<div class="text-3xl text-green-800 font-light">
				Your world just got bigger
			</div>
			<p class="text-lg font-light text-justify">
				KOVA connects verified Boilermakers to shared rides – airport runs, Indy
				games, Chicago weekends, concerts, career trips, and everyday errands.
				Cheaper, safer, more human.
			</p>

			<!-- CTA BUTTONS -->
			<div class="flex flex-row gap-10 pr-40">
				<button
					class="bg-green-500 text-gray-50 shadow-md shadow-green-200 px-8 py-2 group rounded-full hover:cursor-pointer h-fit w-full"
					onclick={() => {
						console.log("Hey World");
						return null;
					}}
				>
					<span
						class="overflow-hidden bg-linear-to-r from-gray-300 via-white to-gray-300 text-white/0 bg-clip-text animate-shine group-hover:text-white transition-colors duration-200 ease-in-out"
					>
						Get Early Access
					</span>
				</button>
				<button
					class="flex flex-row bg-transparent text-gray-900 shadow-md shadow-green-200 px-8 py-2 group rounded-full ring-green-500 ring-2 hover:bg-green-500 hover:text-gray-50 transition-colors ease-in-out duration-200 hover:cursor-pointer h-fit w-full items-center justify-center content-center"
					>See How It Works
					<!-- Arrow SVG -->
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
							/>
						</svg>
					</span>
				</button>
			</div>
		</div>

		<div class="w-1/2 h-full">
			<Globe />
		</div>
	</section>
	<section class="h-screen"></section>
</main>
