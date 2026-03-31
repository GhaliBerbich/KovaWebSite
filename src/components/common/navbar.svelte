<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  interface Route {
    name: string;
    link: string;
    children?: Route[];
  }

  const routes: Route[] = [
    { name: "How it works", link: "#how" },
    { name: "Where people go", link: "#trending" },
    { name: "Reviews", link: "#reviews" },
  ];

  let scrolled = false;
  let menuOpen = false;

  onMount(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 20;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });
</script>

<header
  class={`fixed z-50 flex items-center justify-between px-5 py-3 transition-all duration-300
    top-4 left-4 right-4
    md:top-0 md:left-0 md:right-0 md:rounded-none md:px-10 md:py-4`}
>
  <!-- Background layers -->
  <div
    class={`absolute inset-0 rounded-sm md:rounded-none transition-all duration-250 ${scrolled ? "bg-white shadow-sm" : "bg-transparent"} ${menuOpen ? "shadow-none!" : ""}`}
  ></div>

  <!-- Logo -->
  <a class="relative z-10" href="/">
    <img src="/img/KovaLogo.png" alt="KOVA Logo" class="h-8.5" />
  </a>

  <!-- Desktop nav -->
  <nav class="relative z-10 hidden md:flex items-center gap-8">
    <ul class="flex items-center gap-8 list-none m-0 p-0">
      {#each routes as route}
        <li>
          <a
            href={route.link}
            class={`text-sm tracking-wide no-underline font-medium transition-colors duration-300 hover:text-green-500 ${scrolled ? "text-gray-700" : "text-green-900"}`}
            >{route.name}</a
          >
        </li>
      {/each}
    </ul>
    <button
      class="border-none px-6 py-2 font-sans font-bold rounded-sm cursor-pointer transition-all duration-200 bg-green-500 text-white hover:shadow-green-200 hover:shadow-sm hover:bg-green-700"
    >
      Download App
    </button>
  </nav>

  <button
    aria-label="Toggle menu"
    onclick={() => (menuOpen = !menuOpen)}
    class="relative z-10 md:hidden bg-green-100 p-3 rounded-sm h-10 w-10 flex flex-col justify-center items-center gap-0.5"
  >
    <span
      class={`hamburguer-default transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1" : ""}`}
    ></span>
    <span
      class={`hamburguer-default transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
    ></span>
    <span
      class={`hamburguer-default transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`}
    ></span>
  </button>
</header>

<!-- Mobile menu -->
{#if menuOpen}
  <div
    class="fixed inset-0 z-40 md:hidden"
    role="dialog"
    aria-modal="true"
    transition:fade={{ duration: 100 }}
  >
    <button
      class="absolute inset-0 bg-black/20 backdrop-blur-sm cursor-default"
      aria-label="Close menu"
      onclick={() => (menuOpen = false)}
    ></button>

    <nav
      class="absolute top-0 left-0 right-0 bg-white p-6 flex flex-col gap-4 h-screen w-screen pt-20 justify-between"
    >
      <ul class="flex flex-col gap-1 list-none m-0 p-0">
        {#each routes as route}
          <li class="not-last:border-b border-b-gray-200">
            <a
              href={route.link}
              onclick={() => (menuOpen = false)}
              class="block text-lg font-medium text-green-900 no-underline py-3 px-4 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
              >{route.name}</a
            >
          </li>
        {/each}
      </ul>
      <button
        class="w-full border-none px-6 py-3 font-sans font-bold rounded-sm cursor-pointer transition-all duration-200 bg-green-500 text-white hover:bg-green-700"
      >
        Download App
      </button>
    </nav>
  </div>
{/if}

<style>
  @import "tailwindcss";

  .hamburguer-default {
    @apply h-0.5 w-4 bg-green-800 block;
  }
</style>
