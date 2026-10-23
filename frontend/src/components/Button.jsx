import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// Bouton en pilule (format du site Mahwa) : au survol, le fond monte depuis le bas, le libellé
// défile vers le haut et la flèche de la pastille pivote.
// `to` (route interne), `href` (lien externe) ou bouton natif.
// Variantes : dark, gold, ghost, link (texte souligné). Tailles : sm, lg ; `block` = toute la largeur.
// `icon` remplace la flèche de la pastille (false pour s'en passer), `iconStart` la place avant le libellé.
export default function Button({
  to,
  href,
  variant = 'dark',
  size,
  block = false,
  icon: BadgeIcon = ArrowUpRight,
  iconStart = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size && `btn--${size}`,
    block && 'btn--block',
    !BadgeIcon && 'btn--text-only',
    iconStart && 'btn--icon-start',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span className="btn__label">
        <span className="btn__text">{children}</span>
      </span>
      {BadgeIcon && (
        <span className={BadgeIcon === ArrowUpRight ? 'btn__icon btn__icon--turn' : 'btn__icon'} aria-hidden="true">
          <BadgeIcon />
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
