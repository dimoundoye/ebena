import {
  Armchair,
  Crown,
  Cpu,
  FileText,
  Gem,
  Handshake,
  IdCard,
  Landmark,
  Megaphone,
  Mic,
  Music,
  Sparkles,
  Store,
  TramFront,
  UserRound,
  Users,
  Video,
  Wheat,
} from 'lucide-react';

// Icônes référencées par leur nom dans data/site.js (import explicite pour garder le bundle léger).
const ICONS = {
  Armchair,
  Crown,
  Cpu,
  FileText,
  Gem,
  Handshake,
  IdCard,
  Landmark,
  Megaphone,
  Mic,
  Music,
  Sparkles,
  Store,
  TramFront,
  UserRound,
  Users,
  Video,
  Wheat,
};

export default function Icon({ name, ...props }) {
  const Component = ICONS[name] || Sparkles;
  return <Component aria-hidden="true" {...props} />;
}
