<script>
  	import { navigateWithTransition } from '$lib/transitions';
</script>

<header class="p-4 text-white">
    <div class="flex flex-col items-center lg:grid lg:grid-cols-3 lg:items-center">
      <div class="lg:col-start-2 lg:justify-self-center">
        <img src="/assets/logo2.png" class="w-[300px] lg:w-[500px] invert" alt="Chrono Alchemy" />
      </div>
      <nav class="mt-4 lg:mt-0 lg:col-start-3 lg:justify-self-end">
        <ul class="flex flex-wrap justify-center lg:justify-end">
          <li class="m-2">
            <button class="text-shadow-glow-xl rounded-2xl border border-white bg-slate-950 px-3 py-1 text-sm text-white transition duration-300 ease-in-out hover:shadow-3xl hover:invert lg:px-4 lg:py-2 lg:text-2xl font-PTSerif"
            on:click={() => navigateWithTransition('/registrace', 'slide-right')}
            >
              Registrace
            </button>
          </li>
          <li class="m-2">
            <button class="text-shadow-glow-xl rounded-2xl border border-white bg-slate-950 px-3 py-1 text-sm text-white transition duration-300 ease-in-out hover:shadow-3xl hover:invert lg:px-4 lg:py-2 lg:text-2xl font-PTSerif"
            on:click={() => navigateWithTransition('/login', 'slide-right')}
            >
              Přihlásit se
            </button>
          </li>
          <li class="m-2">
            <button class="text-shadow-glow-xl rounded-2xl border border-white bg-slate-950 px-3 py-1 text-sm text-white transition duration-300 ease-in-out hover:shadow-3xl hover:invert lg:px-4 lg:py-2 lg:text-2xl font-PTSerif"
            >
              O stránce
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>

<style>
</style>
