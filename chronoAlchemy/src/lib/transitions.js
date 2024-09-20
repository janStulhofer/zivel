import { goto } from '$app/navigation';

export function setupViewTransition() {
	if (!document.startViewTransition) {
		return;
	}

	window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url);

		if (location.origin !== toUrl.origin) return;

		event.intercept({
			async handler() {
				const response = await fetch(toUrl.pathname);
				const text = await response.text();
				document.startViewTransition(() => {
					document.body.innerHTML = text;
					document.documentElement.scrollTop = 0;
				});
			}
		});
	});
}

export function navigateWithTransition(href, direction) {
	if (!document.startViewTransition) {
		goto(href);
		return;
	}

	const transition = document.startViewTransition(() => {
		goto(href);
	});

	transition.ready.then(() => {
		const root = document.documentElement;
		root.classList.add(direction);

		transition.finished.then(() => {
			root.classList.remove(direction);
		});
	});
}

//Errory se objevuji, jelikoz View Transition API je experimentlani funkce (nicemu nevadi)
