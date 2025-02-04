<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
  
    export let userId: string;
    export let username: string;
    
    let activeStyle: number | null = null;
  
    onMount(async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('active_name_style')
        .eq('id', userId)
        .single();
  
      if (data) {
        activeStyle = data.active_name_style;
      }
    });
  
    $: styleClass = getStyleClass(activeStyle);
  
    function getStyleClass(styleId: number | null): string {
      switch (styleId) {
        case 1: // Zlaté jméno
          return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500';
        case 4: // Duhové jméno
          return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-rainbow';
        default:
          return 'text-white';
      }
    }
  </script>
  
  <span class={styleClass}>{username}</span>
  
  <style>
    @keyframes rainbow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  
    .animate-rainbow {
      background-size: 200% auto;
      animation: rainbow 3s linear infinite;
    }
  </style>