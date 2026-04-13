
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/docs" | "/docs/privacy" | "/docs/tos";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/docs": Record<string, never>;
			"/docs/privacy": Record<string, never>;
			"/docs/tos": Record<string, never>
		};
		Pathname(): "/" | "/docs/privacy" | "/docs/tos";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/img/.DS_Store" | "/img/KovaLogo.png" | "/img/destinations/Chicago.jpg" | "/img/destinations/IU.jpg" | "/img/destinations/Indy.jpg" | "/img/destinations/UIUC.jpg" | "/img/purdue-logo.png" | "/img/steps/Page1.png" | "/img/steps/Page2.png" | "/img/steps/Page3.png" | "/robots.txt" | string & {};
	}
}