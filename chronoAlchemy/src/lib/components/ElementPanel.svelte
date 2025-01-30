<script lang="ts">
    import { unlockedElements } from '$lib/stores/odemcenePrvky';
    import { elements } from '$lib/dragLogic';
  
    const elementImages: { [key: string]: string } = {
      air: '/assets/prvky/air.png',
      earth: '/assets/prvky/earth.png',
      fire: '/assets/prvky/fire.png',
      steam: '/assets/prvky/steam.png',
      mud: '/assets/prvky/mud.png',
      water: '/assets/prvky/water.png'
    };
  
    const elementNames: { [key: string]: string } = {
      air: 'Vzduch',
      earth: 'Země',
      fire: 'Oheň',
      steam: 'Pára',
      mud: 'Bláto',
      water: 'Voda'
    };
  
    function getElementImage(type: string): string | undefined {
      return elementImages[type];
    }
  
    function handleDragStart(event: DragEvent, elementType: string) {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', elementType);
        event.dataTransfer.effectAllowed = 'copy';
      }
    }
  </script>
  
  <div class="h-full bg-black/[0.01] backdrop-blur-sm rounded-xl">
    <div class="h-full overflow-y-auto scrollbar-hide p-4">
      <div class="flex flex-col space-y-2">
        {#each $unlockedElements as element}
          <div 
            class="flex items-center bg-white/10 rounded-lg cursor-grab hover:bg-white/20 transition-all duration-300 p-2"
            draggable="true"
            on:dragstart={(e) => handleDragStart(e, element)}
          >
            {#if getElementImage(element)}
              <img 
                src={getElementImage(element)} 
                alt={element}
                class="w-12 h-12 rounded-lg mr-4 object-contain select-none pointer-events-none"
                draggable="false"
              />
            {:else}
              <div class="w-12 h-12 bg-gray-300 rounded-lg mr-4 flex items-center justify-center select-none">
                {element}
              </div>
            {/if}
            <span class="text-white select-none">{elementNames[element] || element}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>