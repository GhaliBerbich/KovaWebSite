<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { OrbitControls } from "three/examples/jsm/Addons.js";
  import countries from "$lib/globe/custom.geo_minified_2.json";

  let container: HTMLDivElement;
  let animationId: number;

  onMount(async () => {
    const [{ default: ThreeGlobe }, THREE] = await Promise.all([
      import("three-globe"),
      import("three"),
    ]);

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement);

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
    camera.position.set(0, 80, 150);
    // Shift globe to the right by rendering the left portion of a wider frustum
    camera.setViewOffset(width * 1.8, height, 0, 0, width, height);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;
    controls.autoRotate = true;
    controls.autoRotateSpeed = -2;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    // const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    // dirLight.position.set(1, 1, 1);
    // scene.add(dirLight);

    // Globe
    const globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: true })
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.4)
      .hexPolygonAltitude(0.001)
      .showAtmosphere(true)
      .atmosphereColor("#96F7E4")
      .atmosphereAltitude(0.3)
      .hexPolygonAltitude(0.01)
      .hexPolygonColor(() => "#7BF1A8");

    const globeMat = globe.globeMaterial();
    globeMat.color = new THREE.Color(0x7c7c67);
    globeMat.transparent = true;
    globeMat.opacity = 0.75;

    scene.add(globe);

    function animate() {
      animationId = requestAnimationFrame(animate);
      controls.update();

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.setViewOffset(w * 1.8, h, 0, 0, w, h);

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
  });
</script>

<div bind:this={container} class="w-full h-full"></div>
