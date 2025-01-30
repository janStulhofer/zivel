<script lang="ts"> //Dopsat popis funkci etc...
	  import {tokenStore} from '$lib/stores/tokenCount';

    //Testovaci lvly
    const levelRequirements = [
        100,    
        250,    
        500,    
        1000,   
        2000,   
    ];

    export let xp = 0;  //Inicializacni hodnota pak z db
    
    function calculateLevel(currentXP: number) {
        let currentLevel = 0;
        
        for (let i = 0; i < levelRequirements.length; i++) {
            if (currentXP >= levelRequirements[i]) {
                currentLevel = i + 1;
            } else {
                break;
            }
        }
        
        return currentLevel;
    }

    function getMaxXPForCurrentLevel(currentXP: number) {
        const level = calculateLevel(currentXP);
        return levelRequirements[level] || levelRequirements[levelRequirements.length - 1];
    }

    $: maxXP = getMaxXPForCurrentLevel(xp);
    $: currentLevel = calculateLevel(xp);

	let prevLvl = 0;
	$: if(currentLevel > prevLvl)
	{
		const tokensToAdd = (currentLevel - prevLvl) * 10; //10tokenu za kazdy novy lvl
		tokenStore.update(tokens => tokens + tokensToAdd);
		prevLvl = currentLevel;
	}

    $: progress = Math.min((xp / maxXP) * 100, 100);  //'$' znamená, že se jedná o reaktivní deklaraci => automaticky se prepocitava kdyz se zmeni xp nebo maxXP..

</script>

<div class="relative h-8 w-full overflow-hidden rounded-full bg-gray-200">
    <div
        class="absolute left-0 top-0 h-full rounded-full bg-green-500 transition-all duration-1000 ease-out"
        style="width: {progress}%;"
    ></div>
    <div
        class="absolute left-0 top-0 flex h-full w-full items-center justify-center text-sm font-bold text-black"
    >
        Level {currentLevel}: {xp}/{maxXP} XP
    </div>
</div>

