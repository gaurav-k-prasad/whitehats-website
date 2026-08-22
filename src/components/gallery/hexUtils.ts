export interface HexCoordinate {
  q: number;
  r: number;
  x: number;
  y: number;
}

// Zoomed in dimensions for crisp, visible honeycomb tiles
export const HEX_RADIUS = 95; // Distance from center to vertex in px (zoomed in)
export const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS; // ~164.54px
export const HEX_HEIGHT = 2 * HEX_RADIUS; // 190px

// 6 Axial direction vectors for pointy-topped hexagon grids
const AXIAL_DIRECTIONS = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

/**
 * Generates an optimal spiral sequence of axial and pixel coordinates
 * for pointy-topped hexagons starting from origin (0, 0).
 */
export function generateHexSpiral(count: number, radius = HEX_RADIUS): HexCoordinate[] {
  if (count <= 0) return [];
  const coords: HexCoordinate[] = [
    {
      q: 0,
      r: 0,
      x: 0,
      y: 0,
    },
  ];

  let ring = 1;
  while (coords.length < count) {
    let q = -ring;
    let r = ring;

    for (let dir = 0; dir < 6; dir++) {
      const { q: dq, r: dr } = AXIAL_DIRECTIONS[dir];
      for (let step = 0; step < ring; step++) {
        if (coords.length >= count) break;
        q += dq;
        r += dr;
        // Pointy-topped hexagon pixel coordinate mapping
        const x = radius * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
        const y = radius * (1.5 * r);
        coords.push({ q, r, x, y });
      }
      if (coords.length >= count) break;
    }
    ring++;
  }

  return coords;
}
