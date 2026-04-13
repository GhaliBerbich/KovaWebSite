import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.BXPJsngx.js","_app/immutable/chunks/B5ujvHPX.js","_app/immutable/chunks/D63p_Qfj.js","_app/immutable/chunks/D0_vGjKd.js","_app/immutable/chunks/Dnt0EXSy.js","_app/immutable/chunks/CtAMYkuX.js","_app/immutable/chunks/DC1_VCNO.js","_app/immutable/chunks/BfSNgUI5.js","_app/immutable/chunks/B06AHl5Y.js","_app/immutable/chunks/Dihszc61.js"];
export const stylesheets = ["_app/immutable/assets/index.Bd5r3lyG.css","_app/immutable/assets/0.D8ZEvI_9.css"];
export const fonts = [];
