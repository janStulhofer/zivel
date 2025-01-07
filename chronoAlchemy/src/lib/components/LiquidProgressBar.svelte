<script>
	export let maxXP = 100; //Vytvořit pole s úrovněnmi, z databaze pak tahat kolik je potřeba pro další lvl.
	export let xp = 0;  //Z databaze brat aktualni hodonotu jakou hrac ma.

	$: progress = Math.min((xp / maxXP) * 100, 100);  //'$' znamená, že se jedná o reaktivní deklaraci => automaticky se prepocitava kdyz se zmeni xp nebo maxXP..
	//(První závorkou počítám poměr), který převedu na procenta. funkce Math.min ..., 100 zamezuje aby výsledek nepřekročil 100% 
</script>

<div class="relative h-8 w-full overflow-hidden rounded-full bg-gray-200">
	<div
		class="absolute left-0 top-0 h-full rounded-full bg-green-500 transition-all duration-1000 ease-out"
		style="width: {progress}%;"
	></div>
	<div
		class="absolute left-0 top-0 flex h-full w-full items-center justify-center text-sm font-bold text-black"
	>
		{xp}/{maxXP} XP
	</div>
</div>
