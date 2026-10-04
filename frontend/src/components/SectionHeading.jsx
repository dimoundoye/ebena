import Reveal from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, intro, align = 'left', as: Heading = 'h2', className = '', children }) {
  const centered = align === 'center';
  return (
    <div className={`section-heading ${centered ? 'section-heading--center' : ''} ${className}`.trim()}>
      {eyebrow && (
        <Reveal as="p" className={`eyebrow ${centered ? 'eyebrow--center' : ''}`}>
          {eyebrow}
        </Reveal>
      )}
      <Reveal as={Heading} className="h2" delay={0.08}>
        {title}
      </Reveal>
      {intro && (
        <Reveal as="p" className="lead" delay={0.16}>
          {intro}
        </Reveal>
      )}
      {children}
    </div>
  );
}
