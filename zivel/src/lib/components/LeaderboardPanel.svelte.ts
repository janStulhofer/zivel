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

    const nameStyles = [
        'text-white',
        'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500',
        'text-green-400 font-bold',
        'animate-pulse text-purple-400'
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
            .order('unlocked_elements', { ascending: false }); // Opraveno: správný název sloupce

        if (data) {
            players = data
                .filter(p => p.unlocked_elements?.length > 0)
                .sort((a, b) => b.unlocked_elements.length - a.unlocked_elements.length)
                .slice(0, 20);
        }
        loading = false;
    });
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
                        <div class={`text-lg ${nameStyles[player.active_name_style ?? 0]}`}>
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