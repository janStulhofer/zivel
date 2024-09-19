<script>
	// Import komponenty particles.js
	import Particles from '$lib/components/particles.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<Particles />
<Header />
<div class="mt-[5px] lg:mt-[100px] flex items-center justify-center">
	<div class=" backdrop-blur-xs my-auto text-center text-white">
		<p class="text-shadow-glow font-PTSerif my-10 text-xl lg:text-2xl">
			Chrono Alchemy je webová videohra, zaměřená na kombinaci živlů, nebo ostatních různých prvků.
		</p>
		<p class="text-shadow-glow font-PTSerif mx-auto w-[300px] lg:w-[600px] text-xl">
			Hru provází příběh, začnete na samotném počátku času, kde budete muset tvořit základní
			elementy, které vám pomůžou postupovat v dalším pokroku hrou. Čím více postupujete ve hře, tím
			víc možností se vám odemyká. Hra míří na logiku a zajímavé mixování elementů. Můžete porovnat
			vaše znalosti s ostatními a soutěžit, kdo je lepší.
		</p>
		<button
			class="mt-16 text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-PTSerif font-bold rounded-2xl border-white px-3 py-1 text-xl text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl">
			ZAČÍT HRÁT
		</button>
	</div>
</div>
