<script>
	import { navigateWithTransition } from '$lib/transitions';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import Particles from '$lib/components/particles.svelte';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleSubmit() {
		loading = true;
		error = '';

		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password
		});

		if (signUpError) {
			error = signUpError.message;
		} else if (data?.user) {
			// Úspěšná registrace
			alert('Registrace úspěšná! Prosím, zkontrolujte svůj email pro potvrzení účtu.');
			goto('/login');
		} else {
			error = 'Nastala neočekávaná chyba při registraci.';
		}

		loading = false;
	}
</script>

<Particles />

<div class="container mx-auto my-5 flex items-center justify-center p-4 pt-10 text-white">
	<form on:submit|preventDefault={handleSubmit}>
		<div class="pb-6">
			<label for="email" class="font-PTSerif pr-4 text-xl">Email:</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				class="bg-opacity-40 border focus:outline-none focus:ring-2 focus:ring rounded-lg bg-gray-800 bg-white p-2 shadow-md"
			/>
		</div>
		<div>
			<label for="password" class="font-PTSerif pr-4 text-xl">Heslo:</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				class="bg-opacity-40 border focus:outline-none focus:ring-2 focus:ring rounded-lg bg-gray-800 bg-white p-2 shadow-md"
			/>
		</div>
		<button
			type="submit"
			class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-PTSerif mt-16 rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl"
			disabled={loading}
		>
			{loading ? 'Registruji...' : 'Registrovat'}
		</button>
	</form>

	{#if error}
		<p class="error mt-4 text-red-500">{error}</p>
	{/if}

	<button
		class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-PTSerif mt-16 rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl"
		on:click={() => navigateWithTransition('/', 'slide-left')}
	>
		Zpět
	</button>
</div>
