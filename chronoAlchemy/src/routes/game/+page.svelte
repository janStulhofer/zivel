<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { navigateWithTransition } from '$lib/transitions';
  import { fade, fly } from 'svelte/transition';
  import { dndzone } from 'svelte-dnd-action';
  import Particles from '$lib/components/particles.svelte';
  import LiquidProgressBar from '$lib/components/LiquidProgressBar.svelte';
  import { elements, dragElement } from '$lib/dragLogic';
  
  //Seznam cest k avatarum
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
  let showAvatarSelection = false;
  let dataLoaded = false;

  let prvkyPocet = 8;

  $: gameElements = $elements;

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
        showAvatarSelection = !data.tutorial;
      }
    } else {
      navigateWithTransition('/login', 'slide-right');
    }
    loading = false;
    dataLoaded = true;

    // Inicializace herních prvků
    elements.set([
      { id: 1, type: 'water', x: 100, y: 100, width: 50, height: 50 },
      { id: 2, type: 'fire', x: 200, y: 200, width: 50, height: 50 },
      // Přidejte další počáteční prvky podle potřeby
    ]);
  });
  
  //Funkce pro odhlaseni uzivatele
  async function handleLogout() {
    await supabase.auth.signOut();
    navigateWithTransition('/login', 'slide-right');
  }
  
  //Aktualizace avatara uzivatele
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
  
  //Reakce na stisk klavesy pri vyberu uzivatele
  function handleKeyDown(event: KeyboardEvent, avatarId: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      updateAvatar(avatarId);
    }
  }

  //Generovani radku v seznamu prvku
  const generateGridItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => i + 1);
  };
</script>

<Particles />

{#if loading}
  <div class="flex items-center justify-center h-screen">
    <p class="text-2xl font-bold text-white">Načítání...</p>
    <img src="/assets/loading2.gif" alt="nacitani">
  </div>
{:else if dataLoaded}
  <!-- Hlavní container -->
  <div class="h-screen w-screen flex flex-col overflow-hidden">
    <!-- Horní menu -->
    <div class="w-full h-16 bg-black/[0.01] backdrop-blur-sm px-4 flex items-center justify-between">
      <!-- Logo vlevo -->
      <img src="/assets/logoZivel-White.png" alt="Logo" class="h-12 object-contain" />
      
      <!-- Progress bar uprostřed -->
      <div class="flex-1 max-w-xl mx-8">
        <LiquidProgressBar />
      </div>
      
      <!-- Profil vpravo -->
      <div class="flex items-center space-x-4">
        <span class="text-white font-medium">{username}</span>
        <img 
        src={`/assets/avatars/avatar${currentAvatarId + 1}.jpg`}
        alt="User avatar" 
        class="w-10 h-10 rounded-full object-cover"
      />
    </div>
  </div>

    <!-- HERNÍ PROSTOR -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Levý prostor - přidat obsah jako příběh, achievementy etc. nebo přidat pod menu v profilu -->
      <div class="w-16"></div>

    <!-- Hlavní herní plocha -->
    <div class="flex-1 p-4">
      <div class="w-full h-full bg-black/10 backdrop-blur-sm rounded-xl p-6 relative">
        {#each gameElements as element (element.id)}
          <div
            class="absolute cursor-move"
            style="left: {element.x}px; top: {element.y}px; width: {element.width}px; height: {element.height}px;"
            data-id={element.id}
            use:dragElement
          >
            <!-- Přidat obrázky pro jednotlivé prvky -->
            <div class="w-full h-full bg-blue-500 rounded-md flex items-center justify-center text-white">
              {element.type}
            </div>
          </div>
        {/each}
      </div>
    </div>

      <!-- Pravý panel s prvky -->
      <div class="w-80">
        <div class="h-full bg-black/[0.01] backdrop-blur-sm rounded-xl">
          <div class="h-full overflow-y-auto scrollbar-hide p-4">
            <div class="flex flex-col space-y-2">
              {#each generateGridItems(prvkyPocet) as prvek}
                <div 
                  class="flex items-center bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-300 p-2"
                >
                  <div class="w-12 h-12 bg-gray-300 rounded-lg mr-4"></div>
                  <span class="text-white">{prvek}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if showAvatarSelection && dataLoaded}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-black/80 backdrop-blur-md p-8 rounded-xl max-w-2xl w-full">
      <p class="text-xl text-white mb-8 text-center">Začneme krátkým úvodem do hry, teď si vyberte svůj avatar!</p>
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
            src={`/assets/avatars/avatar${i + 1}.jpg`}
            alt="Avatar option {i + 1}"
            class="w-full h-full object-cover"
          />
        </div>
      {/each}
    </div>
  </div>
</div>
{/if}