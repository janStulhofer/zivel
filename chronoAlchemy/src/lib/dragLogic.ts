import { writable } from 'svelte/store';
import { seznamKombinaci } from './seznamKombinaci';
import { seznamPrvku } from './seznamPrvku';
import { supabase } from './supabaseClient';
import { unlockedElements } from './stores/odemcenePrvky';
import { xpStore } from './stores/xpCount';
import { trashStore } from './stores/trashStore';
import { get } from 'svelte/store';

// INTERFACE
// ========================

/*
  id - Unikátní identifikátor prvku
  type - Typ prvku (např. 'voda', 'oheň')
  width, height - Rozměry prvku v pixelech
  x, y - Pozice prvku na herní ploše
  pevná struktura objektu - co musí obsahovat
 */
interface GameElement {
	id: number;
	type: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

/*
export - rozšiřuje scope do ostatních souborů
 writable - vytvoří store ve SK
<GameElement[]> - store bude obsahovat pole
([]) - inicializace prázdného pole
*/
export const elements = writable<GameElement[]>([]);

// DATABÁZE
// ====================

/**
Aktualizuje odemčené prvky a XP uživatele v databázi
@param newElement - Nový prvek k odemčení
 */
async function updateUnlockedElements(newElement: string) {
	try {
		// Získání aktuálního přihlášeného uživatele
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user) {
			// Načtení aktuálního stavu odemčených prvků a XP
			const { data: data, error: fetchError } = await supabase
				.from('user_profiles')
				.select('unlocked_elements, xp')
				.eq('id', user.id)
				.single();
			if (fetchError) {
				console.error('Error fetching current elements:', fetchError);
				return;
			}

			// Příprava pole odemčených prvků
			const currentElements = Array.isArray(data?.unlocked_elements) ? data.unlocked_elements : [];

			// Kontrola duplicity před přidáním nového prvku
			if (!currentElements.includes(newElement)) {
				const updatedElements = [...currentElements, newElement];
				const newXp = (data.xp || 0) + 100; // Přidání XP za odemčení nového prvku

				// Aktualizace dat v databázi
				const { error: updateError } = await supabase
					.from('user_profiles')
					.update({ unlocked_elements: updatedElements, xp: newXp })
					.eq('id', user.id);

				if (!updateError) {
					// Synchronizace s lokálními úložišti
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

// KOLIZE A INTERAKCE PRVKŮ
// =======================

// Detekuje kolizi dvou prvků pomocí AABB (Axis-Aligned Bounding Box)
function checkCollision(element1: GameElement, element2: GameElement): boolean {
	return (
		element1.x < element2.x + element2.width && // 0 < 30 + 50 = true
		element1.x + element1.width > element2.x && // 0 + 50 > 30 = true
		element1.y < element2.y + element2.height && // 0 < 30 + 50 = true
		element1.y + element1.height > element2.y // 0 + 50 > 30 = true
	); // V příkladě by funkce vrátila true
}

/*
 Kontroluje zda je prvek v dosahu koše pro smazání
 trash - Objekt koše s pozicí a poloměrem
 true pokud je prvek v oblasti koše
 */
function checkTrashCollision(element: GameElement, trash: TrashZone): boolean {
	const gameArea = document.querySelector('[aria-label="Herní plocha pro kombinování prvků"]');
	if (!gameArea) return false;

	// Přepočet pozic na absolutní souřadnice obrazovky
	const gameRect = gameArea.getBoundingClientRect(); // Funkce pro přesné zjištění objektu
	const elementScreenX = gameRect.left + element.x + element.width / 2; // Poloměry
	const elementScreenY = gameRect.top + element.y + element.height / 2;

	// Výpočet vzdálenosti od středu koše - pyth. věta
	const distance = Math.sqrt(
		Math.pow(elementScreenX - trash.x, 2) + Math.pow(elementScreenY - trash.y, 2)
	);

	return distance < trash.radius;
}

// KOMBINAČNÍ LOGIKA
// =================

/*
 Generuje unikátní klíč pro kombinaci dvou prvků
 type1, type2 - Typy kombinovaných prvků
 vrací klíč ve formátu "typ1_typ2" (seřazeno abecedně)
 */
function generateKey(type1: string, type2: string): string {
	return [type1, type2].sort().join('_');							//VYMYSLET POPŘEMÝŠLET
}

// Hledá výslednou kombinaci
function getCombination(type1: string, type2: string): string | null {
	const key1 = generateKey(type1, type2); // Abecedně seřazený klíč
	const key2 = [type1, type2].join('_');  // Původní pořadí
  
	// Zkusíme obě varianty
	return seznamKombinaci.get(key1) || seznamKombinaci.get(key2) || null;
  }

// DRAG & DROP SYSTEM
// ==================

/*
 Svelte akce pro implementaci drag & drop funkcionality
 node - HTML element ke kterému se akce váže
 */
export function dragElement(node: HTMLElement) {
	let x = 0, // Počáteční pozice elementu
		y = 0,
		dragX = 0, // Pozice myši při začátku tažení
		dragY = 0;

	// Handler pro stisknutí tlačítka myši
	function handleMousedown(event: MouseEvent) {
		const elementId = node.getAttribute('data-id'); // Získá ID elementu z atributu
		if (elementId) {
			// Aktualizace store s elementy
			elements.update((els) => {
				// parametr els slouží jako dočasná proměnná pro elements - (pole objektů GameElement)
				// Konkrétní element podle ID
				const element = els.find((e) => e.id === parseInt(elementId));
				if (element) {
					// Počáteční pozice pro výpočet posunu
					x = element.x;
					y = element.y;
					dragX = event.clientX;
					dragY = event.clientY;
				}
				return els;
			});
		}

		// EvenetListener pro sledování pohybu a puštění myši
		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}

	// Handler pro pohyb myši během přetahování
	function handleMousemove(event: MouseEvent) {
		const elementId = node.getAttribute('data-id');
		if (elementId) {
			// Rozdíl mezi počáteční a aktuálmí pozici myši
			const dx = event.clientX - dragX;
			const dy = event.clientY - dragY;
			// Aktualizace pozice v element store
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

	// Handler pro puštění tlačítka myši
	function handleMouseup() {
		const elementId = node.getAttribute('data-id');
		if (elementId) {
			elements.update((els) => {
				// Najde přetahovaný element
				const movedElement = els.find((e) => e.id === parseInt(elementId));
				if (movedElement) {
					// Kontrola kolize s košem
					const trash = get(trashStore);
					if (trash && checkTrashCollision(movedElement, trash)) {
						// Animace mazání a odstranění elementu
						node.classList.add('deleting');
						setTimeout(() => {
							elements.update((current) => current.filter((e) => e.id !== movedElement.id));
						}, 300);
						return els;
					}
					// Kontrola kolize s ostatními elementy
					els.forEach((target) => {
						if (target.id !== movedElement.id && checkCollision(movedElement, target)) {
							// Pokus o kombinaci elementů
							const combination = getCombination(movedElement.type, target.type);
							
							if (combination) {
								// Vytvoření nového elementu z kombinace
								const newElement: GameElement = {
									id: Date.now(),
									type: combination,
									// Pozice uprostřed mezi původními elementy
									x: (movedElement.x + target.x) / 2,
									y: (movedElement.y + target.y) / 2,
									width: 50,
									height: 50
								};

								// Aktualizace odemčených elementů
								updateUnlockedElements(combination);

								// Odstranění původních elementů a přidání nového
								els = els.filter((e) => e.id !== movedElement.id && e.id !== target.id);
								els.push(newElement);
							}
						}
					});
				}
				return els;
			});
		}

		// Odstranění event listenerů po ukončení tažení
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
