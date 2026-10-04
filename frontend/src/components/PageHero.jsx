import Reveal from './Reveal.jsx';
import { CowriePair } from './Cowrie.jsx';
import './PageHero.css';

// En-tête des pages intérieures : titre éditorial, motif en losanges et frise dorée.
export default function PageHero({ eyebrow, title, intro, children, aside }) {
  return (
    <section className={`page-hero ${aside ? 'page-hero--with-aside' : ''}`}>
      <div className="page-hero__lattice" aria-hidden="true" />
      <div className="page-hero__halo" aria-hidden="true" />
      <div className="page-hero__band band-zigzag-v" aria-hidden="true" />
      <div className="container page-hero__inner">
        <div className="page-hero__text">
          <Reveal as="p" className="eyebrow">
            {eyebrow}
          </Reveal>
          <Reveal as="h1" className="display page-hero__title" delay={0.08}>
            {title}
          </Reveal>
          {intro && (
            <Reveal as="p" className="lead page-hero__intro" delay={0.16}>
              {intro}
            </Reveal>
          )}
          {children && <Reveal delay={0.24}>{children}</Reveal>}
        </div>
        {aside ? (
          <Reveal className="page-hero__aside" delay={0.2}>
            {aside}
          </Reveal>
        ) : (
          <CowriePair className="page-hero__cowries" />
        )}
      </div>
    </section>
  );
}
