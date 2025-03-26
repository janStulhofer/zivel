<script lang="ts">
	import { unlockedElements } from '$lib/stores/odemcenePrvky';
	import { elements } from '$lib/dragLogic';

	let searchQuery = '';
	let isSortedAlphabetically = false;

	const elementNames: { [key: string]: string } = {
		air: 'Vzduch',
		earth: 'Země',
		fire: 'Oheň',
		steam: 'Pára',
		mud: 'Bláto',
		water: 'Voda',
		energy: 'Energie'
	};

	$: filteredElements = $unlockedElements.filter((element) => {
		const displayName = elementNames[element] || element;
		return displayName.toLowerCase().includes(searchQuery.toLowerCase());
	});

	function toggleSort() {
		isSortedAlphabetically = !isSortedAlphabetically;
	}

	function sortAlphabetically(a: string, b: string): number {
		const nameA = elementNames[a] || a;
		const nameB = elementNames[b] || b;
		return nameA.localeCompare(nameB);
	}

  function getElementImage(elementName: string) {
    return `/assets/prvky/${elementName.charAt(0).toUpperCase() + elementName.slice(1).toLowerCase()}.png`;
}

	function handleDragStart(event: DragEvent, elementType: string) {
		if (event.dataTransfer) {
			event.dataTransfer.setData('text/plain', elementType);
			event.dataTransfer.effectAllowed = 'copy';
		}
	}
</script>

<div class="backdrop-blur-sm h-full rounded-xl bg-black/[0.01]">
	<div class="scrollbar-hide h-full overflow-y-auto p-4">
		<div class="mb-4 flex items-center space-x-2">
			<input
				type="text"
				placeholder="Hledat prvky..."
				bind:value={searchQuery}
				class="flex-grow bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 text-white placeholder-white/50"
			/>
			<button
				on:click={toggleSort}
				class="bg-white/10 hover:bg-white/20 flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors duration-200"
			>
				<img
					src={isSortedAlphabetically ? '/assets/gui/abc.png' : '/assets/gui/calendar.png'}
					alt={isSortedAlphabetically ? 'Seřadit podle abecedy' : 'Seřadit podle data'}
					class="h-6 w-6"
				/>
			</button>
		</div>

		<div class="flex flex-col space-y-2">
			{#each isSortedAlphabetically ? [...filteredElements].sort(sortAlphabetically) : filteredElements as element}
				<div
					class="bg-white/10 cursor-grab hover:bg-white/20 flex items-center rounded-lg p-2 transition-all duration-300"
					draggable="true"
					on:dragstart={(e) => handleDragStart(e, element)}
					role="button"
					tabindex="0"
					aria-label={`Drag ${elementNames[element] || element}`}
				>
					{#if getElementImage(element)}
						<img
							src={getElementImage(element)}
							alt={element}
							class="pointer-events-none mr-4 h-12 w-12 select-none rounded-lg object-contain"
							draggable="false"
						/>
					{:else}
						<div
							class="mr-4 flex h-12 w-12 select-none items-center justify-center rounded-lg bg-gray-300"
						>
							{element}
						</div>
					{/if}
					<span class="select-none text-white">{elementNames[element] || element}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
