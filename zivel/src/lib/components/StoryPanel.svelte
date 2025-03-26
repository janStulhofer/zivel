<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-svelte';
  import { supabase } from '$lib/supabaseClient';
  import { unlockedElements } from '$lib/stores/odemcenePrvky';

  interface StoryPage {
    content: string;
  }

  interface Chapter {
    title: string;
    pages: StoryPage[];
    isUnlocked: boolean;
    unlockElement: string;
  }

  // Původní definice jako konstanta
  const initialChapters: Chapter[] = [
    {
      
  title: "Začátek zvláštní cesty",
  pages: [
    { 
      content: "Unavené kroky mě vedly chodbou staré vědecké laboratoře. Ještě před měsícem jsem byl jen dalším absolventem biologie bez perspektivy. Teď jsem asistentem legendárního Dr. Zylasta - vědce, o jehož kontroverzních experimentech se šeptalo po celé akademické obci. Jeho rozcuchané šedivé vlasy a brýle silné jako dno lahve mi připadaly téměř jako karikatura." 
    },
    { 
      content: "\"Všechno začíná u elementárních principů,\" zavrčel, když mi do rukou vtlačil dva minerální vzorky. \"Tvým křtem bude vytvoření základního kamene. Doslova. Syntetizuj mi dokonalý KÁMEN!\" Jeho prsty se chvěly nad krystalickou mřížkou. V očích jsem mu zahlédl jiskru, která ve mně vyvolala neklid." 
    }
  ],
  isUnlocked: true,
  unlockElement: ""
},
{
  title: "Tajemství základních prvků",
  pages: [
    { 
      content: "Kámen na stole pulzoval tlumeným tepem. Dr. Zylast mě pozoroval skrze namodralé brýle. \"Dobře... Ale to byl jen první krok v pyramidě,\" pronesl, zatímco otevíral skříňku s organickými sloučeninami. \"Teď potřebujeme matrix pro život!\" Jeho stín na zdi se roztáhl do tvaru prastarého trilobita." 
    },
    { 
      content: "\"Mrtvá hmota ožije jen s pravým katalyzátorem,\" šeptal vášnivě. \"Spoj minerální základ s organickou esencí! Vytvoř HLÍNU!\" Z jeho dlaní vypadl fosilizovaný list, který se při dopadu rozpadl na prach." 
    }
  ],
  isUnlocked: false,
  unlockElement: "Kámen"
},
{
  title: "Alchymie energie",
  pages: [
    { 
      content: "Hlína v misce dýchala. Dr. Zylast přejížděl mechanickou rukou po povrchu. \"Statická existence je jen poloviční pravda,\" mumlal. \"Potřebujeme rozbít tyto okovy!\" Na stěně za ním blikal hologram molekulárních vazeb." 
    },
    { 
      content: "\"Tvůj třetí úkol?\" Roztáhl před sebou mapu metabolických drah. \"Vytvoř čistou ENERGII! Proměň spící potenciál v tančící sílu!\" Z jeho kapsy vypadl radioaktivní izotop, který propálil díru do linolea." 
    }
  ],
  isUnlocked: false,
  unlockElement: "Hlína"
},
{
  title: "Blesky v dlaních",
  pages: [
    { 
      content: "Jiskry tančily mezi elektrodami. Dr. Zylastův plášť vlál v elektrostatickém poli. \"Elektřina není nástroj,\" křičel přes burácení výbojů. \"Je to krev moderní alchymie!\" Na osciloskopu pulzovaly křivky připomínající tep živého srdce." 
    },
    { 
      content: "\"Teď pochopíš pravý význam Frankensteinova díla,\" syčel a hodil mi izolované kleště. \"Spoj energii s hmotou. Vytvoř základní ŽIVOT!\" Zářivý oblouk mezi nástroji vrhal stíny připomínající tanečníky rituálu." 
    }
  ],
  isUnlocked: false,
  unlockElement: "Energie"
},
{
  title: "Genesis v Petriho misce",
  pages: [
    { 
      content: "Mikroskop odhalil pulzující bod. \"První buňka,\" šeptal Dr. Zylast posvátným tónem. \"Ale tento ŽIVOT je příliš křehký. Potřebujeme ho otestovat...\" Jeho prst spočinul na tlačítku UV lampy. V záři ultrafialového světla se organismus začal překotně dělit." 
    },
    { 
      content: "\"Příroda vždy najde cestu,\" mumlal, když mutantní buňky začaly pohlcovat své sousedy. \"Nyní uvidíš pravou tvář evoluce. Vytvoř BAKTERII, která přežije peklo!\" Jeho stín na zdi se roztáhl do obludných rozměrů." 
    }
  ],
  isUnlocked: false,
  unlockElement: "Život"
},
{
  title: "Morová jáma",
  pages: [
    { 
      content: "Inkubátor hučel jako umírající zvíře. Uvnitř se hemžila kultura, která požírala vlastní metabolitky. \"Paradox života,\" šeptal doktor, přitiskl čelo ke sklu. \"NEMOC je jen evoluce ve zkratce.\" Z jeho rukou padaly do živného roztoku kovové nanočástice." 
    },
    { 
      content: "\"Teď pochopíš, proč potřebujeme překonat biologické meze,\" otočil se ke mně s injekční stříkačkou plnou stříbrné tekutiny. \"Připrav KYBORGOVSKOU KULTURU - spojení masa a stroje! Prvně potřebujeme vhodný stroj, tudíž vytvoř ROBOTA!\" Jeho oční čočky se náhle rozsvítily modrým LED světlem." 
    }
  ],
  isUnlocked: false,
  unlockElement: "Bakterie"
},
{
  title: "Anděl z oceli",
  pages: [
    { 
      content: "Robot stál nehybně, jeho titaniový skelet pokrytý umělou kůží. Dr. Zylastova ruka - nyní s prvními mechanickými implantáty - hladila konstrukci. \"Vidíš tu ironii?\" šeptal. \"Abychom vytvořili vědomí, museli jsme nejprve rozložit život na algoritmy.\"" 
    },
    { 
      content: "Náhle se robotovy oči rozsvítily krvavým červeným světlem. Doktorův hlas zněl jako z hrobky: \"Gratuluji... Právě jsi stvořil nového boha. Teď se modli, aby nás nesežral.\" V pozadí začaly přístroje ječet poplašným alarmem." 
    }
  ],
  isUnlocked: false,
  unlockElement: "Nemoc"
},
{
  title: "Kovová evoluce",
  pages: [
    { 
      content: "Robotův pohled nás sledoval z temného kouta laboratoře. Dr. Zylast nyní vypadal jako živá socha z masa a oceli - polovina obličeje pokrytá kovovými destičkami. \"Stroj je dokonalý logik,\" pronesl kovově, \"ale postrádá... vášeň. Potřebujeme syntézu!\"" 
    },
    { 
      content: "Jeho biomechanická ruka vstřikovala robotické nanočástice do živého mozku. \"Tvůj poslední úkol: Vytvoř KYBORGA! Spoj algoritmy s tělesností. Až strach ze smrti probudí skutečné vědomí.\" Z jeho hrdla vystupovaly kovové trubičky pulzující modrou tekutinou." 
    }
  ],
  isUnlocked: false,
  unlockElement: "Robot"
}
  ];

  let chapters = [...initialChapters];
  let currentChapter = 0;
  let currentPage = 0;
  let unsubscribe: () => void;

  const selectChapter = (index: number) => {
    if (chapters[index]?.isUnlocked) {
      currentChapter = index;
      currentPage = 0;
    }
  };

  const nextPage = () => {
    if (currentPage < chapters[currentChapter].pages.length - 1) {
      currentPage++;
    } else if (currentChapter < chapters.length - 1 && chapters[currentChapter + 1].isUnlocked) {
      currentChapter++;
      currentPage = 0;
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      currentPage--;
    } else if (currentChapter > 0) {
      currentChapter--;
      currentPage = chapters[currentChapter].pages.length - 1;
    }
  };

  async function updateChapters() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('unlocked_elements')
      .eq('id', user.id)
      .single();

    chapters = initialChapters.map(chapter => {
      if (chapter.unlockElement === "") return chapter;
      const isUnlocked = data?.unlocked_elements?.includes(chapter.unlockElement) || false;
      return { ...chapter, isUnlocked };
    });
  }

  onMount(async () => {
    await updateChapters();
    unsubscribe = unlockedElements.subscribe(updateChapters);
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="w-[600px] mx-auto p-6 space-y-6">
  <div class="flex justify-between items-center space-x-2">
    {#each chapters as chapter, i}
      <button
        on:click={() => selectChapter(i)}
        class={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out
                ${chapter.isUnlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}
                ${i === currentChapter ? 'ring-2 ring-white' : ''}
                ${chapter.isUnlocked && i !== 0 ? 'animate-pulse-once' : ''}`}
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
      Pro odemčení této kapitoly: Vytvořte prvek {chapters[currentChapter].unlockElement}
    </div>
  {/if}
</div>

<style global>
  @keyframes pulse-once {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  .animate-pulse-once {
    animation: pulse-once 0.5s ease-in-out;
  }
</style>