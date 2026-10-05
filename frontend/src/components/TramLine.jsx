import { TramFront } from 'lucide-react';
import { VOYAGE } from '../data/site.js';
import './TramLine.css';

// « Le Voyage » : les trois collections présentées comme les stations d'une ligne de tramway.
// Dans une page en scènes (SceneFlow), le tram avance au fil du défilement (--q) et allume
// chaque station à son passage ; ailleurs, la ligne s'affiche parcourue.
export default function TramLine({ details = true }) {
  const last = VOYAGE.collections.length - 1;
  return (
    <div className="tramline" data-progress data-start="0.85" data-end="0.4">
      <div className="tramline__rail" aria-hidden="true">
        <span className="tramline__fill" />
        <span className="tramline__tram">
          <TramFront />
        </span>
      </div>
      <ol className="tramline__stations">
        {VOYAGE.collections.map((collection, index) => (
          <li key={collection.name} className="tramline__station" style={{ '--at': index / last }}>
            <span className="tramline__stop" aria-hidden="true" />
            <span className="tramline__index">Station {index + 1}</span>
            <span className="tramline__name">{collection.name}</span>
            <span className="tramline__meaning">
              « {collection.sens} » <span>· {collection.langue}</span>
            </span>
            {details && <span className="tramline__text">{collection.text}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
