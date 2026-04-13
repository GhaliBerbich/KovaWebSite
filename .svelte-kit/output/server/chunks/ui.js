import { m as ssr_context } from "./utils2.js";
import "clsx";
import { w as writable } from "./index.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
let showLayout = writable(true);
export {
  onDestroy as o,
  showLayout as s
};
