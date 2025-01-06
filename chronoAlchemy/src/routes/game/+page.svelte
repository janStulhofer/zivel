<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { navigateWithTransition } from '$lib/transitions';
  import { fade, fly } from 'svelte/transition';
  import Particles from '$lib/components/particles.svelte';
  
  const avatars = [
    '/assets/avatars/avatar.jpg',
    '/assets/avatars/avatar2.jpg',
    '/assets/avatars/avatar3.jpg',
    '/assets/avatars/avatar4.jpg',
    '/assets/avatars/avatar5.jpg',
    '/assets/avatars/avatar6.jpg',
    '/assets/avatars/avatar7.jpg',
    '/assets/avatars/avatar8.jpg'
  ];
  
  let username = '';
  let loading = true;
  let tutorialCompleted = false;
  let currentAvatarId = 0;
  let showAvatarSelection = true;
  
  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      username = user.user_metadata.username || 'Uživatel';
      const { data, error } = await supabase
        .from('user_profiles')
        .select('tutorial, avatar_id')
        .eq('id', user.id)
        .single();
      
      if (data) {
        tutorialCompleted = data.tutorial;
        currentAvatarId = data.avatar_id;
      }
    } else {
      navigateWithTransition('/login', 'slide-right');
    }
    loading = false;
  });
  
  async function handleLogout() {
    await supabase.auth.signOut();
    navigateWithTransition('/login', 'slide-right');
  }
  
  async function updateAvatar(newAvatarId: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ avatar_id: newAvatarId, tutorial: true }) 
      .eq('id', user.id);
    
    if (!error) {
      currentAvatarId = newAvatarId;
      tutorialCompleted = true;
      showAvatarSelection = false;
    } else {
      console.error('Error updating avatar:', error);
    }
  }
}
  
  function handleKeyDown(event: KeyboardEvent, avatarId: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      updateAvatar(avatarId);
    }
  }
  </script>
  
  <Particles />
  
  <div class="container mx-auto p-4 text-white items-center justify-center flex flex-col my-5 pt-10">
    {#if loading}
      <p class="text-2xl font-bold">Načítání...</p>
      <img src="/assets/loading2.gif" alt="nacitani">
    {:else}
      <h1 class="text-4xl font-bold mb-8">Vítejte ve hře, <span class="text-white font-extrabold">{username}</span>!</h1>
      
      {#if tutorialCompleted}
        <p class="text-xl mb-8">Vítejte zpět! Zde je váš aktuální stav hry.</p>
        <!-- přidat hraci pole etc... nebo predelat na /tutorial /game? -->
      {:else if showAvatarSelection}
        <p class="text-xl mb-8" transition:fade>Začneme krátkým úvodem do hry, teď si vyberte svůj avatar!</p>
      {/if}
    {/if}
  </div>
  
  {#if !tutorialCompleted && showAvatarSelection}
    <div class="container mx-auto px-4 max-w-2xl" transition:fly="{{ y: 300, duration: 300 }}">
      <div class="grid grid-cols-4 grid-rows-2 gap-4">
        {#each avatars as avatar, i}
          <div 
            class="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all {currentAvatarId === i ? 'ring-4 ring-slate-600' : ''}"
            on:click={() => updateAvatar(i)}
            on:keydown={(e) => handleKeyDown(e, i)}
            role="button"
            tabindex="0"
          >
            <img
              src={avatar}
              alt="Avatar option {i + 1}"
              class="w-full h-full object-cover"
            />
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!--
  Opravit zobrazovani avatar menu pri refresh stranky nebo prechodu na stranku i po dokonceni tutorialu
  Mozna rozdelit Tutorial stranku a Game stranku na jednotlive
  Opravit chybu s vyberem Avataru1 a Avataru2
  -->
