<script lang="ts">
	import "./layout.css";
	import Globe from "../components/landing/Globe.svelte";
	import { fly, fade } from "svelte/transition";
	import { onMount } from "svelte";
	import { reveal } from "$lib/actions/reveal";
	import StarSvg from "$lib/assets/star.svg?raw";

	let mounted = false;
	let activeStep = 0;
	let scrollProgress = 0;
	let howSection: HTMLElement;

	onMount(() => {
		mounted = true;

		function onScroll() {
			if (!howSection) return;
			const top = howSection.getBoundingClientRect().top;
			const scrollable = howSection.offsetHeight - window.innerHeight;
			scrollProgress = Math.max(0, Math.min(1, -top / scrollable));
			activeStep = Math.min(
				steps.length - 1,
				Math.floor(scrollProgress * steps.length),
			);
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	});

	interface Pain {
		name: string;
		icon: string | HTMLHtmlElement;
		description: string;
	}

	const painList: Pain[] = [
		{
			name: "Airport Trips",
			icon: "✈️",
			description:
				"International students stranded over breaks with no affordable way home.",
		},
		{
			name: "Events & Concerts",
			icon: "🎵",
			description:
				"Tickets bought, rides not. Plans cancelled at the last minute.",
		},
		{
			name: "Career",
			icon: "💼 ",
			description:
				"Company visits, networking events, and fairs missed because no one had a car.",
		},
	];

	interface Step {
		number: string;
		name: string;
		description: string;
	}

	const steps: Step[] = [
		{
			number: "1",
			name: "Post or Browse",
			description:
				"List a ride you're taking or find one going your way. Filter by date, destination, and price — all from verified Boilermakers.",
		},
		{
			number: "2",
			name: "Match & Connect",
			description:
				"Review profiles, message your co-riders, and confirm your seat. No strangers — just fellow students with a shared destination.",
		},
		{
			number: "3",
			name: "Ride & Split",
			description:
				"Show up, split the cost, and go. KOVA handles the coordination so you can focus on getting there.",
		},
	];

	interface Review {
		name: string;
		profession?: string;
		review: string;
		rating: 1 | 2 | 3 | 4 | 5;
	}

	// NOTE: Change to actual reviews
	const reviews: Review[] = [
		{
			name: "Hassan B.",
			profession: "Professional Wrestler",
			rating: 5,
			review:
				"Amazing app!!! consectetur culpa adipisicing est duis pariatur sit anim tempor reprehenderit reprehenderit ipsum qui ad Lorem cupidatat mollit Lorem aliqua esse",
		},
		{
			name: "Vicky M.",
			profession: "Professional Poster Designer",
			rating: 4,
			review:
				"Amazing app!!! consectetur culpa adipisicing est duis pariatur sit anim tempor reprehenderit reprehenderit ipsum qui ad Lorem cupidatat mollit Lorem aliqua esse",
		},
		{
			name: "Pedro T.",
			profession: "Unemployed",
			review:
				"Works! Minim exercitation labore voluptate eiusmod ea dolor non proident Lorem. Veniam consectetur aliqua pariatur magna magna ad. Aliquip fugiat labore non aliquip pariatur laborum aliquip occaecat nostrud. Est anim enim mollit qui eiusmod velit in voluptate quis adipisicing aliquip reprehenderit.",
			rating: 2,
		},
	];
</script>

<main class="overflow-x:clip">
	<section
		class="lg:h-[95vh] w-screen flex shrink-0 lg:flex-row px-12 lg:pl-12 bg-linear-to-br to-green-200 from-white via-white overflow-x-hidden flex-col py-32 overflow-y-hidden h-full"
		id="hero"
	>
		<!-- HERO LEFT -->
		<div
			class="w-full lg:w-1/2 flex flex-col justify-center content-center h-full gap-5"
		>
			{#if mounted}
				<!-- PILL -->
				<div
					in:fly={{ y: 20, duration: 500, delay: 0 }}
					class="inline-flex flex-row content-center w-fit gap-4 items-center bg-green-200/25 px-8 py-0.5 rounded-full ring-emerald-200 ring-1 text-md select-none"
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
				<h1
					in:fly={{ y: 30, duration: 600, delay: 100 }}
					class="text-7xl md:text-8xl font-black"
				>
					Stop missing <br />
					<span
						class="text-green-500 text-shadow-[0_0_2px_rgb(0, 201, 80.5)] text-shadow-green-200"
						>out.</span
					>
				</h1>
				<div
					in:fly={{ y: 20, duration: 500, delay: 200 }}
					class="text-2xl md:text-3xl text-green-700 font-light"
				>
					Your world just got bigger
				</div>
				<p
					in:fade={{ duration: 500, delay: 350 }}
					class="md:text-lg font-light text-justify text-md"
				>
					KOVA connects verified Boilermakers to shared rides – airport runs,
					Indy games, Chicago weekends, concerts, career trips, and everyday
					errands. Cheaper, safer, more human.
				</p>

				<!-- CTA BUTTONS -->
				<div
					in:fly={{ y: 20, duration: 500, delay: 450 }}
					class="flex flex-row gap-10 lg:pr-40 text-sm md:text-base"
				>
					<button
						class="bg-green-500 text-gray-50 shadow-md shadow-green-200 px-8 py-2 group rounded-full hover:cursor-pointer h-fit w-full"
						onclick={() => {
							console.log("Hey World");
							return null;
						}}
					>
						<span
							class="overflow-hidden bg-linear-to-r from-gray-200 via-white to-gray-200 text-white/0 bg-clip-text animate-shine group-hover:text-white group-hover:text-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-colors duration-200 ease-in-out"
						>
							Get Early Access
						</span>
					</button>
					<button
						onclick={() =>
							document
								.getElementById("how-it-works-interactive")
								?.scrollIntoView({ behavior: "smooth" })}
						class="flex flex-row bg-transparent text-gray-900 shadow-md shadow-green-200 px-8 py-2 group rounded-full ring-green-500 ring-2 hover:bg-green-500/10 hover:text-green-700 transition-colors ease-in-out duration-200 hover:cursor-pointer h-fit w-full items-center justify-center content-center"
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
			{/if}
		</div>

		<div class="w-full lg:w-1/2 h-full">
			{#if mounted}
				<div
					in:fly={{ y: 100, duration: 2500, delay: 1000 }}
					class="w-full h-[50vh] lg:h-full"
				>
					<Globe />
				</div>
			{/if}
		</div>
	</section>

	<section
		class="flex flex-row w-full flex-1 py-5 px-12 to-green-200 from-white via-white bg-linear-to-tr gap-12"
	>
		<div class="w-full gap-5 flex-col flex">
			<div use:reveal class="deco-text">
				<span class="deco-line" aria-hidden={true}></span>
				<p>The Problem</p>
			</div>
			<h2 use:reveal={{ y: 30, delay: 100 }} class="text-5xl font-black">
				Transportation is access. <br /> And access is
				<span class="text-green-500">unequal.</span>
			</h2>
			<p
				use:reveal={{ delay: 200 }}
				class="text-neutral-500 text-lg font-light"
			>
				Without a car, students regularly say no — to experiences, connections,
				and opportunities that shape college life.
			</p>
			<!-- <div -->
			<!-- 	use:reveal={{ delay: 300 }} -->
			<!-- 	class="bg-white border-l-4 border-l-green-500 px-8 pr-18 py-6 rounded-r-2xl shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)] w-fit" -->
			<!-- > -->
			<!-- 	<blockquote class="font-semibold text-lg"> -->
			<!-- 		When transportation is expensive, inconsistent, or isolating — "no" -->
			<!-- 		becomes the default. -->
			<!-- 	</blockquote> -->
			<!-- 	<cite class="text-sm text-green-600 not-italic font-extralight mt-5" -->
			<!-- 		>KOVA Research, 2024</cite -->
			<!-- 	> -->
			<!-- </div> -->
		</div>
		<ul class="w-full flex-col flex gap-3 justify-center">
			{#each painList as pain, i}
				<li
					use:reveal={{ delay: i * 100 }}
					class="rounded-2xl bg-white px-6 py-6 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)]"
				>
					<div>
						<span class="mr-2">{pain.icon}</span>
						<span class="text-md font-semibold">{pain.name}</span>
					</div>
					<p>{pain.description}</p>
				</li>
			{/each}
		</ul>
	</section>

	<section class="bg-white" id="how" bind:this={howSection}>
		<!-- Intro -->
		<div class="text-center px-12 pt-24 pb-12">
			<div use:reveal class="deco-text mb-5" style="justify-content:center">
				<span class="deco-line"></span>
				<p>How it works</p>
			</div>
			<h2 use:reveal={{ y: 30, delay: 100 }} class="text-5xl font-black">
				Ride sharing built for <span class="text-green-500 italic"
					>student trust.</span
				>
			</h2>
			<p use:reveal={{ delay: 200 }} class="font-light text-neutral-500 mt-3">
				Three steps from wanting to go somewhere, to actually going.
			</p>
		</div>

		<!-- Sticky grid -->
		<div class="relative grid grid-cols-2 max-w-5xl mx-auto px-12 gap-16 py-48">
			<!-- Progress bar on far left of grid -->
			<div
				class="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-100 rounded-full"
			>
				<div
					class="w-full bg-green-500 rounded-full transition-all duration-400 ease-in-out"
					style="height: {scrollProgress * 100}%"
				></div>
			</div>

			<!-- Left: sticky phone -->
			<div
				class="self-start flex items-center justify-center"
				style="position:sticky; top:calc(50vh - 280px); height:560px"
			>
				<div class="relative">
					<!-- Glow -->
					<div
						class="absolute rounded-full -z-10 pointer-events-none"
						style="inset:-40px; background:radial-gradient(circle, rgba(45,184,75,0.15) 0%, transparent 65%)"
					></div>
					<!-- Shell -->
					<div
						class="relative bg-[#1a1a1a] rounded-[44px] overflow-hidden"
						style="width:250px; height:520px; border:2px solid #3a3a3a; box-shadow:0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.14), inset 0 0 0 2px #111; padding:14px 10px"
					>
						<div
							class="w-full h-full rounded-[34px] overflow-hidden bg-[#111] relative"
						>
							<!-- Dynamic island -->
							<div
								class="absolute left-1/2 -translate-x-1/2 bg-[#111] rounded-[20px] z-10"
								style="top:10px; width:90px; height:26px"
							></div>
							<!-- Screens — swap placeholder divs for <img> tags per step -->
							{#each steps as _, i}
								<div
									class="absolute inset-0 transition-all duration-500 flex items-center justify-center"
									style="opacity:{i === activeStep
										? 1
										: 0}; transform:scale({i === activeStep
										? 1
										: 0.96}); pointer-events:{i === activeStep
										? 'auto'
										: 'none'}"
								>
									<span class="text-gray-600 text-sm select-none"
										>Screen {i + 1}</span
									>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Right: steps list -->
			<div class="flex flex-col py-8">
				{#each steps as step, i}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_interactive_supports_focus -->
					<div
						class="py-30 border-b border-gray-100 last:border-none cursor-pointer transition-opacity duration-300"
						class:opacity-[0.38]={i !== activeStep}
						onclick={() => (activeStep = i)}
						role="link"
					>
						<!-- Step tag -->
						<div class="flex items-center gap-2 mb-4">
							<div
								class="w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors duration-300"
								class:bg-green-500={i === activeStep}
								class:text-white={i === activeStep}
								class:bg-green-50={i !== activeStep}
								class:text-green-600={i !== activeStep}
								style="border: 1.5px solid var(--color-green-500)"
							>
								{step.number}
							</div>
							<span
								class="text-xs uppercase tracking-widest font-bold text-green-500"
								>Step</span
							>
						</div>
						<h3 class="text-[1.75rem] font-black leading-tight mb-3">
							{step.name}
						</h3>
						<p class="text-neutral-500 font-light leading-relaxed">
							{step.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-green-50 px-12 py-24">
		<div class="flex flex-col justify-center items-center content-center">
			<div class="deco-text">
				<span class="deco-line"></span>
				<p>Where Boilermakers are going</p>
			</div>
			<div class="flex flex-col items-center justify-center gap-2">
				<h1 class="text-5xl font-black">Trending Routes Right Now</h1>
				<p class="text-neutral-500">
					Real rides students are posting and joining this week.
				</p>
			</div>
		</div>

		<div
			id="trending_grid"
			class="grid grid-cols-3 auto-rows-[240px] gap-4 mt-8"
		>
			{#each Array(5) as _, i}
				<div
					class="bg-gray-200 rounded-xl animate-pulse"
					class:row-span-2={i === 0}
					class:col-span-1={i === 3}
					style="animation-delay: {i * 150}ms"
				></div>
			{/each}
		</div>
	</section>

	<section
		class="px-12 flex flex-col justify-center items-center content-center bg-gray-50 py-48"
	>
		<div class="deco-text px-12">
			<span class="deco-line"></span>
			<p>What Students Say</p>
		</div>

		<h1 class="text-5xl font-black">
			Real rides, <span class="text-green-500">real connections.</span>
		</h1>
		<div class="flex flex-col md:flex-row gap-5 mt-12">
			{#each reviews as review}
				<div
					class="bg-white flex flex-col shadow-md rounded-2xl px-8 py-10 min-h-min flex-1 gap-5 justify-between content-between"
				>
					<div class="flex-col flex gap-4">
						<div class="flex gap-0.5">
							{#each Array(5) as _, i}
								<span
									class={`${i < review.rating ? "text-green-800" : "text-gray-300"} text-xs`}
								>
									{@html StarSvg}
								</span>
							{/each}
						</div>
						<p class="font-light italic">
							"{review.review}"
						</p>
					</div>
					<div class="flex flex-row justify-start items-center gap-5">
						<div
							class="bg-green-100 ring-2 ring-green-500 rounded-full w-8 h-8 flex justify-center items-center text-green-800 font-semibold shrink-0"
						>
							{review.name[0]}
						</div>
						<div class="font-light">
							<div>
								{review.name}
							</div>
							<div class="text-gray-500">
								{review.profession}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section
		class="flex flex-col justify-center items-center content-center px-12 py-52 gap-5 bg-green-50"
	>
		<div class="deco-text">
			<span class="deco-line"></span>
			<p>Our Mission</p>
		</div>
		<h1 class="text-center text-5xl md:text-7xl font-black">
			Turn loneliness into
			<span class="text-green-500"><br />connection.</span>
		</h1>
		<p class="font-light text-neutral-700 text-lg md:max-w-1/3 text-center">
			KOVA is building the infrastructure that makes opportunity reachable by
			default — not by luck. Every empty seat is a chance for a student to say
			yes, show up, and belong faster.
		</p>
	</section>

	<section
		class="bg-green-600 px-12 flex flex-col md:flex-row justify-between py-24 relative overflow-hidden z-0"
	>
		<h1 class="text-white font-black text-4xl md:max-w-1/4">
			Your world gets bigger when you're not moving alone.
		</h1>
		<div class="mt-10 md:mt-0">
			<div
				class="flex flex-row rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-green-400 transition-all ring-2 ring-white/0 ease-in-out duration-150 flex-1"
			>
				<input
					type="text"
					placeholder="jdoe@purdue.edu"
					class="placeholder-neutral-500 bg-white py-3 px-6 placeholder:font-extralight focus:outline-none min-w-2xs w-2/3"
				/>
				<button
					type="button"
					class="bg-green-700 px-3 pr-4 text-white focus:outline-none cursor-pointer w-1/3"
					onclick={(event) => {
						//@ts-ignore
						confetti({
							position: { x: event.clientX, y: event.clientY },
							size: 0.8,
							count: 50,
						});
					}}>Join Waitlist</button
				>
			</div>
		</div>

		<div
			class="absolute w-100 h-100 bg-green-800/10 -z-10 left-[90%] top-[-20%] rounded-full"
		></div>
	</section>
</main>
