import { TramFront } from 'lucide-react';
import { VOYAGE } from '../data/site.js';
import Reveal from './Reveal.jsx';
import './TramLine.css';

// « Le Voyage » : les trois collections présentées comme les stations d'une ligne de tramway.
export default function TramLine() {
  return (
    <Reveal className="tramline">
      <div className="tramline__rail" aria-hidden="true">
        <span className="tramline__fill" />
        <span className="tramline__tram">
          <TramFront />
        </span>
      </div>
      <ol className="tramline__stations">
        {VOYAGE.collections.map((collection, index) => (
          <li key={collection.name} className="tramline__station" style={{ '--i': index }}>
            <span className="tramline__stop" aria-hidden="true" />
            <p className="tramline__index">Station {index + 1}</p>
            <h4 className="tramline__name">{collection.name}</h4>
            <p className="tramline__meaning">
              « {collection.sens} » <span>· {collection.langue}</span>
            </p>
            <p className="tramline__text">{collection.text}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
