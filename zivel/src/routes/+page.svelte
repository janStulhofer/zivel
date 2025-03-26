<script>
	// Import komponenty particles.js
	import Particles from '$lib/components/particles.svelte';
	// Import headeru
	import Header from '$lib/components/Header.svelte';
	// Import prechodu (animace)
	import { navigateWithTransition } from '$lib/transitions';
</script>

<Header />
<Particles />
<div class="flex items-center justify-center mt-8 lg:mt-16">
	<div class="backdrop-blur-xs text-center text-white">
		<p class="text-shadow-glow font-Rubik mb-12 text-3xl lg:text-4xl font-bold">
			Vítejte v laboratoři Dr. Zylasta
		</p>
		<p class="text-shadow-glow font-Rubik mx-auto w-[400px] text-xl lg:w-[800px] leading-relaxed mb-8">
			Temná chodba staré vědecké stanice skřípe pod vašimi kroky. 
			Právě jste přijali pozici asistenta šíleného génia, jehož experimenty
			překračují hranice vědy i rozumu. Vaším úkolem je tvořit, kombinovat a objevovat – od
			základních prvků až po zázraky, které by měly zůstat skryty.
		</p>
		<div class="text-shadow-glow font-Rubik mx-auto w-[400px] text-xl lg:w-[800px] space-y-4">
			<div>🔬 Až 480 unikátních prvků – od pravěkých základů po zakázané technologie</div>
			<div>🎨 Obchod s kosmetickými úpravami – přizpůsobte si svou alchymistickou dílnu</div>
			<div>🏆 Tabulka nejlepších hráčů – kdo dokáže vytvořit nejvíce zázraků?</div>
			<div>🤡 Vtipné úkoly – protože i šílení vědci potřebují zábavu</div>
			<div>📖 Poutavý příběh – temná cesta od elementů k… něčemu mimo lidské chápání</div>
			<div>📈 Leveling systém – čím více experimentujete, tím víc šílenství odemknete</div>
		</div>
		<button
			class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-Rubik mt-16 rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl"
			on:click={() => navigateWithTransition('/registrace', 'slide-right')}
		>
			ZAČÍT HRÁT
		</button>
	</div>
</div>