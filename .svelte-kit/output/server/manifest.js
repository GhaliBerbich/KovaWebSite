export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","img/.DS_Store","img/KovaLogo.png","img/destinations/Chicago.jpg","img/destinations/IU.jpg","img/destinations/Indy.jpg","img/destinations/UIUC.jpg","img/purdue-logo.png","img/steps/Page1.png","img/steps/Page2.png","img/steps/Page3.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BkM67V_q.js",app:"_app/immutable/entry/app.CcsenPjA.js",imports:["_app/immutable/entry/start.BkM67V_q.js","_app/immutable/chunks/BfSNgUI5.js","_app/immutable/chunks/D63p_Qfj.js","_app/immutable/chunks/B06AHl5Y.js","_app/immutable/entry/app.CcsenPjA.js","_app/immutable/chunks/CMV4wbxS.js","_app/immutable/chunks/D63p_Qfj.js","_app/immutable/chunks/CtAMYkuX.js","_app/immutable/chunks/B5ujvHPX.js","_app/immutable/chunks/D0_vGjKd.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/docs/privacy","/docs/tos"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
