// Fenêtre en arche posée au bas de l'écran (.arch-window, voir PageDoor.css) : fermée, elle ne
// laisse rien voir ; ouverte, elle dépasse l'écran. Son liseré doré n'apparaît qu'en mouvement.
const RIM_OFF = '0 0 0 0px rgba(230, 178, 90, 0), 0 0 0 200vmax #1e0a06';
const RIM_ON = '0 0 0 2px rgba(230, 178, 90, 1), 0 0 0 200vmax #1e0a06';

export const ARCH_CLOSED = { width: '0px', height: '0px', boxShadow: RIM_OFF };
export const ARCH_OPEN = { width: '110vw', height: 'calc(110vh + 55vw)', boxShadow: RIM_ON };

export const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_IN = 'cubic-bezier(0.7, 0, 0.84, 0)';
export const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
