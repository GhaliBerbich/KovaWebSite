<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { OrbitControls } from "three/examples/jsm/Addons.js";
  import countries from "$lib/globe/custom.geo_minified_2.json";

  let container: HTMLDivElement;
  let animationId: number;
  let sparkleInterval: ReturnType<typeof setInterval>;
  let resizeObserver: ResizeObserver;
  let isVisible = true;

  // HACK: Code Globe by hand and use Shader Language for performance.
  function initGlobe() {
    return new Promise<void>(async (resolve) => {
      const [{ default: ThreeGlobe }, THREE] = await Promise.all([
        import("three-globe"),
        import("three"),
      ]);

      const width = container.clientWidth;
      const height = container.clientHeight;

      // Renderer — no antialias (expensive), cap pixel ratio to 2
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff, 0);
      // Let CSS control the display size so the canvas shrinks with its container
      renderer.domElement.style.cssText =
        "display:block;width:100%;height:100%;";
      container.appendChild(renderer.domElement);

      // Scene & camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        100,
        width / height,
        0.1,
        1000,
      );
      // Scale camera distance so the globe fits on narrower containers.
      // Also compensates for narrow aspect ratios: as aspect shrinks, hFOV
      // shrinks proportionally, so we pull the camera back to avoid side-clipping.
      function updateCameraDistance(w: number, h: number) {
        const aspect = w / h;
        const sizeFactor = Math.max(0.8, Math.min(1.8, 1440 / w));
        // 0.78 / aspect ensures the globe stays inside the horizontal frustum
        const factor = Math.max(sizeFactor, 0.6 / aspect);
        camera.position.set(0, 30 * factor, 80 * factor);
      }
      updateCameraDistance(width, height);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = Math.PI / 3.5;
      controls.maxPolarAngle = Math.PI - Math.PI / 3;
      controls.autoRotate = true;
      controls.autoRotateSpeed = -0.1;

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 2));

      // Pre-compute sparkle params per feature (once — zero per-frame cost)
      // Each dot gets an independent sine phase + speed so they sparkle out of sync
      type SparkleParams = { phase: number; speed: number };
      const sparkle = new Map<object, SparkleParams>();
      for (const f of countries.features) {
        sparkle.set(f, {
          phase: Math.random() * Math.PI * 2,
          speed: 0.2 + Math.random() * 0.4, // 0.2–0.6 cycles/sec → period ~1.7–5s
        });
      }

      // Globe
      const colFunc = (feat: Object) => {
        const p = sparkle.get(feat as object);
        if (!p) return "#7BF1A8";
        const t = Date.now() / 1000;
        const hue = Math.round(
          148 + 73 * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase)),
        );
        // const l = Math.round(
        //   // 75 - 35 + 55 * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase)),
        // );
        return `hsl(${hue}, 97.1%, 40%)`;
      };

      const globe = new ThreeGlobe({
        waitForGlobeReady: false,
        animateIn: false,
      })
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(false)
        .hexPolygonAltitude(0)
        .hexPolygonColor((f) => colFunc(f));

      // Re-evaluate sparkle colors at ~2fps — new function ref each tick forces
      // three-globe to re-color the hex layer without rebuilding geometry
      sparkleInterval = setInterval(() => {
        globe.hexPolygonColor((f) => colFunc(f));
      }, 500);

      const globeMat = globe.globeMaterial();
      // @ts-ignore
      globeMat.color = new THREE.Color(0xfffffff);
      globeMat.transparent = true;
      globeMat.opacity = 0.75;

      scene.add(globe);

      function animate() {
        if (!isVisible) return;
        animationId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      // Pause rendering when the globe scrolls out of view
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) animate();
        },
        { threshold: 0 },
      );
      observer.observe(container);

      // ResizeObserver — fires whenever the container itself changes size
      let resizeTimer: ReturnType<typeof setTimeout>;
      resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (w === 0 || h === 0) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          updateCameraDistance(w, h);
        }, 100);
      });
      resizeObserver.observe(container);
    });
  }

  onMount(() => {
    initGlobe();
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (sparkleInterval) clearInterval(sparkleInterval);
    if (resizeObserver) resizeObserver.disconnect();
  });
</script>

<div bind:this={container} class="w-full h-full"></div>
