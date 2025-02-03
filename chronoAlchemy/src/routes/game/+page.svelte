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
	import { xpStore } from '$lib/stores/xpCount';
	import { tokenStore } from '$lib/stores/tokenCount';
  import ElementPanel from '$lib/components/ElementPanel.svelte';
import CurrentTask from '$lib/components/CurrentTask.svelte';
import TaskPanel from '$lib/components/TaskPanel.svelte';
import { TASKS } from '$lib/tasks';
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
  let isMenuOpen = false;

  let prvkyPocet = 8;

  $: gameElements = $elements;

  const default_elements = ['water', 'air', 'fire', 'earth'];

  onMount(async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
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
			{ id: 2, type: 'fire', x: 200, y: 200, width: 50, height: 50 }
    ]);
	});

  //Funkce pro odhlaseni uzivatele
  async function handleLogout() {
    await supabase.auth.signOut();
    navigateWithTransition('/login', 'slide-right');
  }
  
  //Aktualizace avatara uzivatele
  async function updateAvatar(newAvatarId: number) {
		const {
			data: { user }
		} = await supabase.auth.getUser();
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

			elements.update((els) => [
				...els,
				{
        id: Date.now(),
        type: elementType,
        x,
        y,
        width: 50,
        height: 50
				}
			]);
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

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<Particles />

{#if loading}
	<div class="flex h-screen items-center justify-center">
    <p class="text-2xl font-bold text-white">Načítání...</p>
		<img src="/assets/loading2.gif" alt="nacitani" />
  </div>
{:else if dataLoaded}
  <!-- Hlavní container -->
	<div class="flex h-screen w-screen flex-col overflow-hidden">
    <!-- Horní menu -->
		<div
			class="backdrop-blur-sm flex h-16 w-full items-center justify-between bg-black/[0.01] px-4"
		>
      <!-- Logo vlevo -->
      <img src="/assets/logoZivel-White.png" alt="Logo" class="h-12 object-contain" />
      
      <!-- Progress bar uprostřed -->
			<div class="mx-8 max-w-xl flex-1">
				<LiquidProgressBar xp={$xpStore} />
      </div>
      
      <!-- Profil vpravo -->
      <div class="flex items-center space-x-4">
				<span class="border mr-6 flex rounded-lg p-1 text-white"
					><img src="/assets/gui/token.png" class="w-7 pr-2" />{$tokenStore}</span
				>
				<span class="font-medium text-white">{username}</span>
        <img 
          src={`/assets/avatars/avatar${currentAvatarId + 1}.jpg`}
          alt="User avatar" 
					class="h-10 w-10 rounded-full object-cover"
        />
      </div>
    </div>

    <!-- HERNÍ PROSTOR -->
		<div class="flex flex-1 overflow-hidden">
      <!-- Levý prostor - přidat obsah jako příběh, achievementy etc. nebo přidat pod menu v profilu -->
			<div class="border-r w-32 border-gray-700">
        <button
          on:click={toggleMenu}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
          aria-label="Otevřít menu"
        >
					<img src="/assets/gui/tied-scroll.png" alt="Úkoly" class="w-14" />
        </button>

        <button
        on:click={toggleMenu}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
        aria-label="Otevřít menu"
      >
					<img src="/assets/gui/shopping-cart.png" alt="Úkoly" class="w-14" />
      </button>

      <button
      on:click={toggleMenu}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
      aria-label="Otevřít menu"
    >
					<img src="/assets/gui/achievement.png" alt="Úkoly" class="w-14" />
    </button>

    <button
    on:click={toggleMenu}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
    aria-label="Otevřít menu"
  >
					<img src="/assets/gui/podium.png" alt="Úkoly" class="w-14" />
  </button>

  <button
  on:click={toggleMenu}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
  aria-label="Otevřít menu"
>
					<img src="/assets/gui/book-cover.png" alt="Úkoly" class="w-14" />
</button>

<button
on:click={toggleMenu}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
aria-label="Otevřít menu"
>
					<img src="/assets/gui/stopwatch.png" alt="Úkoly" class="w-14" />
</button>
      
        <!-- Rolovací menu -->
        <div
					class="left-1 bg-gray-800/90 backdrop-blur-sm border-r w-100 scrollbar-hide fixed top-0 z-10 h-screen overflow-y-auto border-gray-700 transition-transform duration-300 ease-in-out"
          class:translate-x-0={isMenuOpen}
          class:-translate-x-full={!isMenuOpen}
        >
          <div class="p-4">
						<h2 class="mb-4 text-xl font-bold text-white">Úkoly</h2>

            <button
            on:click={toggleMenu}
							class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
            aria-label="Otevřít menu"
          >
							<img src="/assets/gui/cancel.png" alt="Úkoly" class="w-14" />
          </button>

            <TaskPanel />
          </div>
        </div>
      </div>

      <!-- Hlavní herní plocha -->
      <div class="flex-1 p-4">
        <div 
					class="bg-black/10 backdrop-blur-sm relative h-full w-full rounded-xl p-6"
          on:drop={handleDrop}
          on:dragover={handleDragOver}
          role="region"
          aria-label="Herní plocha pro kombinování prvků"
        >
          {#each gameElements as element (element.id)}
            <div
							class="cursor-grab active:cursor-grabbing absolute select-none [&:active>img]:opacity-50"
              style="left: {element.x}px; top: {element.y}px; width: {element.width}px; height: {element.height}px;"
              data-id={element.id}
              use:dragElement
            >
              {#if getElementImage(element.type)}
                <img 
									src={getElementImage(element.type) || '/placeholder.svg'}
                  alt={element.type}
									class="pointer-events-none h-full w-full select-none rounded-md object-contain transition-opacity"
                  draggable="false"
                  style="-webkit-user-drag: none;"
                />
              {:else}
								<div
									class="flex h-full w-full select-none items-center justify-center rounded-md bg-blue-500 text-white"
								>
                  {element.type}
                </div>
              {/if}
            </div>
          {/each}
        </div>
        <CurrentTask tasks={TASKS} />
      </div>

      <!-- Pravý panel s prvky -->
      <div class="w-80">
        <ElementPanel />
      </div>
    </div>
  </div>
{/if}

{#if showAvatarSelection && dataLoaded}
	<div class="fixed inset-0 flex items-center justify-center bg-black/50">
		<div class="bg-black/80 backdrop-blur-md w-full max-w-2xl rounded-xl p-8">
			<p class="mb-8 text-center text-xl text-white">
				Začneme krátkým úvodem do hry, teď si vyberte svůj avatar!
			</p>
      <div class="grid grid-cols-4 grid-rows-2 gap-4">
        {#each avatars as avatar, i}
          <div
						class="aspect-square hover:ring-2 hover:ring-white cursor-pointer overflow-hidden rounded-lg transition-all {currentAvatarId ===
						i
							? 'ring-4 ring-slate-600'
							: ''}"
            on:click={() => updateAvatar(i)}
            on:keydown={(e) => handleKeyDown(e, i)}
            role="button"
            tabindex="0"
          >
            <img
            src={`/assets/avatars/avatar${i + 1}.jpg`}
            alt="Avatar option {i + 1}"
							class="h-full w-full object-cover"
          />
        </div>
      {/each}
    </div>
  </div>
</div>
{/if}
