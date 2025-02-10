import { writable } from 'svelte/store';
import { seznamKombinaci } from './seznamKombinaci';
import { seznamPrvku } from './seznamPrvku';
import { supabase } from './supabaseClient';
import { unlockedElements } from './stores/odemcenePrvky';
import { xpStore } from './stores/xpCount';
import { trashStore } from './stores/trashStore';
import { get } from 'svelte/store';

interface GameElement {
	id: number;
	type: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export const elements = writable<GameElement[]>([]);

async function updateUnlockedElements(newElement: string) {
	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user) {
			const { data: data, error: fetchError } = await supabase
				.from('user_profiles')
				.select('unlocked_elements, xp')
				.eq('id', user.id)
				.single();
			if (fetchError) {
				console.error('Error fetching current elements:', fetchError);
				return;
			}

			const currentElements = Array.isArray(data?.unlocked_elements) ? data.unlocked_elements : [];

			if (!currentElements.includes(newElement)) {
				const updatedElements = [...currentElements, newElement];
				const newXp = (data.xp || 0) + 100;

				const { error: updateError } = await supabase
					.from('user_profiles')
					.update({ unlocked_elements: updatedElements, xp: newXp })
					.eq('id', user.id);

				if (!updateError) {
					unlockedElements.set(updatedElements);
					xpStore.set(newXp);
					console.log('Successfully updated elements:', updatedElements);
				} else {
					console.error('Error updating unlocked elements:', updateError);
				}
			}
		}
	} catch (error) {
		console.error('Error in updateUnlockedElements:', error);
	}
}

//Kontrola kolize
function checkCollision(element1: GameElement, element2: GameElement): boolean {
	return (
		element1.x < element2.x + element2.width &&
		element1.x + element1.width > element2.x &&
		element1.y < element2.y + element2.height &&
		element1.y + element1.height > element2.y
	);
}

function checkTrashCollision(element: GameElement, trash: TrashZone): boolean {
	const gameArea = document.querySelector('[aria-label="Herní plocha pro kombinování prvků"]');
	if (!gameArea) return false;
	const gameRect = gameArea.getBoundingClientRect();

	const elementScreenX = gameRect.left + element.x + element.width / 2;
	const elementScreenY = gameRect.top + element.y + element.height / 2;

	const distance = Math.sqrt(
		Math.pow(elementScreenX - trash.x, 2) + Math.pow(elementScreenY - trash.y, 2)
	);

	return distance < trash.radius;
}

//Generování klíče podle kterého se bude následně porcházet pole kombinací
function generateKey(type1: string, type2: string): string {
	return [type1, type2].sort().join('_');
}

//Kombinace
function getCombination(type1: string, type2: string): string | null {
	const key = generateKey(type1, type2);
	return seznamKombinaci.get(key) || null;
}

export function dragElement(node: HTMLElement) {
	let x = 0,
		y = 0,
		dragX = 0,
		dragY = 0;

	function handleMousedown(event: MouseEvent) {
		const elementId = node.getAttribute('data-id');
		if (elementId) {
			elements.update((els) => {
				const element = els.find((e) => e.id === parseInt(elementId));
				if (element) {
					x = element.x;
					y = element.y;
					dragX = event.clientX;
					dragY = event.clientY;
				}
				return els;
			});
		}

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}

	function handleMousemove(event: MouseEvent) {
		const elementId = node.getAttribute('data-id');
		if (elementId) {
			const dx = event.clientX - dragX;
			const dy = event.clientY - dragY;
			elements.update((els) => {
				const elementIndex = els.findIndex((e) => e.id === parseInt(elementId));
				if (elementIndex !== -1) {
					els[elementIndex].x = x + dx;
					els[elementIndex].y = y + dy;
				}
				return els;
			});
		}
	}

	function handleMouseup() {
		const elementId = node.getAttribute('data-id');
		if (elementId) {
			elements.update((els) => {
				const movedElement = els.find((e) => e.id === parseInt(elementId));
				if (movedElement) {
					const trash = get(trashStore);
					if (trash && checkTrashCollision(movedElement, trash)) {
						node.classList.add('deleting');
						setTimeout(() => {
							elements.update((current) => current.filter((e) => e.id !== movedElement.id));
						}, 300);
						return els;
					}
					els.forEach((target) => {
						if (target.id !== movedElement.id && checkCollision(movedElement, target)) {
							const combination = getCombination(movedElement.type, target.type);
							if (combination) {
								const newElement: GameElement = {
									id: Date.now(),
									type: combination,
									x: (movedElement.x + target.x) / 2,
									y: (movedElement.y + target.y) / 2,
									width: 50,
									height: 50
								};

								updateUnlockedElements(combination);

								els = els.filter((e) => e.id !== movedElement.id && e.id !== target.id);
								els.push(newElement);
							}
						}
					});
				}
				return els;
			});
		}

		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
	}

	node.addEventListener('mousedown', handleMousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}
