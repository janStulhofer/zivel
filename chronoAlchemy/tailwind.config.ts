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
			boxShadow:{
				'3xl':'0 3px 50px 5px rgb(0 0 0 / 0.25)',
			},
			fontFamily: {
				PTSerif: ['PTSerif', 'PTSerif'],
			},
			fontSize:{
				
			},
			backdropBlur: {
				'xs': '2px',
			},
		},
	},

	mode: 'jit', // just-in-time mod, rychlejší vykreslování CSS

	plugins: [
		function ({ addUtilities }) {
			const newUtilities = {
				'.text-shadow-glow': {
					'text-shadow': '0 0 10px rgba(255, 255, 255, 0.8)',
				},
				'.text-shadow-glow-xl': {
					'text-shadow': '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.3)',
				},
			};
			addUtilities(newUtilities, ['responsive', 'hover']);
		}
	],

	
} as Config;
