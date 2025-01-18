import { writable } from 'svelte/store';

export const unlockedElements = writable(['water', 'air', 'fire', 'earth']);
