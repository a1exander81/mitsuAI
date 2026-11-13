// Builds scripted (code-modelled) part GLBs into public/models/.
// Run with: node scripts/build-models.mjs
//
// Parts are modelled from three.js geometry at roughly real-world size (metres).
// They are typical shapes for the part type, not measured copies of CK2A parts.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { mergeGeometries, mergeVertices, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "models");
const V2 = (x, y) => new THREE.Vector2(x, y);
const CREASE = THREE.MathUtils.degToRad(35);

// ---------- helpers ----------

/** Position-only, non-indexed copy so differently built geometries can be merged. */
function plain(geometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", g.getAttribute("position").clone());
  return out;
}

const merge = (geometries) => mergeGeometries(geometries.map(plain));

/** Smooth across shallow angles, keep hard edges crisp, then index. */
function finish(geometry) {
  return mergeVertices(toCreasedNormals(plain(geometry), CREASE));
}

/** Round the corners of an open polyline; the first and last points stay sharp. */
function fillet(points, radius, steps = 5) {
  const out = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const [prev, cur, next] = [points[i - 1], points[i], points[i + 1]];
    const r = Math.min(radius, cur.distanceTo(prev) / 2.2, cur.distanceTo(next) / 2.2);
    const a = cur.clone().add(prev.clone().sub(cur).setLength(r));
    const b = cur.clone().add(next.clone().sub(cur).setLength(r));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      // Quadratic Bézier a → cur → b
      out.push(
        a.clone().multiplyScalar((1 - t) ** 2).add(cur.clone().multiplyScalar(2 * t * (1 - t))).add(b.clone().multiplyScalar(t ** 2)),
      );
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

/**
 * Open-topped prism: `profile` is a polyline in the x/y plane whose first and
 * last points sit on the open edge; it is extruded to z = ±halfWidth.
 */
function openPrism(profile, halfWidth) {
  const positions = [];
  const quad = (a, b, c, d) => positions.push(...a, ...b, ...c, ...a, ...c, ...d);
  for (let i = 0; i < profile.length - 1; i++) {
    const [p, q] = [profile[i], profile[i + 1]];
    quad([p.x, p.y, -halfWidth], [q.x, q.y, -halfWidth], [q.x, q.y, halfWidth], [p.x, p.y, halfWidth]);
  }
  for (const z of [-halfWidth, halfWidth]) {
    for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(profile, [])) {
      positions.push(profile[a].x, profile[a].y, z, profile[b].x, profile[b].y, z, profile[c].x, profile[c].y, z);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return g;
}

function circleHole(cx, cy, r) {
  const path = new THREE.Path();
  path.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return path;
}

function roundedRect(shape, hx, hy, r) {
  shape.moveTo(-hx + r, -hy);
  shape.lineTo(hx - r, -hy);
  shape.absarc(hx - r, -hy + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(hx, hy - r);
  shape.absarc(hx - r, hy - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-hx + r, hy);
  shape.absarc(-hx + r, hy - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hx, -hy + r);
  shape.absarc(-hx + r, -hy + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

// ---------- minimal GLB writer ----------

function writeGlb(file, parts) {
  const json = {
    asset: { version: "2.0", generator: "LancerParts scripts/build-models.mjs" },
    scene: 0,
    scenes: [{ nodes: parts.map((_, i) => i) }],
    nodes: parts.map((p, i) => ({ name: p.name, mesh: i })),
    meshes: [],
    materials: [],
    accessors: [],
    bufferViews: [],
    buffers: [],
  };
  const chunks = [];
  let offset = 0;
  const addView = (typed, target) => {
    const bytes = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, target });
    chunks.push(padded);
    offset += padded.length;
    return json.bufferViews.length - 1;
  };
  let triangles = 0;

  parts.forEach((part, i) => {
    const g = part.geometry;
    g.computeBoundingBox();
    const pos = g.getAttribute("position");
    const nor = g.getAttribute("normal");
    const idx = g.index;
    triangles += idx.count / 3;
    const base = json.accessors.length;
    json.accessors.push(
      {
        bufferView: addView(new Float32Array(pos.array), 34962),
        componentType: 5126,
        count: pos.count,
        type: "VEC3",
        min: g.boundingBox.min.toArray(),
        max: g.boundingBox.max.toArray(),
      },
      { bufferView: addView(new Float32Array(nor.array), 34962), componentType: 5126, count: nor.count, type: "VEC3" },
      { bufferView: addView(new Uint32Array(idx.array), 34963), componentType: 5125, count: idx.count, type: "SCALAR" },
    );
    json.materials.push({
      name: part.name,
      doubleSided: true,
      pbrMetallicRoughness: {
        baseColorFactor: [...part.color, 1],
        metallicFactor: part.metallic,
        roughnessFactor: part.roughness,
      },
    });
    json.meshes.push({
      name: part.name,
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, material: i }],
    });
  });

  const bin = Buffer.concat(chunks);
  json.buffers.push({ byteLength: bin.length });
  let jsonBytes = Buffer.from(JSON.stringify(json));
  jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc((4 - (jsonBytes.length % 4)) % 4, 0x20)]);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonBytes.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  const glb = Buffer.concat([header, chunkHeader(jsonBytes.length, 0x4e4f534a), jsonBytes, chunkHeader(bin.length, 0x004e4942), bin]);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, file), glb);
  console.log(`${file}: ${parts.length} parts, ${triangles} triangles, ${(glb.length / 1024).toFixed(0)} KB`);
}

