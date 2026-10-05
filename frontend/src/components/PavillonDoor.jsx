import Icon from './Icon.jsx';
import './PavillonDoor.css';

// Porte en arche aux couleurs d'un pavillon, avec son icône et son numéro en filigrane.
export default function PavillonDoor({ pavillon, className = '' }) {
  return (
    <div className={`arch-frame ${className}`.trim()} aria-hidden="true">
      <div className={`pav-door pav-tone--${pavillon.slug}`}>
        <span className="pav-door__watermark">{pavillon.numero}</span>
        <span className="pav-door__icon">
          <Icon name={pavillon.icon} />
        </span>
      </div>
    </div>
  );
}
