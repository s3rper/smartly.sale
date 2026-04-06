import { useRef, useCallback } from 'react';

/**
 * 3D perspective card tilt effect — same as aegixcyber.com service cards.
 * Tracks mouse position within the card and applies ±maxTilt° rotation.
 */
export function useCardTilt(maxTilt = 7) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform  = `perspective(600px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) translateZ(6px)`;
      el.style.transition = 'transform 0.05s linear';
    },
    [maxTilt]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform  = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    el.style.transition = 'transform 0.4s ease-out';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
