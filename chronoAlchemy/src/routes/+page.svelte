<script>
	// Import komponenty particles.js
	import Particles from '$lib/components/particles.svelte';
	// Import headeru
	import Header from '$lib/components/Header.svelte';
	// Import prechodu (animace)
	import { navigateWithTransition } from '$lib/transitions';
</script>

<Particles />
<Header />
<div class="mt-[5px] flex items-center justify-center lg:mt-[100px]">
	<div class=" backdrop-blur-xs my-auto text-center text-white">
		<p class="text-shadow-glow my-10 text-xl lg:text-2xl font-Rubik">
			Živel je webová videohra, zaměřená na kombinaci živlů, nebo ostatních různých prvků.
		</p>
		<p class="text-shadow-glow font-Rubik mx-auto w-[300px] text-xl lg:w-[600px]">
			Hru provází příběh, začnete na samotném počátku času, kde budete muset tvořit základní
			elementy, které vám pomůžou postupovat v dalším pokroku hrou. Čím více postupujete ve hře, tím
			víc možností se vám odemyká. Hra míří na logiku a zajímavé mixování elementů. Můžete porovnat
			vaše znalosti s ostatními a soutěžit, kdo je lepší.
		</p>
		<button
			class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-Rubik mt-16 rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl"
			on:click={() => navigateWithTransition('/registrace', 'slide-right')}
		>
			ZAČÍT HRÁT
		</button>
	</div>
</div>
