<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { navigateWithTransition } from '$lib/transitions';
  import { fade, fly } from 'svelte/transition';
  import { dndzone } from 'svelte-dnd-action';
  import Particles from '$lib/components/particles.svelte';
  import LiquidProgressBar from '$lib/components/LiquidProgressBar.svelte';
  import { elements, dragElement } from '$lib/dragLogic';
  import { unlockedElements } from '$lib/stores/odemcenePrvky';
  import {xpStore} from '$lib/stores/xpCount';
  import {tokenStore} from '$lib/stores/tokenCount';
  import ElementPanel from '$lib/components/ElementPanel.svelte';

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

  const default_elements = ['water', 'air', 'fire', 'earth'];

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      username = user.user_metadata.username || 'Uživatel';
      const { data, error } = await supabase
        .from('user_profiles')
        .select('tutorial, avatar_id, unlocked_elements, token, xp')
        .eq('id', user.id)
        .single();
      
      if (data) {
        tutorialCompleted = data.tutorial;
        xpStore.set(data.xp);
        tokenStore.set(data.token);
        currentAvatarId = data.avatar_id;
        showAvatarSelection = !data.tutorial;
        if (!data.tutorial && (!data.unlocked_elements || data.unlocked_elements.length === 0)) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ unlocked_elements: default_elements })
          .eq('id', user.id);
        
        if (!updateError) {
          unlockedElements.set(default_elements);
        } else {
          console.error('Error initializing elements:', updateError);
        }
      } else {
        unlockedElements.set(data.unlocked_elements || default_elements);
      }
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
    ]);
  }
  );

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

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const elementType = event.dataTransfer?.getData('text/plain');
    
    if (elementType) {
      const gameArea = event.currentTarget as HTMLElement;
      const rect = gameArea.getBoundingClientRect();
      const x = event.clientX - rect.left - 25; // 25 je polovina šířky elementu
      const y = event.clientY - rect.top - 25; // 25 je polovina výšky elementu

      elements.update(els => [...els, {
        id: Date.now(),
        type: elementType,
        x,
        y,
        width: 50,
        height: 50
      }]);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  function getElementImage(type: string): string | undefined {
    const elementImages: { [key: string]: string } = {
      air: '/assets/prvky/air.png',
      earth: '/assets/prvky/earth.png',
      fire: '/assets/prvky/fire.png',
      steam: '/assets/prvky/steam.png',
      mud: '/assets/prvky/mud.png',
      water: '/assets/prvky/water.png'
    };
    return elementImages[type];
  }
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
        <LiquidProgressBar xp = {$xpStore}/>
      </div>
      
      <!-- Profil vpravo -->
      <div class="flex items-center space-x-4">
        <span class="text-white border rounded-lg mr-6 p-1 flex"><img src="/assets/gui/token.png" class="w-7 pr-2">{$tokenStore}</span>
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
        <div 
          class="w-full h-full bg-black/10 backdrop-blur-sm rounded-xl p-6 relative"
          on:drop={handleDrop}
          on:dragover={handleDragOver}
          role="region"
          aria-label="Herní plocha pro kombinování prvků"
        >
          {#each gameElements as element (element.id)}
            <div
              class="absolute cursor-grab active:cursor-grabbing [&:active>img]:opacity-50 select-none"
              style="left: {element.x}px; top: {element.y}px; width: {element.width}px; height: {element.height}px;"
              data-id={element.id}
              use:dragElement
            >
              {#if getElementImage(element.type)}
                <img 
                  src={getElementImage(element.type) || "/placeholder.svg"} 
                  alt={element.type}
                  class="w-full h-full rounded-md object-contain select-none pointer-events-none transition-opacity"
                  draggable="false"
                  style="-webkit-user-drag: none;"
                />
              {:else}
                <div class="w-full h-full bg-blue-500 rounded-md flex items-center justify-center text-white select-none">
                  {element.type}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Pravý panel s prvky -->
      <div class="w-80">
        <ElementPanel />
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