// ---------- wheel & tire (13-inch steel wheel, 175/70R13-sized tire) ----------

function buildWheel() {
  // Lathe profiles are (radius, axial position); the axis is turned to X at the end.
  const tireProfile = [
    V2(0.168, -0.07), V2(0.185, -0.082), V2(0.215, -0.0875), V2(0.245, -0.085), V2(0.268, -0.076), V2(0.28, -0.066),
    V2(0.2875, -0.058),
    // three circumferential tread grooves
    V2(0.2875, -0.034), V2(0.2805, -0.034), V2(0.2805, -0.026), V2(0.2875, -0.026),
    V2(0.2875, -0.004), V2(0.2805, -0.004), V2(0.2805, 0.004), V2(0.2875, 0.004),
    V2(0.2875, 0.026), V2(0.2805, 0.026), V2(0.2805, 0.034), V2(0.2875, 0.034),
    V2(0.2875, 0.058),
    V2(0.28, 0.066), V2(0.268, 0.076), V2(0.245, 0.085), V2(0.215, 0.0875), V2(0.185, 0.082), V2(0.168, 0.07),
    V2(0.168, -0.07),
  ];
  const rimProfile = [
    V2(0.162, -0.075), V2(0.178, -0.075), V2(0.178, -0.068), V2(0.167, -0.068), V2(0.167, -0.03), V2(0.155, -0.02),
    V2(0.155, 0.02), V2(0.167, 0.03), V2(0.167, 0.068), V2(0.178, 0.068), V2(0.178, 0.075), V2(0.162, 0.075),
    V2(0.162, 0.03), V2(0.15, 0.02), V2(0.15, -0.02), V2(0.162, -0.03), V2(0.162, -0.075),
  ];

  // Wheel disc: flat plate with centre bore, 4 lug holes (100 mm PCD) and 12 vent holes.
  const disc = new THREE.Shape();
  disc.absarc(0, 0, 0.1625, 0, Math.PI * 2, false);
  disc.holes.push(circleHole(0, 0, 0.028));
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    disc.holes.push(circleHole(0.05 * Math.cos(a), 0.05 * Math.sin(a), 0.0065));
  }
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    disc.holes.push(circleHole(0.118 * Math.cos(a), 0.118 * Math.sin(a), 0.013));
  }
  const discGeo = new THREE.ExtrudeGeometry(disc, { depth: 0.005, bevelEnabled: false, curveSegments: 48 });
  discGeo.rotateX(-Math.PI / 2).translate(0, 0.045, 0);
  // Raised hub mounting face around the lug holes.
  const hub = new THREE.Shape();
  hub.absarc(0, 0, 0.075, 0, Math.PI * 2, false);
  hub.holes.push(circleHole(0, 0, 0.028));
  const hubGeo = new THREE.ExtrudeGeometry(hub, { depth: 0.006, bevelEnabled: false, curveSegments: 48 });
  hubGeo.rotateX(-Math.PI / 2).translate(0, 0.05, 0);

  const nuts = [];
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    nuts.push(new THREE.CylinderGeometry(0.0095, 0.0105, 0.018, 6).translate(0.05 * Math.cos(a), 0.065, 0.05 * Math.sin(a)));
  }
  const cap = merge([
    new THREE.CylinderGeometry(0.03, 0.032, 0.014, 40).translate(0, 0.063, 0),
    new THREE.CylinderGeometry(0.02, 0.03, 0.006, 40).translate(0, 0.073, 0),
  ]);

  const turn = (g) => finish(g).rotateZ(-Math.PI / 2);
  return [
    { name: "tire", geometry: turn(new THREE.LatheGeometry(tireProfile, 96)), color: [0.03, 0.03, 0.035], metallic: 0, roughness: 0.92 },
    { name: "rim", geometry: turn(merge([new THREE.LatheGeometry(rimProfile, 96), discGeo, hubGeo])), color: [0.5, 0.52, 0.55], metallic: 0.45, roughness: 0.45 },
    { name: "lug-nuts", geometry: turn(merge(nuts)), color: [0.82, 0.82, 0.84], metallic: 0.4, roughness: 0.3 },
    { name: "centre-cap", geometry: turn(cap), color: [0.12, 0.12, 0.13], metallic: 0.3, roughness: 0.5 },
  ];
}

