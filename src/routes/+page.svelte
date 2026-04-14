<script lang="ts">
	import "./layout.css";
	import Globe from "../components/landing/Globe.svelte";
	import { fly, fade } from "svelte/transition";
	import { onMount } from "svelte";
	import { reveal } from "$lib/actions/reveal";
	import StarSvg from "$lib/assets/star.svg?raw";
	import type { MouseEventHandler } from "svelte/elements";

	let mounted = false;
	let activeStep = 0;
	let scrollProgress = 0;
	let howSection: HTMLElement;
	let heroSection: HTMLElement;
	let globeVisible = true;
	let waitlistSuccess = false;
	let waitlistError = "";
	let waitlistLoading = false;

	let waitlistEmail = "";

	let handleWaitlist: MouseEventHandler<HTMLButtonElement>;

	onMount(() => {
		mounted = true;

		const observer = new IntersectionObserver(
			([entry]) => {
				globeVisible = entry.isIntersecting;
			},
			{ threshold: 0 },
		);
		if (heroSection) observer.observe(heroSection);

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

		const RECAPTCHA_SITE_KEY = "REMOVED_RECAPTCHA_KEY";
		// const RECAPTCHA_SITE_KEY = "6LfCbaosAAAAAHK3c_cMWio4AvSdFbVn7Ykx27xi";
		const FUNCTION_URL = "127.0.0.1:8000";

		handleWaitlist = async (event: MouseEvent) => {
			event.preventDefault();
			waitlistError = "";
			waitlistLoading = true;

			let token: string;
			try {
				token = await new Promise((resolve, _) => {
					// @ts-ignore
					grecaptcha.ready(() => {
						// @ts-ignore
						grecaptcha.enterprise
							.execute(RECAPTCHA_SITE_KEY, { action: "waitlist" })
							.then(resolve)
							.catch((e: any) => console.log(e));
					});
				});
			} catch (e: any) {
				waitlistError = "reCAPTCHA failed. Please try again.";
				waitlistLoading = false;
				console.log(e);
				return;
			}

			try {
				const res = await fetch(FUNCTION_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ waitlistEmail, recaptchaToken: token }),
				});
				const data = await res.json();
				if (!res.ok) {
					waitlistError = data.error ?? "Something went wrong.";
				} else {
					waitlistSuccess = true;
					// @ts-ignore
					confetti({ size: 1, count: 80 });
				}
			} catch {
				waitlistError = "Something went wrong. Please try again.";
			}

			waitlistLoading = false;
		};

		return () => {
			window.removeEventListener("scroll", onScroll);
			observer.disconnect();
		};
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
			name: "Find your ride",
			description:
				"List a ride you're taking or find one going your way. Filter by date, destination, and price — all from verified Boilermakers.",
		},
		{
			number: "2",
			name: "Ride with mutuals",
			description:
				"Review profiles, message your co-riders, and confirm your seat. No strangers — just fellow students with a shared destination.",
		},
		{
			number: "3",
			name: "Make new friends",
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

	const reviews: Review[] = [
		{
			name: "Marcus T.",
			profession: "Purdue Student",
			rating: 5,
			review:
				"Needed a ride to O'Hare for winter break and KOVA was half the price of Uber. My driver was another Purdue student so the conversation was great the whole way there.",
		},
		{
			name: "Priya N.",
			profession: "Purdue Student",
			rating: 5,
			review:
				"Booked a ride to Midway the night before and it was totally seamless. Love that it's a fellow student driving! Felt way more comfortable than a random stranger. Super affordable too.",
		},
		{
			name: "Jordan W.",
			profession: "Purdue Undergraduate Researcher",
			rating: 4,
			review:
				"Used KOVA to get to Indianapolis airport for a conference. Way cheaper than any other option and my driver was a grad student heading back anyway. Felt like carpooling with a friend.",
		},
		{
			name: "Aisha K.",
			profession: "Purdue Student",
			rating: 5,
			review:
				"Going home for Thanksgiving was so much less stressful with KOVA. No surge pricing, no sketchy drivers, just another student making the same trip. Exactly what campus needed.",
		},
		{
			name: "Derek M.",
			profession: "Purdue Graduate Student",
			rating: 4,
			review:
				"As an out-of-state student, airport rides were always a nightmare to figure out. KOVA makes it easy and the fact that it's students driving students makes a real difference. Reliable every time.",
		},
	];

	interface Destination {
		origin: string;
		destination: string;
		imgSrc: string;
	}

	const destinations: Destination[] = [
		{
			origin: "Purdue University",
			destination: "Chicago",
			imgSrc: "/img/destinations/Chicago.jpg",
		},
		{
			origin: "Purdue University",
			destination: "Indianapolis",
			imgSrc: "/img/destinations/Indy.jpg",
		},
		{
			origin: "Purdue University",
			destination: "University of Illinois Urbana-Champaign",
			imgSrc: "/img/destinations/UIUC.jpg",
		},
		{
			origin: "Purdue University",
			destination: "Indiana University Bloomington",
			imgSrc: "/img/destinations/IU.jpg",
		},
	];
</script>

<main class="w-screen max-w-[100vw] overflox-x-clip">
	<!-- HERO SECTION -->
	<section
		class="lg:h-[85vh] flex shrink-0 lg:flex-row px-12 lg:pl-12 bg-linear-to-br to-green-200 from-white via-white relative flex-col py-32 overflow-y-hidden h-full gap-10 sm:gap-0 overflow-x-clip"
		id="hero"
		bind:this={heroSection}
	>
		<!-- HERO LEFT -->
		<div
			class="w-full lg:w-1/2 flex flex-col justify-center content-center h-full gap-5 z-10 pr-5"
		>
			{#if mounted}
				<!-- PILL -->
				<div
					in:fly={{ y: 20, duration: 500, delay: 0 }}
					class="inline-flex flex-row content-center w-fit gap-4 items-center bg-green-200/25 px-4 sm:px-8 py-2 sm:py-0.5 rounded-full ring-emerald-200 ring-1 text-md select-none text-xs sm:text-base"
				>
					<div class="relative z-10">
						<span
							class="w-1.5 h-1.5 sm:w-2 sm:h-2 block rounded-full bg-emerald-400 z-10"
						></span>
						<span
							class="w-3 h-3 top-1/2 left-1/2 -translate-1/2 absolute block rounded-full bg-emerald-200 -z-10 animate-ping"
						></span>
					</div>
					<span class="font-light text-green-800">Purdue - West Lafayette</span>
				</div>

				<!-- HERO TEXT -->
				<h1
					in:fly={{ y: 30, duration: 600, delay: 100 }}
					class="text-5xl sm:text-7xl md:text-8xl font-black"
				>
					Stop missing <br />
					<span
						class="text-green-500 text-shadow-[0_0_2px_rgb(0, 201, 80.5)] text-shadow-green-200"
						>out.</span
					>
				</h1>
				<div
					in:fly={{ y: 20, duration: 500, delay: 200 }}
					class="text-xl sm:text-2xl md:text-3xl text-green-700 font-light"
				>
					Your world just got bigger
				</div>
				<p
					in:fade={{ duration: 500, delay: 350 }}
					class="md:text-lg font-light sm:text-justify sm:text-md text-sm text-left"
				>
					KOVA connects verified Boilermakers to shared rides – airport runs,
					Indy games, Chicago weekends, concerts, career trips, and everyday
					errands. Cheaper, safer, more human.
				</p>

				<!-- CTA BUTTONS -->
				<div
					in:fly={{ y: 20, duration: 500, delay: 450 }}
					class="flex md:flex-row gap-2 sm:gap-10 lg:pr-30 text-xs sm:text-sm md:text-base flex-col"
				>
					<a
						class="bg-green-500 text-gray-50 shadow-md shadow-green-200 px-8 py-2 group rounded-lg hover:cursor-pointer h-fit w-full flex justify-center items-center content-center"
						href="https://apps.apple.com/us/app/ridekova/id6757269118"
					>
						<div
							class="overflow-hidden bg-linear-to-r from-gray-200 via-white to-gray-200 text-white/0 bg-clip-text animate-shine group-hover:text-white group-hover:text-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-colors duration-200 ease-in-out w-full text-center"
						>
							Download App
						</div>
					</a>
					<button
						onclick={() =>
							document
								.getElementById("how")
								?.scrollIntoView({ behavior: "smooth" })}
						class="flex flex-row bg-transparent text-gray-900 shadow-md shadow-green-200 px-8 py-2 group rounded-lg ring-green-500 ring-2 hover:bg-green-500/10 hover:text-green-700 transition-colors ease-in-out duration-200 hover:cursor-pointer h-fit w-full items-center justify-center content-center text-xs sm:text-sm md:text-base"
						>See How It Works
						<!-- Arrow SVG -->
						<span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="sm:size-6 size-4"
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

		{#if mounted && globeVisible}
			<div
				class="w-full lg:w-1/2 h-full overflow-hidden flex items-center justify-center content-center"
				in:fly={{ y: 100, duration: 2500, delay: 1000 }}
			>
				<div
					class="w-full h-[50vh] md:h-[50vh] lg:h-full block absolute top-1/2 -translate-y-1/2 md:static opacity-25 left-0 md:opacity-80 md:top-auto md:left-auto md:z-10 md:translate-0 cursor-grab active:cursor-grabbing pointer-events-none lg:pointer-events-auto"
				>
					<Globe />
				</div>
			</div>
		{/if}
	</section>

	<section
		class="flex md:flex-row w-full flex-1 py-5 px-12 to-green-200 from-white via-white bg-linear-to-tr gap-12 flex-col"
	>
		<div class="w-full gap-5 flex-col flex">
			<div use:reveal class="deco-text">
				<span class="deco-line" aria-hidden={true}></span>
				<p>The Problem</p>
			</div>
			<h2
				use:reveal={{ y: 30, delay: 100 }}
				class="sm:text-5xl font-black text-3xl"
			>
				Transportation is access. <br /> And access is
				<span class="text-green-500">unequal.</span>
			</h2>
			<p
				use:reveal={{ delay: 200 }}
				class="text-neutral-500 sm:text-lg font-light text-base"
			>
				Without a car, students regularly say no — to experiences, connections,
				and opportunities that shape college life.
			</p>
		</div>
		<ul class="w-full flex-col flex gap-3 justify-center">
			{#each painList as pain, i}
				<li
					use:reveal={{ delay: i * 100 }}
					class="rounded-2xl px-6 py-6 relative group"
				>
					<span
						class="w-6 h-6 inline-block top-1/2 left-1 -translate-y-1/2 bg-white rounded-full ring-4 ring-inset ring-green-600 absolute z-10"
					></span>
					<div class="pl-6">
						<!-- <span class="mr-2">{pain.icon}</span> -->
						<span class="text-md font-semibold">{pain.name}</span>
						<p class="font-light text-neutral-600">{pain.description}</p>
					</div>
					<span
						class="w-3 h-[calc(100%+1rem)] md:h-[calc(100%+1.3rem)] lg:h-[calc(100%+1.3rem)] group-last:hidden inline-block top-1/2 left-2.5 bg-green-600 absolute"
					></span>
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
			<h2
				use:reveal={{ y: 30, delay: 100 }}
				class="md:text-5xl font-black text-4xl"
			>
				Ride sharing built for <span class="text-green-500 italic"
					>student trust.</span
				>
			</h2>
			<p use:reveal={{ delay: 200 }} class="font-light text-neutral-500 mt-3">
				Three steps from wanting to go somewhere, to actually going.
			</p>
		</div>

		<!-- Sticky grid -->
		<div
			class="relative grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto px-12 gap-16 py-24 md:py-48 overflow-x-clip"
		>
			<!-- Progress bar on far left of grid -->
			<div
				class="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-100 rounded-full hidden md:block"
			>
				<div
					class="w-full bg-green-500 rounded-full transition-all duration-400 ease-in-out"
					style="height: {scrollProgress * 100}%"
				></div>
			</div>

			<!-- Left: sticky phone -->
			<div
				class="self-start items-center justify-center md:sticky md:flex hidden"
				style="top:calc(50vh - 280px)"
			>
				<div class="relative">
					<!-- Glow -->
					<div
						class="absolute rounded-full -z-10 pointer-events-none"
						style="inset:-40px; background:radial-gradient(circle, rgba(45,184,75,0.15) 0%, transparent 65%)"
					></div>
					<!-- Shell -->
					<div
						class="relative bg-[#1a1a1a] rounded-[44px] overflow-hidden scale-75 md:scale-100 origin-top"
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
									style="opacity:{i === activeStep ? 1 : 0};
										: 0.96}); pointer-events:{i === activeStep ? 'auto' : 'none'}"
								>
									<img
										src={`/img/steps/Page${i + 1}.png`}
										class="w-full h-full absolute top-0 left-0"
										alt=""
									/>
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

	<section class="bg-green-50 px-12 py-24" id="trending">
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
			class="md:grid md:grid-cols-2 auto-rows-[20em] gap-4 mt-8 flex-col flex flex-1"
		>
			{#each destinations as destination, i}
				<!-- <div -->
				<!-- 	class={`bg-gray-200 rounded-xl animate-pulse ${i === 0 ? "md:row-span-2" : ""} ${i === 3 ? "md:col-span-1" : ""} w-full h-30 md:w-auto md:h-auto`} -->
				<!-- 	style="animation-delay: {i * 150}ms" -->
				<!-- ></div> -->
				<div
					class="relative overflow-clip rounded-2xl shadow-sm group cursor-pointer md:h-auto md:w-auto w-full h-50"
				>
					<div
						style={`background-image:url(${destination.imgSrc})`}
						class="w-full h-full block bg-cover bg-center bg-no-repeat absolute after:bg-black/0 after:w-full after:h-full after:block after:absolute after:top-0 after:left-0 group-hover:scale-105 transition-transform duration-500 scale-100"
					></div>
					<div
						class="z-10 absolute text-lg text-green-700 bottom-0 left-0 px-10 py-5 w-full font-bold backdrop-blur-3xl bg-white/90 rounded-b-2xl overflow-hidden"
					>
						<span class="text-xl align-middle">{destination.origin}</span>
						<span class="text-green-900 mx-2 inline w-auto h-auto">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="3"
								stroke="currentColor"
								class="size-5 inline align-middle"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H0.1"
								/>
							</svg>
						</span>
						<span class="text-xl align-middle">{destination.destination}</span>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section
		class="px-12 flex flex-col justify-center items-center content-center bg-linear-to-b from-green-50 via-gray-50 to-green-50 md:py-48"
		id="reviews"
	>
		<div class="deco-text px-12">
			<span class="deco-line"></span>
			<p>What Students Say</p>
		</div>

		<h1 class="text-5xl font-black">
			Real rides, <span class="text-green-500">real connections.</span>
		</h1>
		<div class="flex flex-col lg:flex-row gap-5 mt-12">
			{#each reviews as review}
				<div
					class="bg-white flex flex-col shadow-md rounded-2xl px-8 py-10 min-h-min flex-1 gap-5 justify-between content-between text-sm sm:text-base"
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
			<!-- Your world gets bigger when you're not moving alone. -->
			Not on iOS or at Purdue?
			<br /><span class="text-white">No Worries!</span>
		</h1>
		<div class="mt-10 md:mt-0">
			{#if waitlistSuccess}
				<p class="text-white font-semibold text-lg">
					You're on the list! We'll be in touch.
				</p>
			{:else}
				<form>
					<div
						class="flex flex-row rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-green-400 transition-all ring-2 ring-white/0 ease-in-out duration-150 flex-1"
					>
						<input
							type="email"
							name="email"
							placeholder="name@purdue.edu"
							bind:value={waitlistEmail}
							required
							class="placeholder-neutral-500 bg-white py-3 px-6 placeholder:font-extralight focus:outline-none md:min-w-2xs w-2/3 placeholder:text-sm text-sm md:text-base md:placeholder:text-base"
						/>
						<button
							type="submit"
							disabled={waitlistLoading}
							onclick={handleWaitlist}
							class="bg-green-700 px-3 pr-4 text-white focus:outline-none cursor-pointer w-1/3 text-xs md:text-md disabled:opacity-60"
						>
							{waitlistLoading ? "..." : "Join Waitlist"}
						</button>
					</div>
					{#if waitlistError}
						<p class="text-red-200 text-sm mt-2 pl-4">{waitlistError}</p>
					{/if}
				</form>
			{/if}
			<span class="text-xs text-gray-200">
				This site is protected by reCAPTCHA and the Google
				<a
					href="https://policies.google.com/privacy"
					class="text-blue-200 underline hover:text-blue-800">Privacy Policy</a
				>
				and
				<a
					href="https://policies.google.com/terms"
					class="text-blue-200 underline hover:text-blue-800"
					>Terms of Service</a
				> apply.
			</span>
		</div>

		<div
			class="absolute w-100 h-100 bg-green-800/10 -z-10 left-[90%] top-[-20%] rounded-full"
		></div>
	</section>
</main>
