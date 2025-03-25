<script lang="ts">
  import { onMount } from 'svelte';
  import { ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-svelte';

  export let username: string;

  interface StoryPage {
    content: string;
  }

  interface Chapter {
    title: string;
    pages: StoryPage[];
    isUnlocked: boolean;
    unlockCondition: string;
  }

  const chapters: Chapter[] = [
    {
      title: "Úvod",
      pages: [
        { content: "Hledali jste praci a našli jste ji." },
        { content: "Stal jsi se pomocníkem vědce..." }
      ],
      isUnlocked: true,
      unlockCondition: "Začátek je vždy odemčený"
    },
    {
      title: "První kroky",
      pages: [
        { content: "Jen co jsi viděl vědce, tak se tebou prohnal strach." },
        { content: "Byl starý a zarostlý." }
      ],
      isUnlocked: true,
      unlockCondition: "Vytvořte prvek páry"
    },
    {
      title: "y",
      pages: [
        { content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
        { content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." }
      ],
      isUnlocked: false,
      unlockCondition: "Vytvořte prvek x"
    },
    {
      title: "y",
      pages: [
        { content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
        { content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." }
      ],
      isUnlocked: false,
      unlockCondition: "Vytvořte prvek x"
    },
    {
      title: "y",
      pages: [
        { content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
        { content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." }
      ],
      isUnlocked: false,
      unlockCondition: "Vytvořte prvek x"
    }
  ];

  let currentChapter = 0;
  let currentPage = 0;

  function nextPage() {
    if (currentPage < chapters[currentChapter].pages.length - 1) {
      currentPage++;
    } else if (currentChapter < chapters.length - 1 && chapters[currentChapter + 1].isUnlocked) {
      currentChapter++;
      currentPage = 0;
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
    } else if (currentChapter > 0) {
      currentChapter--;
      currentPage = chapters[currentChapter].pages.length - 1;
    }
  }

  function selectChapter(index: number) {
    if (chapters[index].isUnlocked) {
      currentChapter = index;
      currentPage = 0;
    }
  }

  onMount(() => {
    // Dodělat načítání z db
  });
</script>

<div class="w-[600px] mx-auto p-6 space-y-6">
  <div class="flex justify-between items-center space-x-2">
    {#each chapters as chapter, i}
      <button
        on:click={() => selectChapter(i)}
        class={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out
                ${chapter.isUnlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}
                ${i === currentChapter ? 'ring-2 ring-white' : ''}`}
        disabled={!chapter.isUnlocked}
      >
        {#if chapter.isUnlocked}
          <Unlock size={20} class="text-white" />
        {:else}
          <Lock size={20} class="text-white" />
        {/if}
      </button>
    {/each}
  </div>

  <div class="backdrop-blur-sm border rounded-lg border-gray-700 bg-gray-800/50 p-6 h-[400px] flex flex-col justify-between">
    <div class="overflow-y-auto flex-grow">
      <h2 class="text-2xl font-bold text-white mb-4">{chapters[currentChapter].title}</h2>
      <p class="text-gray-300">{chapters[currentChapter].pages[currentPage].content}</p>
    </div>
    <div class="flex justify-between items-center mt-6">
      <button 
        on:click={prevPage} 
        class="rounded-lg bg-gray-700 p-2 text-white transition-all hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentChapter === 0 && currentPage === 0}
      >
        <ChevronLeft size={24} />
      </button>
      <span class="text-white">Strana {currentPage + 1} / {chapters[currentChapter].pages.length}</span>
      <button 
        on:click={nextPage} 
        class="rounded-lg bg-gray-700 p-2 text-white transition-all hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentChapter === chapters.length - 1 && currentPage === chapters[currentChapter].pages.length - 1}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  </div>

  {#if !chapters[currentChapter].isUnlocked}
    <div class="text-center text-yellow-400">
      Pro odemčení této kapitoly: {chapters[currentChapter].unlockCondition}
    </div>
  {/if}
</div>
