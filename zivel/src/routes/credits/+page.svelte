<script>
	// Import komponenty particles.js
	import Particles from '$lib/components/particles.svelte';
	// Import prechodu (animace)
	import { navigateWithTransition } from '$lib/transitions';
</script>

<Particles />
<div class="flex items-center justify-center -mt-8 lg:-mt-4 min-h-screen">
	<div class="backdrop-blur-xs text-center text-white">
		<p class="text-shadow-glow font-Rubik mb-12 text-3xl lg:text-4xl font-bold">
			Poděkování a zdroje
		</p>
		<div class="text-shadow-glow font-Rubik mx-auto w-[400px] text-xl lg:w-[800px] space-y-6 leading-relaxed mb-12">
			<p>Hra <strong>Živel</strong> byla vyvinuta s pomocí následujících zdrojů:</p>
			
			<div>
				<strong>Grafika a design:</strong>
				<ul>
					<li>Particle efekty: particles.js - Vincent Garreau</li>
					<li>Herní elementy a Ui: Game-icons.net</li>
                    <li>Delapouite</li>
                    <li>Lorc</li>
                    <li>Skoll</li>
                    <li>Viscious Speed</li>
                    <li>Caro Asercion</li>
                    <li>sbed</li>
                    <li>Simon (aussiesim)</li>
                    <li>DarkZaitzev</li>
                    <li>Cathelineau</li>
                    <li>Quoting</li>
                    <li>Případně vlastní.</li>
				</ul>
			</div>
			
			<div>
				<strong>Speciální poděkování:</strong>
				<p>Všem Open Source komunitám a vývojářům, kteří přispěli k nástrojům použitým v tomto projektu.</p>
			</div>
		</div>
		
		<button
			class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-Rubik rounded-2xl border-white px-6 py-2 text-xl font-bold text-white duration-300 ease-in-out lg:text-2xl"
			on:click={() => navigateWithTransition('/', 'slide-left')}
		>
			Zpět na hlavní stránku
		</button>
	</div>
</div>