import { a as attr_class, e as ensure_array_like, b as attr, c as escape_html, h as head, d as derived } from "../../chunks/renderer.js";
/* empty css                  */
import { p as page } from "../../chunks/index2.js";
import "clsx";
const favicon = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='107'%20height='128'%20viewBox='0%200%20107%20128'%3e%3ctitle%3esvelte-logo%3c/title%3e%3cpath%20d='M94.157%2022.819c-10.4-14.885-30.94-19.297-45.792-9.835L22.282%2029.608A29.92%2029.92%200%200%200%208.764%2049.65a31.5%2031.5%200%200%200%203.108%2020.231%2030%2030%200%200%200-4.477%2011.183%2031.9%2031.9%200%200%200%205.448%2024.116c10.402%2014.887%2030.942%2019.297%2045.791%209.835l26.083-16.624A29.92%2029.92%200%200%200%2098.235%2078.35a31.53%2031.53%200%200%200-3.105-20.232%2030%2030%200%200%200%204.474-11.182%2031.88%2031.88%200%200%200-5.447-24.116'%20style='fill:%23ff3e00'/%3e%3cpath%20d='M45.817%20106.582a20.72%2020.72%200%200%201-22.237-8.243%2019.17%2019.17%200%200%201-3.277-14.503%2018%2018%200%200%201%20.624-2.435l.49-1.498%201.337.981a33.6%2033.6%200%200%200%2010.203%205.098l.97.294-.09.968a5.85%205.85%200%200%200%201.052%203.878%206.24%206.24%200%200%200%206.695%202.485%205.8%205.8%200%200%200%201.603-.704L69.27%2076.28a5.43%205.43%200%200%200%202.45-3.631%205.8%205.8%200%200%200-.987-4.371%206.24%206.24%200%200%200-6.698-2.487%205.7%205.7%200%200%200-1.6.704l-9.953%206.345a19%2019%200%200%201-5.296%202.326%2020.72%2020.72%200%200%201-22.237-8.243%2019.17%2019.17%200%200%201-3.277-14.502%2017.99%2017.99%200%200%201%208.13-12.052l26.081-16.623a19%2019%200%200%201%205.3-2.329%2020.72%2020.72%200%200%201%2022.237%208.243%2019.17%2019.17%200%200%201%203.277%2014.503%2018%2018%200%200%201-.624%202.435l-.49%201.498-1.337-.98a33.6%2033.6%200%200%200-10.203-5.1l-.97-.294.09-.968a5.86%205.86%200%200%200-1.052-3.878%206.24%206.24%200%200%200-6.696-2.485%205.8%205.8%200%200%200-1.602.704L37.73%2051.72a5.42%205.42%200%200%200-2.449%203.63%205.79%205.79%200%200%200%20.986%204.372%206.24%206.24%200%200%200%206.698%202.486%205.8%205.8%200%200%200%201.602-.704l9.952-6.342a19%2019%200%200%201%205.295-2.328%2020.72%2020.72%200%200%201%2022.237%208.242%2019.17%2019.17%200%200%201%203.277%2014.503%2018%2018%200%200%201-8.13%2012.053l-26.081%2016.622a19%2019%200%200%201-5.3%202.328'%20style='fill:%23fff'/%3e%3c/svg%3e";
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const routes = [
      { name: "How it works", link: "#how" },
      { name: "Where people go", link: "#trending" },
      { name: "Reviews", link: "#reviews" }
    ];
    $$renderer2.push(`<header${attr_class(
      `fixed z-50 flex items-center justify-between px-5 py-3 transition-all duration-300
    top-4 left-4 right-4
    md:top-0 md:left-0 md:right-0 md:rounded-none md:px-10 md:py-4`,
      "svelte-ks4mo4"
    )}><div${attr_class(`absolute inset-0 rounded-sm md:rounded-none transition-all duration-250 ${"bg-transparent"} ${""}`, "svelte-ks4mo4")}></div> <a class="relative z-10" href="/"><img src="/img/KovaLogo.png" alt="KOVA Logo" class="h-8.5"/></a> <nav class="relative z-10 hidden md:flex items-center gap-8"><ul class="flex items-center gap-8 list-none m-0 p-0"><!--[-->`);
    const each_array = ensure_array_like(routes);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let route = each_array[$$index];
      $$renderer2.push(`<li><a${attr("href", route.link)}${attr_class(`text-lg tracking-wide no-underline font-medium transition-colors duration-300 hover:text-green-500 ${"text-green-900"}`, "svelte-ks4mo4")}>${escape_html(route.name)}</a></li>`);
    }
    $$renderer2.push(`<!--]--></ul> <a class="border-none px-6 py-2 text-lg font-sans font-bold rounded-sm cursor-pointer transition-all duration-200 bg-green-500 text-white hover:shadow-green-200 hover:shadow-sm hover:bg-green-700" href="https://apps.apple.com/us/app/ridekova/id6757269118" target="_blank">Download App</a></nav> <button aria-label="Toggle menu" class="relative z-10 md:hidden bg-green-100 p-3 rounded-sm h-10 w-10 flex flex-col justify-center items-center gap-0.5"><span${attr_class(`hamburguer-default transition-all duration-300 ${""}`, "svelte-ks4mo4")}></span> <span${attr_class(`hamburguer-default transition-all duration-300 ${""}`, "svelte-ks4mo4")}></span> <span${attr_class(`hamburguer-default transition-all duration-300 ${""}`, "svelte-ks4mo4")}></span></button></header> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<footer class="bg-green-50 pt-10 flex flex-col overflow-x-hidden w-screen max-w-[100vw]"><div class="flex flex-row justify-between px-12"><div><div><img src="/img/KovaLogo.png" alt="KOVA Logo" class="h-8 transition-[filter] duration-300"/> <p class="text-xs text-neutral-500 py-2">Access · Belonging · Mobility</p></div> <div class="flex md:flex-row gap-1 md:gap-5 text-green-600 underline text-sm md:text-base flex-col"><a href="https://www.instagram.com/ridekova/" target="_blank" class="hover:text-green-500">Instagram</a> <a href="/docs/privacy" class="hover:text-green-500">Privacy Policy</a> <a href="/docs/tos" class="hover:text-green-500">Terms of Service</a></div></div> <div class="text-xs text-neutral-400 text-end"><p>© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} KOVA Group, Inc</p> <p>West Lafayette, IN - Purdue University</p></div></div> <div class="mt-5 py-4 bg-green-50 px-12 text-sm">Built, with love at <img src="img/purdue-logo.png" alt="Purdue" class="h-[.9em] inline align-baseline mx-0.5"/></div></footer>`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    const noLayoutRoutes = ["/docs/tos", "/docs/privacy"];
    const showLayout = derived(() => !noLayoutRoutes.includes(page.url.pathname));
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<link rel="icon"${attr("href", favicon)}/> <link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/> <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&amp;display=swap" rel="stylesheet"/> `);
      $$renderer3.push(`<script src="https://cdn.jsdelivr.net/npm/@hiseb/confetti@2.1.0/dist/confetti.min.js"><\/script>`);
      $$renderer3.push(` `);
      $$renderer3.push(`<script src="https://www.google.com/recaptcha/api.js?render=6Lf_MqosAAAAAGKP2NwnCl77V7tX6oaCvgU7WRXS"><\/script>`);
    });
    if (showLayout()) {
      $$renderer2.push("<!--[0-->");
      Navbar($$renderer2);
      $$renderer2.push(`<!----> `);
      children($$renderer2);
      $$renderer2.push(`<!----> `);
      Footer($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _layout as default
};
