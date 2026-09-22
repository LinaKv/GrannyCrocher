import { useLayoutEffect, useRef, useState } from 'react';

const EDGE_MARGIN = 8;

interface ClampedPosition {
  left: number;
  top: number;
}

// Anchors an absolutely/fixed-positioned element at (x, y) but keeps it fully
// inside the viewport. The real size is only known after render, so we
// measure and re-clamp in a layout effect (runs before paint — no flicker).
export function useClampedPosition<T extends HTMLElement>(x: number, y: number) {
  const ref = useRef<T>(null);
  const [position, setPosition] = useState<ClampedPosition>({ left: x, top: y });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const { width, height } = el.getBoundingClientRect();
    const maxLeft = Math.max(EDGE_MARGIN, window.innerWidth - width - EDGE_MARGIN);
    const maxTop = Math.max(EDGE_MARGIN, window.innerHeight - height - EDGE_MARGIN);
    setPosition({
      left: Math.min(Math.max(x, EDGE_MARGIN), maxLeft),
      top: Math.min(Math.max(y, EDGE_MARGIN), maxTop),
    });
  }, [x, y]);

  return { ref, style: position };
}
