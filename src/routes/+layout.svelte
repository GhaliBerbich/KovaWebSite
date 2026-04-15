<script lang="ts">
	import "./layout.css";
	import { page } from "$app/state";
	import { PUBLIC_RECAPTCHA_SITE_KEY } from "$env/static/public";

	let { children } = $props();

	import Navbar from "$components/common/Navbar.svelte";
	import Footer from "$components/common/Footer.svelte";

	const noLayoutRoutes = ["/docs/tos", "/docs/privacy"];
	const showLayout = $derived(
		!noLayoutRoutes.includes(page.url.pathname),
	);
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/kova-logo.svg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin={""}
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
		rel="stylesheet"
	/>
	<script
		src="https://cdn.jsdelivr.net/npm/@hiseb/confetti@2.1.0/dist/confetti.min.js"
	></script>
	<script
		src={`https://www.google.com/recaptcha/enterprise.js?render=${PUBLIC_RECAPTCHA_SITE_KEY}`}
	></script>
</svelte:head>

{#if showLayout}
	<Navbar />
	{@render children()}
	<Footer />
{:else}
	{@render children()}
{/if}
