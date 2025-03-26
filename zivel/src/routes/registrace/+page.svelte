<script>
	import { navigateWithTransition } from '$lib/transitions';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import Particles from '$lib/components/particles.svelte';
	import Header from '$lib/components/Header.svelte';
	import { X } from 'lucide-svelte';
  
	let email = '';
	let password = '';
	let username = '';
	let error = '';
	let loading = false;
  
	async function checkExistingUser() {
	  const { data: emailExists } = await supabase
		.from('users')
		.select('email')
		.eq('email', email)
		.single();
  
	  const { data: usernameExists } = await supabase
		.from('users')
		.select('username')
		.eq('username', username)
		.single();
  
	  if (emailExists) {
		throw new Error('Tento e-mail je již zaregistrován.');
	  }
  
	  if (usernameExists) {
		throw new Error('Toto uživatelské jméno je již obsazené.');
	  }
	}
  
	async function handleSubmit() {
	  loading = true;
	  error = '';
  
	  try {
		await checkExistingUser();
  
		const { data, error: signUpError } = await supabase.auth.signUp({
		  email,
		  password,
		  options: {
			data: {
			  username: username
			}
		  }
		});
  
		if (signUpError) throw signUpError;
  
		if (data?.user) {
		  goto('/login');
		} else {
		  throw new Error('Neočekávaná chyba při registraci.');
		}
	  } catch (err) {
		error = err.message;
	  } finally {
		loading = false;
	  }
	}
  </script>
  
  <Particles />
  
  <div class="fixed inset-0 flex items-center justify-center p-4">
	<div class="bg-black bg-opacity-50 rounded-lg border border-white p-8 w-full max-w-md relative">
	  <button
		on:click={() => navigateWithTransition('/', 'slide-left')}
		class="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors"
	  >
		<X size={24} />
	  </button>
	  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div>
		  <label for="username" class="font-Rubik text-xl block mb-2 text-white">Uživatelské jméno:</label>
		  <input
			type="text"
			id="username"
			bind:value={username}
			required
			class="bg-white bg-opacity-65 border rounded-lg shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-primary w-full text-gray-800"
		  />
		</div>
		<div>
		  <label for="email" class="font-Rubik text-xl block mb-2 text-white">Email:</label>
		  <input
			type="email"
			id="email"
			bind:value={email}
			required
			class="bg-white bg-opacity-65 border rounded-lg shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-primary w-full text-gray-800"
		  />
		</div>
		<div>
		  <label for="password" class="font-Rubik text-xl block mb-2 text-white">Heslo:</label>
		  <input
			type="password"
			id="password"
			bind:value={password}
			required
			class="bg-white bg-opacity-65 border rounded-lg shadow-md p-2 focus:outline-none focus:ring-2 focus:ring-primary w-full text-gray-800"
		  />
		</div>
		<button
		  type="submit"
		  class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-Rubik mt-8 rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl w-full"
		  disabled={loading}
		>
		  {loading ? 'Registruji...' : 'Registrovat'}
		</button>
	  </form>
  
	  {#if error}
		<p class="error mt-4 p-3 bg-red-500 text-white rounded-lg text-center w-full">{error}</p>
	  {/if}
	</div>
  </div>