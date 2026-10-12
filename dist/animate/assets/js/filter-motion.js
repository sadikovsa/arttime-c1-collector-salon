/* Semantic state updates immediately; bounded visual continuity follows. */
(() => {
  'use strict';
  window.ArtTimeFilterMotion = {
    create(cards, options = {}) {
      const grid = cards[0]?.parentElement;
      if (!grid) return {capture: () => null, play: () => {}};
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const effects = new Set();
      let overlay = null, generation = 0;
      const allowed = () => !reduced.matches && !options.isPaused?.() && !!Element.prototype.animate;
      const settle = () => {
        generation++;
        effects.forEach(a => a.cancel()); effects.clear();
        overlay?.remove(); overlay = null; grid.dataset.filterMotion = 'idle';
      };
      const capture = () => {
        const before = new Map();
        cards.forEach(card => {if (!card.hidden) before.set(card, {rect: card.getBoundingClientRect(), opacity: getComputedStyle(card).opacity});});
        settle();
        return allowed() ? before : null;
      };
      const play = before => {
        if (!before || !allowed()) {settle(); return;}
        const version = generation;
        const bounds = grid.getBoundingClientRect();
        const done = () => {if (version === generation && !effects.size) {overlay?.remove(); overlay = null; grid.dataset.filterMotion = 'idle';}};
        const run = (node, frames, duration, delay = 0, cleanup = () => {}) => {
          const a = node.animate(frames, {duration, delay, easing:'cubic-bezier(.16,1,.3,1)', fill:'both'});
          effects.add(a); grid.dataset.filterMotion = 'running';
          a.onfinish = () => {effects.delete(a); a.cancel(); cleanup(); done();};
        };
        let incoming = 0;
        cards.forEach(card => {
          const old = before.get(card);
          if (card.hidden) {
            if (!old || old.rect.bottom < 0 || old.rect.top > innerHeight) return;
            if (!overlay) {overlay = document.createElement('div'); overlay.className = 'filter-exits'; overlay.inert = true; overlay.setAttribute('aria-hidden','true'); grid.append(overlay);}
            const ghost = card.cloneNode(true); [ghost,...ghost.querySelectorAll('*')].forEach(n => {n.removeAttribute('id'); [...n.attributes].filter(a=>a.name.startsWith('data-')).forEach(a=>n.removeAttribute(a.name));}); ghost.hidden = false;
            ghost.style.cssText = `position:absolute;left:${old.rect.left-bounds.left}px;top:${old.rect.top-bounds.top}px;width:${old.rect.width}px;height:${old.rect.height}px;margin:0;pointer-events:none`;
            overlay.append(ghost);
            run(ghost, [{opacity:old.opacity,transform:'translate(0,0) scale(1)'},{opacity:0,transform:'translate(-8px,-12px) scale(.98)'}],190,0,()=>ghost.remove());
          } else {
            const next = card.getBoundingClientRect();
            if (old && old.rect.bottom >= 0 && old.rect.top <= innerHeight) {
              const dx = old.rect.left-next.left, dy = old.rect.top-next.top;
              if (Math.abs(dx)+Math.abs(dy)>1 || Number(old.opacity)<.99) run(card,[{transform:`translate(${dx}px,${dy}px)`,opacity:old.opacity},{transform:'translate(0,0)',opacity:1}],360);
            } else if (next.bottom >= 0 && next.top <= innerHeight+100) {
              run(card,[{opacity:0,transform:'translateY(24px) scale(.975)'},{opacity:1,transform:'translateY(0) scale(1)'}],400,(incoming++%4)*25);
            }
          }
        });
        done();
      };
      reduced.addEventListener('change',settle);
      addEventListener('resize',settle,{passive:true});
      document.querySelector('[data-motion-toggle]')?.addEventListener('click',()=>queueMicrotask(()=>{if (!allowed()) settle();}));
      return {capture, play};
    }
  };
})();
