<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { navigateWithTransition } from '$lib/transitions';
    import Particles from '$lib/components/particles.svelte';
  
    let username = '';
    let loading = true;
  
    onMount(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        username = user.user_metadata.username || 'Uživatel';
      } else {
        navigateWithTransition('/login', 'slide-right');
      }
      loading = false;
    });
  
    async function handleLogout() {
      await supabase.auth.signOut();
      navigateWithTransition('/login', 'slide-right');
    }
  </script>
  
  <Particles />
  
  <div class="container mx-auto p-4 text-white items-center justify-center flex flex-col my-5 pt-10">
    {#if loading}
      <p class="text-2xl font-bold">Načítání...</p>
    {:else}
      <h1 class="text-4xl font-bold mb-8">Vítejte ve hře, <span class="text-white font-extrabold">{username}</span>!</h1>
      <p class="text-xl mb-8">Zde bude obsah vaší hry.</p>
      <button
        on:click={handleLogout}
        class="text-shadow-glow border bg-slate-950 transition hover:shadow-3xl hover:invert font-PTSerif rounded-2xl border-white px-3 py-1 text-xl font-bold text-white duration-300 ease-in-out lg:px-4 lg:py-2 lg:text-2xl"
      >
        Odhlásit se
      </button>
    {/if}
  </div>