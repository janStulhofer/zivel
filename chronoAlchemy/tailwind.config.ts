import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				grayMpBg: '#191C1F',	//Šedá na hlavní stránku
			},
			textShadow: {
				'glow': '0 0 10px rgba(255, 255, 255, 0.8)',
			},
		},
		fontFamily: {

		}
	},

	mode: 'jit', // just-in-time mod, rychlejší vykreslování CSS

	plugins: [
		function ({ addUtilities }) {
			const newUtilities = {
				'.text-shadow-glow': {
					'text-shadow': '0 0 10px rgba(255, 255, 255, 0.8)',
				},
			};
			addUtilities(newUtilities, ['responsive', 'hover']);
		}
	],

	
} as Config;
