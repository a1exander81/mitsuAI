/**
 * Shared 3D-viewer helpers. The per-category primitive block models that used to live
 * here were removed when the viewer switched to generated part models (GLB).
 * The Piece types remain because the viewer can still render primitive pieces.
 */

/** Stable colour per diagram, shared by the 3D model and the diagram list. */
export const diagramColor = (index: number) => `hsl(${(index * 47 + 205) % 360}, 60%, 52%)`;

export type Vec3 = [number, number, number];
export type Axis = "x" | "y" | "z";

export type Piece = {
  /** Diagram index within the category, or -1 for context. */
  d: number;
  p: Vec3;
  /** Extra rotation (radians), applied on top of the axis orientation. */
  r?: Vec3;
} & (
  | { shape: "box"; size: Vec3 }
  | { shape: "cyl"; radius: number; length: number; axis: Axis }
  | { shape: "sphere"; radius: number }
  | { shape: "torus"; radius: number; tube: number; axis: Axis }
);
