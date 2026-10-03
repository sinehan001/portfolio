export const BOLT_EVENT = "doom-bolt";

/** Coordinates are viewport (client) pixels. Without `fromX/fromY` the bolt falls from the sky. */
export type BoltDetail = { x: number; y: number; fromX?: number; fromY?: number };

export function strike(detail: BoltDetail) {
  window.dispatchEvent(new CustomEvent<BoltDetail>(BOLT_EVENT, { detail }));
}

export function readAccent(): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#3ddc84";
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function readVar(name: string, fallback: string): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
