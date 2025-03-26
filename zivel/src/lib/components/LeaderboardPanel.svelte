<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { fade } from 'svelte/transition';

    let loading = true;
    let players: any[] = [];

    const profileFrames = [
        'border-2 border-gray-400',
        'border-4 border-yellow-400',
        'border-4 border-purple-500 rounded-full',
        'p-1 bg-gradient-to-r from-blue-500 to-purple-600'
    ];

    onMount(async () => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select(`
                id,
                username,
                avatar_id,
                unlocked_elements,
                active_name_style,
                active_profile_frame
            `)
            .order('unlocked_elements', { ascending: false });

        if (data) {
            players = data
                .filter(p => p.unlocked_elements?.length > 0)
                .sort((a, b) => b.unlocked_elements.length - a.unlocked_elements.length)
                .slice(0, 20);
        }
        loading = false;
    });

    // Nová funkce pro mapování stylů
    const getNameStyle = (styleId: number | null): string => {
        switch(styleId) {
            case 1: return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500';
            case 2: return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-300 to-cyan-400 animate-ice';
            case 3: return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400';
            case 4: return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-rainbow';
            case 5: return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-fire';
            case 6: return 'font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-white animate-lightning';
            case 7: return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500';
            case 8: return 'font-bold text-gray-400 italic';
            default: return 'text-white';
        }
    };
</script>

<div class="h-full overflow-y-auto px-4">
    {#if loading}
        <div class="flex h-full items-center justify-center" transition:fade>
            <img src="/assets/loading2.gif" alt="Načítání" class="w-20" />
        </div>
    {:else if players.length === 0}
        <p class="text-center text-gray-400">Žádní hráči k zobrazení</p>
    {:else}
        <div class="divide-y divide-gray-700">
            {#each players as player, index (player.id)}
                <div class="flex items-center gap-4 py-3" transition:fade>
                    <div class="w-8 text-right text-xl font-bold text-gray-400">
                        #{index + 1}
                    </div>

                    <div class={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full ${profileFrames[player.active_profile_frame ?? 0]}`}>
                        <img
                            src={`/assets/avatars/avatar${(player.avatar_id ?? 0) + 1}.jpg`}
                            alt="Profilový obrázek"
                            class="h-full w-full object-cover"
                        />
                    </div>

                    <div class="flex-1">
                        <div class={`text-lg ${getNameStyle(player.active_name_style)}`}>
                            {player.username || 'Anonymní hráč'}
                        </div>
                        <div class="flex items-center gap-2 text-gray-400">
                            <span>{player.unlocked_elements?.length || 0} odemčených prvků</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes ice {
        0% { opacity: 0.8; }
        50% { opacity: 1; filter: brightness(1.2); }
        100% { opacity: 0.8; }
    }

    @keyframes fire {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes lightning {
        0% { filter: brightness(1); }
        25% { filter: brightness(2); }
        50% { filter: brightness(1); }
        75% { filter: brightness(1.5); }
        100% { filter: brightness(1); }
    }

    .animate-rainbow, .animate-fire {
        background-size: 200% auto;
        animation: rainbow 3s linear infinite;
    }

    .animate-ice {
        animation: ice 2s ease-in-out infinite;
    }

    .animate-lightning {
        animation: lightning 0.8s linear infinite;
    }
</style>