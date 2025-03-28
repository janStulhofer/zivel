<script lang="ts">
  import { onMount } from 'svelte';
  import { trashStore } from '$lib/stores/trashStore';
  import { elements } from '$lib/dragLogic';

  let trashZone: HTMLElement;

  // Funkce pro smazání všech prvků
  const deleteAllElements = () => {
    elements.set([]);
  };

  // Původní logika pro sledování pozice zůstává
  const updatePosition = () => {
    if (!trashZone) return;
    
    const rect = trashZone.getBoundingClientRect();
    trashStore.set({
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2,
      radius: 500 
    });
  };

  onMount(() => {
    const resizeObserver = new ResizeObserver(updatePosition);
    if (trashZone) resizeObserver.observe(trashZone);
    
    window.addEventListener('resize', updatePosition);
    setTimeout(updatePosition, 50);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  });
</script>

<div class="absolute left-4 bottom-4 z-10" bind:this={trashZone}>
  <img
      src="/assets/gui/trash-can.png"
      alt="Koš"
      class="w-20 h-20 transition-all duration-200 hover:scale-110 cursor-pointer"
      on:click={deleteAllElements}
  />
</div>
