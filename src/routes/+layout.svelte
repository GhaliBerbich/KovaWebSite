<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();

	import Navbar from "./../components/common/Navbar.svelte";
	import Footer from "./../components/common/Footer.svelte";
</script>

<Navbar />
<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin={""} />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
		rel="stylesheet"
	/>
	<script
		src="https://cdn.jsdelivr.net/npm/@hiseb/confetti@2.1.0/dist/confetti.min.js"
	></script>
</svelte:head>
{@render children()}
<Footer />
