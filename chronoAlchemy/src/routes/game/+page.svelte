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
	import TaskPanel from '$lib/components/TaskPanel.svelte';
	import ShopPanel from '$lib/components/ShopPanel.svelte';
	import AchievementsPanel from '$lib/components/AchievementsPanel.svelte';
	import LeaderboardPanel from '$lib/components/LeaderboardPanel.svelte';
	import StoryPanel from '$lib/components/StoryPanel.svelte';
	import TimeModePanel from '$lib/components/TimeModePanel.svelte';
	import StyledUsername from '$lib/components/StyledUsername.svelte';
	import TrashCan from '$lib/components/TrashCan.svelte';
	import { writable } from 'svelte/store';

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

	export let username = '';
	let loading = true;
	let tutorialCompleted = false;
	let currentAvatarId = 0;
	let showAvatarSelection = false;
	let dataLoaded = false;
	let isMenuOpen = false;
	let userId: string = '';
	let activePanel = null;

	function openPanel(panel) {
		activePanel = panel;
	}

	function closePanel() {
		activePanel = null;
	}

	let prvkyPocet = 8;

	$: gameElements = $elements;

	const default_elements = ['Voda', 'Vzduch', 'Oheň', 'Země'];

	// onMount se spouští po prvním renderování komponenty
	onMount(async () => {
		// Získání informací o aktuálně přihlášeném uživateli ze Supabase auth
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (user) {
			userId = user.id;
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

	function getElementImage(elementName) {
		return `/assets/prvky/${elementName.charAt(0).toUpperCase() + elementName.slice(1).toLowerCase()}.png`;	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<Particles />


{#if loading}
    <div class="flex h-screen items-center justify-center" transition:fade>
        <img src="/assets/loading2.gif" alt="Načítání" class="w-20" />
    </div>
{:else if dataLoaded}
	<!-- Hlavní container -->
	<div class="flex h-screen w-screen flex-col overflow-hidden">
		<!-- Horní menu -->
		<div
			class="flex h-16 w-full items-center justify-between bg-black/[0.01] px-4 backdrop-blur-sm"
		>
			<!-- Logo vlevo -->
			<img src="/assets/logoZivel-White.png" alt="Logo" class="h-12 object-contain" />

			<!-- Progress bar uprostřed -->
			<div class="mx-8 max-w-xl flex-1">
				<LiquidProgressBar xp={$xpStore} />
			</div>

			<!-- Profil vpravo -->
			<div class="flex items-center space-x-4">
				<span class="mr-6 flex rounded-lg border p-1 text-white"
					><img src="/assets/gui/token.png" class="w-7 pr-2" />{$tokenStore}</span
				>

				<StyledUsername {username} {userId} />
				<img
					src={`/assets/avatars/avatar${currentAvatarId + 1}.jpg`}
					alt="User avatar"
					class="h-10 w-10 rounded-full object-cover"
				/>
			</div>
		</div>

		<!-- HERNÍ PROSTOR -->
		<div class="flex flex-1 overflow-hidden">
			<!-- Levý prostor -->
			<div class="w-32 border-r border-gray-700">
				<button
					on:click={() => openPanel('tasks')}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
					aria-label="Otevřít úkoly"
				>
					<img src="/assets/gui/tied-scroll.png" alt="Úkoly" class="w-14" />
				</button>

				<button
					on:click={() => openPanel('shop')}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
					aria-label="Otevřít obchod"
				>
					<img src="/assets/gui/shopping-cart.png" alt="Obchod" class="w-14" />
				</button>

				<button
					on:click={() => openPanel('leaderboard')}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
					aria-label="Otevřít žebříček"
				>
					<img src="/assets/gui/podium.png" alt="Žebříček" class="w-14" />
				</button>

				<button
					on:click={() => openPanel('story')}
					class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
					aria-label="Otevřít příběh"
				>
					<img src="/assets/gui/book-cover.png" alt="Příběh" class="w-14" />
				</button>

				<!-- Rolovací menu -->
				{#if activePanel !== null}
					<div
						class="w-100 scrollbar-hide fixed left-1 top-0 z-10 h-screen overflow-y-auto border-r border-gray-700 bg-gray-800/90 backdrop-blur-sm transition-transform duration-300 ease-in-out z-51"
						class:translate-x-0={activePanel !== null}
						class:-translate-x-full={activePanel === null}
					>
						<div class="p-4">
							<button
								on:click={closePanel}
								class="flex w-full items-center justify-center p-4 transition-colors hover:bg-gray-700/50"
								aria-label="Zavřít panel"
							>
								<img src="/assets/gui/cancel.png" alt="Vrátit" class="w-14" />
							</button>

							{#if activePanel === 'tasks'}
								<h2 class="mb-4 text-xl font-bold text-white z-11">Úkoly</h2>
								<TaskPanel />
							{:else if activePanel === 'shop'}
								<h2 class="mb-4 text-xl font-bold text-white">Obchod</h2>
								<ShopPanel />
							{:else if activePanel === 'leaderboard'}
								<h2 class="mb-4 text-xl font-bold text-white">Žebříček</h2>
								<LeaderboardPanel />
							{:else if activePanel === 'story'}
								<h2 class="mb-4 text-xl font-bold text-white">Příběh</h2>
								<StoryPanel {username}/>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Hlavní herní plocha -->
			<div class="relative flex-1 p-4">
				<TrashCan />
				<div
					class="relative h-full w-full rounded-xl bg-black/10 p-6 backdrop-blur-sm"
					on:drop={handleDrop}
					on:dragover={handleDragOver}
					role="region"
					aria-label="Herní plocha pro kombinování prvků"
				>
					{#each gameElements as element (element.id)}
						<div
							class="absolute cursor-grab select-none active:cursor-grabbing [&:active>img]:opacity-50"
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
								<!-- upravit po zmene funkce -->
								<div
									class="flex h-full w-full select-none items-center justify-center rounded-md bg-blue-500 text-white"
								>
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
	<div class="fixed inset-0 flex items-center justify-center bg-black/50">
		<div class="w-full max-w-2xl rounded-xl bg-black/80 p-8 backdrop-blur-md">
			<p class="mb-8 text-center text-xl text-white">
				Začneme krátkým úvodem do hry, teď si vyberte svůj avatar!
			</p>
			<div class="grid grid-cols-4 grid-rows-2 gap-4">
				{#each avatars as avatar, i}
					<div
						class="aspect-square cursor-pointer overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-white {currentAvatarId ===
						i
							? 'ring-4 ring-slate-600'
							: ''}"
						on:click={() => updateAvatar(i)}
						on:keydown={(e) => handleKeyDown(e, i)}
						role="button"
						tabindex="0"
					>
						<img
							src={`/assets/avatars/avatar${i+1}.jpg`}
							alt="Avatar option {i+1}"
							class="h-full w-full object-cover"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
