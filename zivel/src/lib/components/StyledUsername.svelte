<script lang="ts">
  import { activeNameStyle } from '$lib/stores/activeStyles';

  export let username: string;
  
  $: activeStyle = $activeNameStyle;
  $: styleClass = getStyleClass(activeStyle);

  function getStyleClass(styleId: number | null): string {
    switch (styleId) {
      case 1: // Zlaté
        return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500';
      case 2: // Ledové
        return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-300 to-cyan-400 animate-ice';
      case 3: // Přírodní
        return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400';
      case 4: // Duhové
        return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-rainbow';
      case 5: // Ohnivé
        return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-fire';
      case 6: // Bleskové
        return 'font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-white animate-lightning';
      case 7: // Mystické
        return 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500';
      case 8: // Kamenné
        return 'font-bold text-gray-400 italic';
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