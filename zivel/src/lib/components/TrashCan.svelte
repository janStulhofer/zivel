<script lang="ts">
    import { onMount } from 'svelte';
    import { trashStore } from '$lib/stores/trashStore';
  
    let trashZone: HTMLElement;
  
    onMount(() => {
  const updatePosition = () => {
    const rect = trashZone.getBoundingClientRect();
    trashStore.set({
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2,
      radius: 50 
    });
  };
  
  updatePosition();
  window.addEventListener('resize', updatePosition);
  return () => window.removeEventListener('resize', updatePosition);
});
  </script>
  
  <div class="absolute left-4 bottom-4 z-10" bind:this={trashZone}>
    <img
      src="/assets/gui/trash-can.png"
      alt="Koš"
      class="w-20 h-20 transition-all duration-200 hover:scale-110"
    />
  </div>
