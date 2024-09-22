<script>
	import { navigateWithTransition } from '$lib/transitions';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import Particles from '$lib/components/particles.svelte';

let email = '';
let password = '';
let error = '';

async function handleSubmit() {
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    error = signUpError.message;
  } else {
    goto('/login');
  }
}
</script>

<Particles />

<div class="container mx-auto p-4 text-white items-center justify-center flex my-5 pt-10">
	<form on:submit|preventDefault={handleSubmit}>
		<div class="pb-6">
		  <label for="email">Email:</label>
		  <input type="email" id="email" bind:value={email} required />
		</div>
		<div>
		  <label for="password">Heslo:</label>
		  <input type="password" id="password" bind:value={password} required />
		</div>
		<button type="submit" class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-PTSerif mt-16 rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl"
		on:click={() => navigateWithTransition('#', 'slide-left')}
		>
	Registrovat
</button>
	  </form>
	  
	  {#if error}
		<p class="error">{error}</p>
	  {/if}



	<button
		class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-PTSerif mt-16 rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl"
		on:click={() => navigateWithTransition('/', 'slide-left')}
	>
		Zpět
	</button>
</div>
