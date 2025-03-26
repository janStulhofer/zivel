<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { unlockedElements } from '$lib/stores/odemcenePrvky';
	import { tokenStore } from '$lib/stores/tokenCount';
	import { onMount } from 'svelte';
	import { TASKS } from '$lib/tasks';
  
	let userTasks: any[] = [];
	let loading = true;
	let unsubscribe: () => void = () => {};
  
	onMount(async (): Promise<void> => {
	  await loadProgress();
	  unsubscribe = unlockedElements.subscribe(loadProgress);
	  return () => {
		unsubscribe();
	  };
	});
  
	async function loadProgress() {
	  const {
		data: { user }
	  } = await supabase.auth.getUser();
	  if (!user) return;
  
	  const { data } = await supabase
		.from('user_profiles')
		.select('unlocked_elements, claimed_tasks')
		.eq('id', user.id)
		.single();
  
	  userTasks = TASKS.map((task) => ({
		...task,
		completed: data?.unlocked_elements?.includes(task.target) || false,
		claimed: data?.claimed_tasks?.includes(task.id) || false
	  }));
  
	  loading = false;
	}
  
	async function claimTask(taskId: number) {
	  const {
		data: { user }
	  } = await supabase.auth.getUser();
	  if (!user) return;
  
	  const { data } = await supabase
		.from('user_profiles')
		.select('claimed_tasks, token')
		.eq('id', user.id)
		.single();
  
	  const claimed = [...(data?.claimed_tasks || []), taskId];
	  const reward = TASKS.find((t) => t.id === taskId)?.reward || 0;
  
	  const { error } = await supabase
		.from('user_profiles')
		.update({
		  claimed_tasks: claimed,
		  token: (data?.token || 0) + reward
		})
		.eq('id', user.id);
  
	  if (!error) {
		tokenStore.update((n) => n + reward);
		await loadProgress();
	  }
	}
  </script>
  
  <div class="space-y-4 p-4 z-11">
	<!-- Aktuální úkoly -->
	<h2 class="mb-4 text-2xl font-bold text-white">Aktuální úkoly</h2>
  
	{#if loading}
	  <div class="animate-pulse space-y-4">
		<div class="h-16 rounded-lg bg-gray-700"></div>
		<div class="h-16 rounded-lg bg-gray-700"></div>
	  </div>
	{:else}
	  {#each userTasks.filter(task => !task.claimed) as task}
		<div class="backdrop-blur-sm border rounded-lg border-gray-700 bg-gray-800/50 p-4">
		  <div class="mb-2 flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white">{task.title}</h3>
			{#if task.completed && !task.claimed}
			  <span class="rounded bg-green-500 px-2 py-1 text-sm text-white">Připraveno</span>
			{:else if task.claimed}
			  <span class="rounded bg-gray-600 px-2 py-1 text-sm text-gray-300">Dokončeno</span>
			{/if}
		  </div>
		  <p class="mb-3 text-gray-300">{task.description}</p>
  
		  <div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
			  <img src="/assets/gui/token.png" class="w-5 h-5" alt="Token" />
			  <span class="text-white">{task.reward} žetonů</span>
			</div>
			{#if task.completed && !task.claimed}
			  <button
				on:click={() => claimTask(task.id)}
				class="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white transition-all hover:from-green-600 hover:to-green-700"
			  >
				Získat odměnu
			  </button>
			{/if}
		  </div>
		</div>
	  {/each}
  
	  <!-- Splněné úkoly -->
	  <h2 class="mb-4 text-2xl font-bold text-white">Splněné úkoly</h2>
	  {#each userTasks.filter(task => task.claimed) as task}
		<div class="backdrop-blur-sm border rounded-lg border-gray-700 bg-gray-800/50 p-4">
		  <div class="mb-2 flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white">{task.title}</h3>
			<span class="rounded bg-gray-600 px-2 py-1 text-sm text-gray-300">Dokončeno</span>
		  </div>
		  <p class="mb-3 text-gray-300">{task.description}</p>
  
		  <div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
			  <img src="/assets/gui/token.png" class="w-5 h-5" alt="Token" />
			  <span class="text-white">{task.reward} žetonů</span>
			</div>
		  </div>
		</div>
	  {/each}
	{/if}
  </div>