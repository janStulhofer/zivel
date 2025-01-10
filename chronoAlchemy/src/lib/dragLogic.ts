import { writable } from 'svelte/store';

interface GameElement {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const elements = writable<GameElement[]>([]);

//Kontrola kolize
function checkCollision(element1: GameElement, element2: GameElement): boolean {
  return (
    element1.x < element2.x + element2.width &&
    element1.x + element1.width > element2.x &&
    element1.y < element2.y + element2.height &&
    element1.y + element1.height > element2.y
  );
}

//Kombinace
function getCombination(type1: string, type2: string): string | null {
  //Zkouska prvku
  if (type1 === 'water' && type2 === 'fire' || type1 === 'fire' && type2 === 'water') {
    return 'steam';
  }
  return null;
}

export function dragElement(node: HTMLElement) {
  let x = 0, y = 0, dragX = 0, dragY = 0;

  function handleMousedown(event: MouseEvent) {
    const elementId = node.getAttribute('data-id');
    if (elementId) {
      elements.update(els => {
        const element = els.find(e => e.id === parseInt(elementId));
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

      elements.update(els => {
        const elementIndex = els.findIndex(e => e.id === parseInt(elementId));
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
      elements.update(els => {
        const movedElement = els.find(e => e.id === parseInt(elementId));
        if (movedElement) {
          els.forEach(target => {
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

                els = els.filter(e => e.id !== movedElement.id && e.id !== target.id);
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
