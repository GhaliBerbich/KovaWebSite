<script lang="ts">
  import { onMount } from "svelte";

  interface Route {
    name: string;
    link: string;
    children?: Route[];
  }

  const routes: Route[] = [
    { name: "How it works", link: "#how" },
    { name: "Where people go", link: "#trending" },
    { name: "Features", link: "#features" },
  ];

  let scrolled = false;

  onMount(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 20;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });
</script>

<header>
  <nav
    class={`fixed top-0 left-0 right-0 z-200 flex items-center justify-between px-12 transition-[background,box-shadow,padding] duration-300
    ${scrolled ? "bg-gray-50/10 backdrop-blur-md shadow-sm py-3 backdrop-saturate-150" : "py-4"}`}
  >
    <div>
      <img
        src="/img/KovaLogo.png"
        alt="KOVA Logo"
        class="h-8.5 transition-[filter] duration-300"
      />
    </div>
    <ul class="flex gap-10 list-none m-0 p-0">
      {#each routes as route}
        <li>
          <a
            href={route.link}
            class="text-[0.85rem] tracking-[0.02em] no-underline font-medium transition-colors duration-200
              {scrolled
              ? 'text-gray-500 hover:text-green-600'
              : 'text-green-800 hover:text-green-600'}">{route.name}</a
          >
        </li>
      {/each}
    </ul>
    <button
      class="border-none px-6 py-2 font-sans font-bold rounded-full cursor-pointer transition-all duration-200 bg-green-500 text-white hover:shadow-green-200 hover:shadow-sm hover:-translate-y-px hover:bg-green-700"
    >
      Join Waitlist
    </button>
  </nav>
</header>