// ---------- oil pan (stamped steel sump with flange and drain plug) ----------

function buildOilPan() {
  const halfWidth = 0.085;
  const wall = 0.004;
  // Side profile, front (deep sump) at -x, open edge along y = 0.
  const outer = fillet(
    [V2(-0.2, 0), V2(-0.2, -0.09), V2(-0.17, -0.135), V2(0.03, -0.135), V2(0.07, -0.065), V2(0.2, -0.055), V2(0.2, 0)],
    0.022,
  );
  const inner = fillet(
    [V2(-0.196, 0), V2(-0.196, -0.089), V2(-0.168, -0.131), V2(0.028, -0.131), V2(0.067, -0.061), V2(0.196, -0.051), V2(0.196, 0)],
    0.02,
  );
  const shell = merge([openPrism(outer, halfWidth), openPrism(inner, halfWidth - wall)]);

  // Mounting flange with bolt holes, lying on y = 0.
  const flange = roundedRect(new THREE.Shape(), 0.216, 0.101, 0.014);
  const opening = roundedRect(new THREE.Path(), 0.196, halfWidth - wall, 0.004);
  flange.holes.push(opening);
  for (let i = 0; i < 8; i++) {
    const x = -0.2 + (i * 0.4) / 7;
    flange.holes.push(circleHole(x, 0.0925, 0.0035), circleHole(x, -0.0925, 0.0035));
  }
  for (const z of [-0.045, 0.045]) flange.holes.push(circleHole(0.2075, z, 0.0035), circleHole(-0.2075, z, 0.0035));
  const flangeGeo = new THREE.ExtrudeGeometry(flange, { depth: 0.003, bevelEnabled: false, curveSegments: 12 });
  flangeGeo.rotateX(Math.PI / 2).translate(0, 0.003, 0);

  // Drain plug on the side of the sump: boss, washer and hex head.
  const plugAt = (g, dz) => g.rotateX(Math.PI / 2).translate(-0.06, -0.112, halfWidth + dz);
  const boss = plugAt(new THREE.CylinderGeometry(0.016, 0.018, 0.006, 32), 0.003);
  const plug = merge([
    plugAt(new THREE.CylinderGeometry(0.0135, 0.0135, 0.0016, 32), 0.0068),
    plugAt(new THREE.CylinderGeometry(0.0098, 0.0098, 0.008, 6), 0.0116),
  ]);

  return [
    { name: "oil-pan", geometry: finish(merge([shell, flangeGeo, boss])), color: [0.2, 0.21, 0.23], metallic: 0.35, roughness: 0.5 },
    { name: "drain-plug", geometry: finish(plug), color: [0.78, 0.78, 0.8], metallic: 0.4, roughness: 0.3 },
  ];
}

writeGlb("wheel-tire-cover.scripted.glb", buildWheel());
writeGlb("oil-pan.scripted.glb", buildOilPan());
