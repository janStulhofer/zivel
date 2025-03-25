<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { tokenStore } from '$lib/stores/tokenCount';
    import { onMount } from 'svelte';

    const levelRequirements = [100, 250, 500, 1000, 2000];      //DOUPRAVIT LVLY
    export let xp = 0;

    let dataLoaded = false;
    let lastProcessedLevel = 0;
    let currentLevel = 0;
    let maxXP = 0;

    function calculateLevel(currentXP: number) {
        let level = 0;
        for (const requirement of levelRequirements) {
            if (currentXP >= requirement) level++;
            else break;
        }
        return level;
    }

    function getMaxXPForCurrentLevel(currentXP: number) {
        const level = calculateLevel(currentXP);
        return levelRequirements[level] || levelRequirements.at(-1);
    }

    $: {
        currentLevel = calculateLevel(xp);
        maxXP = getMaxXPForCurrentLevel(xp);
    }

    $: if (dataLoaded) {
        checkLevelUp();
    }

    async function checkLevelUp() {
        if (currentLevel > lastProcessedLevel) {
            const delta = currentLevel - lastProcessedLevel;
            await updateTokensInDatabase(delta * 10);
            lastProcessedLevel = currentLevel; 
        }
    }

    onMount(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('user_profiles')
                .select('last_processed_level')
                .eq('id', user.id)
                .single();

            lastProcessedLevel = data?.last_processed_level ?? calculateLevel(xp);
            dataLoaded = true;
        } catch (error) {
            console.error('Chyba:', error);
            dataLoaded = true;
        }
    });

    async function updateTokensInDatabase(tokensToAdd: number) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase.rpc('increment_token', {
                user_id: user.id,
                tokens: tokensToAdd,
                new_level: currentLevel
            });

            if (!error) {
                tokenStore.update(tokens => tokens + tokensToAdd);
            }
        } catch (error) {
            console.error('Chyba:', error);
        }
    }

    $: progress = Math.min((xp / maxXP) * 100, 100);
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