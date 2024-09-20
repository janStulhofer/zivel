<!-- src/routes/registrace/+page.svelte -->
<script>
	import { navigateWithTransition } from '$lib/transitions';
</script>

<div class="container mx-auto p-4">
	<button
		class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-PTSerif mt-16 rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl"
		on:click={() => navigateWithTransition('/', 'slide-right')}
	>
		Zpět
	</button>
</div>
