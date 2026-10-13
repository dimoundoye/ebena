import { useLayoutEffect, useRef, useState } from 'react';

// Fait apparaître son contenu en fondu lorsqu'il entre dans l'écran. Ce qui est déjà à l'écran à
// l'arrivée sur la page (en-tête de page…) s'affiche tout de suite, sans animation.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  // hidden → shown (fondu à l'entrée dans l'écran) ; instant : visible dès l'arrivée, sans fondu
  const [state, setState] = useState('hidden');

  // Mesuré avant l'affichage : rien ne s'efface puis ne réapparaît à l'arrivée
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const { top, bottom } = element.getBoundingClientRect();
    if (top < window.innerHeight && bottom > 0) {
      setState('instant');
      return undefined;
    }
    if (!('IntersectionObserver' in window)) {
      setState('shown');
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const classes = ['reveal', state !== 'hidden' && 'is-in', state === 'instant' && 'reveal--instant', className];

  return (
    <Tag ref={ref} className={classes.filter(Boolean).join(' ')} style={{ '--delay': `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
