import { writable } from 'svelte/store';

interface TrashZone {
  x: number;
  y: number;
  radius: number;
}

export const trashStore = writable<TrashZone | null>(null);