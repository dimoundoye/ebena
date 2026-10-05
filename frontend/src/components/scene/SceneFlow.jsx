import { Children, cloneElement, isValidElement, useLayoutEffect, useRef } from 'react';
import './scene.css';

// Page en sections qui défilent normalement : chaque section arrive avec une transition
// (balayage, porte en arche, rideau…) qui avance au rythme du défilement, sans jamais le bloquer
// ni le corriger. Variables posées par SceneFlow :
// --r / --re : progression de l'arrivée de la section (linéaire / adoucie), de 0 à 1
// --q        : progression d'un élément [data-progress] dans l'écran (ex. le tram du Voyage)

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
// Hauteur d'écran à parcourir pour révéler entièrement une section (fraction de l'écran)
const SPAN = { default: 0.6, noir: 0.4, porte: 0.85, rideau: 0.75, cercle: 0.9 };
// Niveau de révélation à partir duquel la section est « arrivée » (contenu animé qui en dépend)
const SHOWN_AT = { default: 0.3, noir: 0.8, cercle: 0.5 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const easeOut = (t) => 1 - (1 - t) ** 3;

function SceneDecor({ type }) {
  switch (type) {
    case 'balayage':
      return <div className="scene__edge scene__edge--zigzag" aria-hidden="true" />;
    case 'drapeau':
      return (
        <div className="scene__edge scene__edge--benin" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      );
    case 'porte':
      return <div className="scene__door" aria-hidden="true" />;
    case 'rideau':
      return (
        <>
          <div className="scene__curtain scene__curtain--left" aria-hidden="true" />
          <div className="scene__curtain scene__curtain--right" aria-hidden="true" />
        </>
      );
    case 'cercle':
      return <div className="scene__ring" aria-hidden="true" />;
    default:
      return null;
  }
}

// Une section de la page. `tone` : fond de la section ; `base` (fourni par SceneFlow) : fond de la
// section précédente, visible tant que la transition n'a pas fini de révéler celle-ci.
export function Scene({ id, tone = 'ivoire', base = 'ivoire', transition, className = '', children }) {
  return (
    <section id={id} className={`scene scene--${tone} ${className}`.trim()} data-base={base} data-transition={transition}>
      <div className="scene__layer">
        <div className="scene__bg" aria-hidden="true" />
        <div className="scene__body">{children}</div>
      </div>
      <SceneDecor type={transition} />
    </section>
  );
}

export default function SceneFlow({ children }) {
  const rootRef = useRef(null);
  const scenes = Children.toArray(children).filter(isValidElement);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const sections = [...root.children].filter((element) => element.classList.contains('scene'));
    const progressItems = [...root.querySelectorAll('[data-progress]')];

    // Sans animation : tout est affiché d'emblée
    if (window.matchMedia(REDUCED_MOTION).matches) {
      sections.forEach((section) => {
        section.dataset.shown = '';
      });
      progressItems.forEach((item) => item.style.setProperty('--q', '1'));
      return undefined;
    }

    const near = new Set(sections);
    const nearItems = new Set(progressItems);
    let frame = 0;

    const update = (all = false) => {
      frame = 0;
      const vh = window.innerHeight;
      const targets = all ? sections : [...near];
      const items = all ? progressItems : [...nearItems];
      // Lectures d'abord, écritures ensuite : pas de recalcul de mise en page à chaque section
      const tops = targets.map((section) => section.getBoundingClientRect().top);
      const itemTops = items.map((item) => item.getBoundingClientRect().top);

      targets.forEach((section, index) => {
        const type = section.dataset.transition;
        const r = clamp((vh - tops[index]) / (vh * (SPAN[type] ?? SPAN.default)), 0, 1);
        section.style.setProperty('--r', r.toFixed(4));
        section.style.setProperty('--re', easeOut(r).toFixed(4));
        if (section.hasAttribute('data-revealing') !== (r > 0 && r < 1)) section.toggleAttribute('data-revealing');
        if (section.hasAttribute('data-revealed') !== r >= 1) section.toggleAttribute('data-revealed');
        if (r >= (SHOWN_AT[type] ?? SHOWN_AT.default) && !section.hasAttribute('data-shown')) section.dataset.shown = '';
      });

      items.forEach((item, index) => {
        const start = Number(item.dataset.start ?? 0.9);
        const end = Number(item.dataset.end ?? 0.4);
        const q = clamp((vh * start - itemTops[index]) / (vh * (start - end)), 0, 1);
        item.style.setProperty('--q', q.toFixed(4));
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => update());
    };

    // Seules les sections proches de l'écran sont recalculées au défilement
    const watch = (set) => (entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? set.add(entry.target) : set.delete(entry.target)));
      schedule();
    };
    const sectionObserver = new IntersectionObserver(watch(near), { rootMargin: '25% 0px 25% 0px' });
    const itemObserver = new IntersectionObserver(watch(nearItems), { rootMargin: '25% 0px 25% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
    progressItems.forEach((item) => itemObserver.observe(item));

    // Les éléments .build entrent en scène quand ils apparaissent à l'écran
    const buildObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.in = '';
          buildObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    root.querySelectorAll('.build').forEach((element) => buildObserver.observe(element));

    const onResize = () => update(true);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    root.dataset.ready = '';
    update(true);

    return () => {
      cancelAnimationFrame(frame);
      sectionObserver.disconnect();
      itemObserver.disconnect();
      buildObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      delete root.dataset.ready;
    };
  }, []);

  return (
    <div className="scenes" ref={rootRef}>
      {scenes.map((scene, index) =>
        cloneElement(scene, { key: scene.props.id, base: index === 0 ? 'ivoire' : (scenes[index - 1].props.tone ?? 'ivoire') })
      )}
    </div>
  );
}
