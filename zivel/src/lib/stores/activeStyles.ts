import { writable } from 'svelte/store';

export const activeNameStyle = writable<number | null>(null);
export const activeProfileFrame = writable<number | null>(null);