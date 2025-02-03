<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { tokenStore } from '$lib/stores/tokenCount';
  import { activeNameStyle, activeProfileFrame } from '$lib/stores/activeStyles';

  interface ShopItem {
    id: number;
    name: string;
    description: string;
    price: number;
    type: 'name_style' | 'profile_frame' | 'special_item';
    owned: boolean;
  }
  
    const shopItems: ShopItem[] = [
      { 
        id: 1, 
        name: 'Zlaté jméno', 
        description: 'Tvé jméno bude zářit zlatem', 
        price: 100, 
        type: 'name_style',
        owned: false 
      },
      { 
        id: 2, 
        name: 'Ohnivý rámeček', 
        description: 'Obklop svou profilovku plameny', 
        price: 150, 
        type: 'profile_frame',
        owned: false 
      },
      { 
        id: 3, 
        name: 'Ledový rámeček', 
        description: 'Zamrzlý rámeček pro tvou profilovku', 
        price: 150, 
        type: 'profile_frame',
        owned: false 
      },
      { 
        id: 4, 
        name: 'Duhové jméno', 
        description: 'Tvé jméno bude hrát všemi barvami', 
        price: 200, 
        type: 'name_style',
        owned: false 
      }
    ];
  
    let userTokens: number;
  let loading = true;
  let purchasedItems: any[] = [];

  $: shopItems.forEach(item => {
    item.owned = purchasedItems.some(pi => pi.id === item.id);
  });

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('token, purchased_items, active_name_style, active_profile_frame')
      .eq('id', user.id)
      .single();

    if (data) {
      userTokens = data.token;
      purchasedItems = data.purchased_items || [];
      activeNameStyle.set(data.active_name_style);
      activeProfileFrame.set(data.active_profile_frame);
    }

    loading = false;
  });

  async function buyItem(item: ShopItem) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (userTokens < item.price) {
      alert('Nemáš dostatek žetonů!');
      return;
    }

    const newPurchasedItem = {
      id: item.id,
      type: item.type,
      name: item.name,
      purchased_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_profiles')
      .update({
        token: userTokens - item.price,
        purchased_items: [...purchasedItems, newPurchasedItem]
      })
      .eq('id', user.id);

    if (error) {
      alert('Chyba při nákupu předmětu');
      return;
    }

    userTokens -= item.price;
    tokenStore.set(userTokens);
    purchasedItems = [...purchasedItems, newPurchasedItem];
    alert(`Úspěšně jsi zakoupil ${item.name}!`);
  }

  async function activateItem(item: ShopItem) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const column = item.type === 'name_style' ? 'active_name_style' : 'active_profile_frame';
    const store = item.type === 'name_style' ? activeNameStyle : activeProfileFrame;
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ [column]: item.id })
      .eq('id', user.id);

    if (error) {
      alert('Chyba při aktivaci předmětu');
      return;
    }

    store.set(item.id);
    alert(`${item.name} byl aktivován!`);
  }
</script>
  
  <div class="space-y-4">
    {#if loading}
      <div class="animate-pulse space-y-4">
        <div class="h-16 rounded-lg bg-gray-700"></div>
        <div class="h-16 rounded-lg bg-gray-700"></div>
      </div>
    {:else}
      <div class="mb-4 flex items-center space-x-2">
        <img src="/assets/gui/token.png" class="w-6 h-6" alt="Token" />
        <span class="text-xl font-bold text-white">{userTokens} žetonů</span>
      </div>
  
      {#each shopItems as item}
        <div class="backdrop-blur-sm border rounded-lg border-gray-700 bg-gray-800/50 p-4">
          <div class="mb-2 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">{item.name}</h3>
            {#if item.owned}
              <span class="rounded bg-blue-500 px-2 py-1 text-sm text-white">Zakoupeno</span>
            {:else}
              <span class="rounded bg-yellow-500 px-2 py-1 text-sm text-gray-800">K dispozici</span>
            {/if}
          </div>
          <p class="mb-3 text-gray-300">{item.description}</p>
  
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <img src="/assets/gui/token.png" class="w-5 h-5" alt="Token" />
              <span class="text-white">{item.price} žetonů</span>
            </div>
            {#if !item.owned}
              <button
                on:click={() => buyItem(item)}
                class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-white transition-all hover:from-purple-600 hover:to-purple-700 disabled:opacity-50"
                disabled={userTokens < item.price}
              >
                Koupit
              </button>
            {:else if item.type === 'name_style' || item.type === 'profile_frame'}
              <button
                on:click={() => activateItem(item)}
                class="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white transition-all hover:from-green-600 hover:to-green-700"
              >
                Aktivovat
              </button>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>