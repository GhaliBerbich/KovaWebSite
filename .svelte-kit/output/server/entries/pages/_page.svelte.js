import { b as attr, e as ensure_array_like, c as escape_html, N as attr_style, a as attr_class, O as stringify } from "../../chunks/renderer.js";
/* empty css                  */
function html(value) {
  var html2 = String(value);
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const StarSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">\n  <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clip-rule="evenodd" />\n</svg>\n\n';
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeStep = 0;
    let scrollProgress = 0;
    let waitlistLoading = false;
    let waitlistEmail = "";
    const painList = [
      {
        name: "Airport Trips",
        icon: "✈️",
        description: "International students stranded over breaks with no affordable way home."
      },
      {
        name: "Events & Concerts",
        icon: "🎵",
        description: "Tickets bought, rides not. Plans cancelled at the last minute."
      },
      {
        name: "Career",
        icon: "💼 ",
        description: "Company visits, networking events, and fairs missed because no one had a car."
      }
    ];
    const steps = [
      {
        number: "1",
        name: "Find your ride",
        description: "List a ride you're taking or find one going your way. Filter by date, destination, and price — all from verified Boilermakers."
      },
      {
        number: "2",
        name: "Ride with mutuals",
        description: "Review profiles, message your co-riders, and confirm your seat. No strangers — just fellow students with a shared destination."
      },
      {
        number: "3",
        name: "Make new friends",
        description: "Show up, split the cost, and go. KOVA handles the coordination so you can focus on getting there."
      }
    ];
    const reviews = [
      {
        name: "Marcus T.",
        profession: "Purdue Student",
        rating: 5,
        review: "Needed a ride to O'Hare for winter break and KOVA was half the price of Uber. My driver was another Purdue student so the conversation was great the whole way there."
      },
      {
        name: "Priya N.",
        profession: "Purdue Student",
        rating: 5,
        review: "Booked a ride to Midway the night before and it was totally seamless. Love that it's a fellow student driving! Felt way more comfortable than a random stranger. Super affordable too."
      },
      {
        name: "Jordan W.",
        profession: "Purdue Undergraduate Researcher",
        rating: 4,
        review: "Used KOVA to get to Indianapolis airport for a conference. Way cheaper than any other option and my driver was a grad student heading back anyway. Felt like carpooling with a friend."
      },
      {
        name: "Aisha K.",
        profession: "Purdue Student",
        rating: 5,
        review: "Going home for Thanksgiving was so much less stressful with KOVA. No surge pricing, no sketchy drivers, just another student making the same trip. Exactly what campus needed."
      },
      {
        name: "Derek M.",
        profession: "Purdue Graduate Student",
        rating: 4,
        review: "As an out-of-state student, airport rides were always a nightmare to figure out. KOVA makes it easy and the fact that it's students driving students makes a real difference. Reliable every time."
      }
    ];
    const destinations = [
      {
        origin: "Purdue University",
        destination: "Chicago",
        imgSrc: "/img/destinations/Chicago.jpg"
      },
      {
        origin: "Purdue University",
        destination: "Indianapolis",
        imgSrc: "/img/destinations/Indy.jpg"
      },
      {
        origin: "Purdue University",
        destination: "University of Illinois Urbana-Champaign",
        imgSrc: "/img/destinations/UIUC.jpg"
      },
      {
        origin: "Purdue University",
        destination: "Indiana University Bloomington",
        imgSrc: "/img/destinations/IU.jpg"
      }
    ];
    $$renderer2.push(`<main class="w-screen max-w-[100vw] overflox-x-clip"><section class="lg:h-[85vh] flex shrink-0 lg:flex-row px-12 lg:pl-12 bg-linear-to-br to-green-200 from-white via-white relative flex-col py-32 overflow-y-hidden h-full gap-10 sm:gap-0 overflow-x-clip" id="hero"><div class="w-full lg:w-1/2 flex flex-col justify-center content-center h-full gap-5 z-10 pr-5">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> <section class="flex md:flex-row w-full flex-1 py-5 px-12 to-green-200 from-white via-white bg-linear-to-tr gap-12 flex-col"><div class="w-full gap-5 flex-col flex"><div class="deco-text"><span class="deco-line"${attr("aria-hidden", true)}></span> <p>The Problem</p></div> <h2 class="sm:text-5xl font-black text-3xl">Transportation is access. <br/> And access is <span class="text-green-500">unequal.</span></h2> <p class="text-neutral-500 sm:text-lg font-light text-base">Without a car, students regularly say no — to experiences, connections,
				and opportunities that shape college life.</p></div> <ul class="w-full flex-col flex gap-3 justify-center"><!--[-->`);
    const each_array = ensure_array_like(painList);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let pain = each_array[i];
      $$renderer2.push(`<li class="rounded-2xl px-6 py-6 relative group"><span class="w-6 h-6 inline-block top-1/2 left-1 -translate-y-1/2 bg-white rounded-full ring-4 ring-inset ring-green-600 absolute z-10"></span> <div class="pl-6"><span class="text-md font-semibold">${escape_html(pain.name)}</span> <p class="font-light text-neutral-600">${escape_html(pain.description)}</p></div> <span class="w-3 h-[calc(100%+1rem)] md:h-[calc(100%+1.3rem)] lg:h-[calc(100%+1.3rem)] group-last:hidden inline-block top-1/2 left-2.5 bg-green-600 absolute"></span></li>`);
    }
    $$renderer2.push(`<!--]--></ul></section> <section class="bg-white" id="how"><div class="text-center px-12 pt-24 pb-12"><div class="deco-text mb-5" style="justify-content:center"><span class="deco-line"></span> <p>How it works</p></div> <h2 class="md:text-5xl font-black text-4xl">Ride sharing built for <span class="text-green-500 italic">student trust.</span></h2> <p class="font-light text-neutral-500 mt-3">Three steps from wanting to go somewhere, to actually going.</p></div> <div class="relative grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto px-12 gap-16 py-24 md:py-48 overflow-x-clip"><div class="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-100 rounded-full hidden md:block"><div class="w-full bg-green-500 rounded-full transition-all duration-400 ease-in-out"${attr_style(`height: ${stringify(scrollProgress * 100)}%`)}></div></div> <div class="self-start items-center justify-center md:sticky md:flex hidden" style="top:calc(50vh - 280px)"><div class="relative"><div class="absolute rounded-full -z-10 pointer-events-none" style="inset:-40px; background:radial-gradient(circle, rgba(45,184,75,0.15) 0%, transparent 65%)"></div> <div class="relative bg-[#1a1a1a] rounded-[44px] overflow-hidden scale-75 md:scale-100 origin-top" style="width:250px; height:520px; border:2px solid #3a3a3a; box-shadow:0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.14), inset 0 0 0 2px #111; padding:14px 10px"><div class="w-full h-full rounded-[34px] overflow-hidden bg-[#111] relative"><div class="absolute left-1/2 -translate-x-1/2 bg-[#111] rounded-[20px] z-10" style="top:10px; width:90px; height:26px"></div> <!--[-->`);
    const each_array_1 = ensure_array_like(steps);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      each_array_1[i];
      $$renderer2.push(`<div class="absolute inset-0 transition-all duration-500 flex items-center justify-center"${attr_style(`opacity:${stringify(i === activeStep ? 1 : 0)}; : 0.96}); pointer-events:${stringify(i === activeStep ? "auto" : "none")}`)}><img${attr("src", `/img/steps/Page${i + 1}.png`)} class="w-full h-full absolute top-0 left-0" alt=""/></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div> <div class="flex flex-col py-8"><!--[-->`);
    const each_array_2 = ensure_array_like(steps);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let step = each_array_2[i];
      $$renderer2.push(`<div${attr_class("py-30 border-b border-gray-100 last:border-none cursor-pointer transition-opacity duration-300", void 0, { "opacity-[0.38]": i !== activeStep })} role="link"><div class="flex items-center gap-2 mb-4"><div${attr_class("w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors duration-300", void 0, {
        "bg-green-500": i === activeStep,
        "text-white": i === activeStep,
        "bg-green-50": i !== activeStep,
        "text-green-600": i !== activeStep
      })} style="border: 1.5px solid var(--color-green-500)">${escape_html(step.number)}</div> <span class="text-xs uppercase tracking-widest font-bold text-green-500">Step</span></div> <h3 class="text-[1.75rem] font-black leading-tight mb-3">${escape_html(step.name)}</h3> <p class="text-neutral-500 font-light leading-relaxed">${escape_html(step.description)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="bg-green-50 px-12 py-24" id="trending"><div class="flex flex-col justify-center items-center content-center"><div class="deco-text"><span class="deco-line"></span> <p>Where Boilermakers are going</p></div> <div class="flex flex-col items-center justify-center gap-2"><h1 class="text-5xl font-black">Trending Routes Right Now</h1> <p class="text-neutral-500">Real rides students are posting and joining this week.</p></div></div> <div id="trending_grid" class="md:grid md:grid-cols-2 auto-rows-[20em] gap-4 mt-8 flex-col flex flex-1"><!--[-->`);
    const each_array_3 = ensure_array_like(destinations);
    for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
      let destination = each_array_3[i];
      $$renderer2.push(`<div class="relative overflow-clip rounded-2xl shadow-sm group cursor-pointer md:h-auto md:w-auto w-full h-50"><div${attr_style(`background-image:url(${destination.imgSrc})`)} class="w-full h-full block bg-cover bg-center bg-no-repeat absolute after:bg-black/0 after:w-full after:h-full after:block after:absolute after:top-0 after:left-0 group-hover:scale-105 transition-transform duration-500 scale-100"></div> <div class="z-10 absolute text-lg text-green-700 bottom-0 left-0 px-10 py-5 w-full font-bold backdrop-blur-3xl bg-white/90 rounded-b-2xl overflow-hidden"><span class="text-xl align-middle">${escape_html(destination.origin)}</span> <span class="text-green-900 mx-2 inline w-auto h-auto"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-5 inline align-middle"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H0.1"></path></svg></span> <span class="text-xl align-middle">${escape_html(destination.destination)}</span></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="px-12 flex flex-col justify-center items-center content-center bg-linear-to-b from-green-50 via-gray-50 to-green-50 md:py-48" id="reviews"><div class="deco-text px-12"><span class="deco-line"></span> <p>What Students Say</p></div> <h1 class="text-5xl font-black">Real rides, <span class="text-green-500">real connections.</span></h1> <div class="flex flex-col lg:flex-row gap-5 mt-12"><!--[-->`);
    const each_array_4 = ensure_array_like(reviews);
    for (let $$index_5 = 0, $$length = each_array_4.length; $$index_5 < $$length; $$index_5++) {
      let review = each_array_4[$$index_5];
      $$renderer2.push(`<div class="bg-white flex flex-col shadow-md rounded-2xl px-8 py-10 min-h-min flex-1 gap-5 justify-between content-between text-sm sm:text-base"><div class="flex-col flex gap-4"><div class="flex gap-0.5"><!--[-->`);
      const each_array_5 = ensure_array_like(Array(5));
      for (let i = 0, $$length2 = each_array_5.length; i < $$length2; i++) {
        each_array_5[i];
        $$renderer2.push(`<span${attr_class(`${i < review.rating ? "text-green-800" : "text-gray-300"} text-xs`)}>${html(StarSvg)}</span>`);
      }
      $$renderer2.push(`<!--]--></div> <p class="font-light italic">"${escape_html(review.review)}"</p></div> <div class="flex flex-row justify-start items-center gap-5"><div class="bg-green-100 ring-2 ring-green-500 rounded-full w-8 h-8 flex justify-center items-center text-green-800 font-semibold shrink-0">${escape_html(review.name[0])}</div> <div class="font-light"><div>${escape_html(review.name)}</div> <div class="text-gray-500">${escape_html(review.profession)}</div></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="flex flex-col justify-center items-center content-center px-12 py-52 gap-5 bg-green-50"><div class="deco-text"><span class="deco-line"></span> <p>Our Mission</p></div> <h1 class="text-center text-5xl md:text-7xl font-black">Turn loneliness into <span class="text-green-500"><br/>connection.</span></h1> <p class="font-light text-neutral-700 text-lg md:max-w-1/3 text-center">KOVA is building the infrastructure that makes opportunity reachable by
			default — not by luck. Every empty seat is a chance for a student to say
			yes, show up, and belong faster.</p></section> <section class="bg-green-600 px-12 flex flex-col md:flex-row justify-between py-24 relative overflow-hidden z-0"><h1 class="text-white font-black text-4xl md:max-w-1/4">Not on iOS or at Purdue? <br/><span class="text-white">No Worries!</span></h1> <div class="mt-10 md:mt-0">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<form><div class="flex flex-row rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-green-400 transition-all ring-2 ring-white/0 ease-in-out duration-150 flex-1"><input type="email" name="email" placeholder="name@purdue.edu"${attr("value", waitlistEmail)} required="" class="placeholder-neutral-500 bg-white py-3 px-6 placeholder:font-extralight focus:outline-none md:min-w-2xs w-2/3 placeholder:text-sm text-sm md:text-base md:placeholder:text-base"/> <button type="submit"${attr("disabled", waitlistLoading, true)} class="bg-green-700 px-3 pr-4 text-white focus:outline-none cursor-pointer w-1/3 text-xs md:text-md disabled:opacity-60">${escape_html("Join Waitlist")}</button></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></form>`);
    }
    $$renderer2.push(`<!--]--> <span class="text-xs text-gray-200">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" class="text-blue-200 underline hover:text-blue-800">Privacy Policy</a> and <a href="https://policies.google.com/terms" class="text-blue-200 underline hover:text-blue-800">Terms of Service</a> apply.</span></div> <div class="absolute w-100 h-100 bg-green-800/10 -z-10 left-[90%] top-[-20%] rounded-full"></div></section></main>`);
  });
}
export {
  _page as default
};
