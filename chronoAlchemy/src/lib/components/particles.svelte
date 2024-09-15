<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Přidání <div> do <body>
      const div = document.createElement('div');
    div.className = "absolute min-h-screen top-0 left-0 w-full z-[-1] opacity-70";
    div.innerHTML = `
      <div class="absolute inset-0">
        <div id="particles-js" class="absolute inset-0"></div>
      </div>
    `;
    document.body.appendChild(div);

    // Přidání <script> do <body> pro načtení particles.js konfigurace
    const scriptBody = document.createElement('script');
    scriptBody.textContent = `
			particlesJS.load("particles-js", "assets/particlesjs-config.json", function () {
				console.log("callback - particlesjs-config.js config loaded");
			});
    `;
    document.body.appendChild(scriptBody);
  });
</script>
