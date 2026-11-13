"use client";

import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box3, MeshStandardMaterial, Vector3, type Mesh } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Button } from "@/components/ui/button";
import type { CatalogDiagram } from "@/data/catalog";
import { diagramColor, type Axis, type Piece, type Vec3 } from "@/data/models";

interface Props {
  pieces: Piece[];
  diagrams: CatalogDiagram[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  /** When set, this generated GLB is shown instead of the schematic category model. */
  modelUrl?: string | null;
  /** Keep the GLB's own materials instead of the flat diagram colour. */
  ownMaterials?: boolean;
}

const VIEW_DIR = new Vector3(1, 0.75, 1.25).normalize();
const FOV = 40;

const CYL_ROT: Record<Axis, Vec3> = { x: [0, 0, Math.PI / 2], y: [0, 0, 0], z: [Math.PI / 2, 0, 0] };
const TORUS_ROT: Record<Axis, Vec3> = { x: [0, Math.PI / 2, 0], y: [Math.PI / 2, 0, 0], z: [0, 0, 0] };

function pieceRotation(piece: Piece): Vec3 {
  const base: Vec3 =
    piece.shape === "cyl" ? CYL_ROT[piece.axis] : piece.shape === "torus" ? TORUS_ROT[piece.axis] : [0, 0, 0];
  const extra = piece.r ?? [0, 0, 0];
  return [base[0] + extra[0], base[1] + extra[1], base[2] + extra[2]];
}

function PieceGeometry({ piece }: { piece: Piece }) {
  switch (piece.shape) {
    case "box":
      return <boxGeometry args={piece.size} />;
    case "cyl":
      return <cylinderGeometry args={[piece.radius, piece.radius, piece.length, 28]} />;
    case "sphere":
      return <sphereGeometry args={[piece.radius, 24, 16]} />;
    case "torus":
      return <torusGeometry args={[piece.radius, piece.tube, 14, 40]} />;
  }
}

/** Centre + radius of a sphere that roughly encloses the model. */
function useBounds(pieces: Piece[]) {
  return useMemo(() => {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (const piece of pieces) {
      const reach =
        piece.shape === "box"
          ? Math.max(...piece.size) / 2
          : piece.shape === "cyl"
            ? Math.max(piece.radius, piece.length / 2)
            : piece.shape === "torus"
              ? piece.radius + piece.tube
              : piece.radius;
      for (let i = 0; i < 3; i++) {
        min[i] = Math.min(min[i], piece.p[i] - reach);
        max[i] = Math.max(max[i], piece.p[i] + reach);
      }
    }
    const center = new Vector3((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);
    const radius = Math.max(1, new Vector3(max[0] - min[0], max[1] - min[1], max[2] - min[2]).length() / 2);
    return { center, radius };
  }, [pieces]);
}

// Models are scaled so their bounding-box diagonal is MODEL_SIZE. Sizing by the diagonal (not the
// longest side) keeps compact parts like pumps from overflowing the view while long parts still fill it.
const MODEL_SIZE = 3;
const MODEL_BOUNDS = { center: new Vector3(0, 0, 0), radius: (MODEL_SIZE / 2) * 1.45 };

/** A generated GLB, recentred, scaled to a fixed size and given one flat material. */
function GeneratedModel({ url, color, ownMaterials }: { url: string; color: string; ownMaterials?: boolean }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const scale = MODEL_SIZE / Math.max(size.length(), 1e-6);
    clone.scale.setScalar(scale);
    clone.position.copy(box.getCenter(new Vector3())).multiplyScalar(-scale);
    if (!ownMaterials) {
      const material = new MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.25 });
      clone.traverse((o) => {
        if ((o as Mesh).isMesh) (o as Mesh).material = material;
      });
    }
    return clone;
  }, [scene, color, ownMaterials]);
  return <primitive object={object} />;
}

interface RigHandle {
  zoom: (factor: number) => void;
  reset: () => void;
}

function CameraRig({
  center,
  radius,
  handle,
}: {
  center: Vector3;
  radius: number;
  handle: React.RefObject<RigHandle | null>;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  // Distance at which the bounding sphere fits both vertically and horizontally.
  const fitDistance = (radius / Math.sin((FOV * Math.PI) / 360) / Math.min(1, aspect)) * 0.72;
  const minDistance = radius * 0.35;
  const maxDistance = fitDistance * 2.5;

  const reset = useCallback(() => {
    camera.position.copy(center).addScaledVector(VIEW_DIR, fitDistance);
    controls.current?.target.copy(center);
    controls.current?.update();
  }, [camera, center, fitDistance]);

  useEffect(reset, [reset]);

  useEffect(() => {
    handle.current = {
      reset,
      zoom: (factor) => {
        const c = controls.current;
        if (!c) return;
        const offset = camera.position.clone().sub(c.target);
        offset.setLength(Math.min(maxDistance, Math.max(minDistance, offset.length() * factor)));
        camera.position.copy(c.target).add(offset);
        c.update();
      },
    };
  }, [camera, handle, maxDistance, minDistance, reset]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      minDistance={minDistance}
      maxDistance={maxDistance}
      zoomSpeed={0.9}
    />
  );
}

export default function CategoryViewer3D({ pieces, diagrams, selectedIndex, onSelect, modelUrl, ownMaterials }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const rig = useRef<RigHandle | null>(null);
  const pieceBounds = useBounds(pieces);
  const { center, radius } = modelUrl ? MODEL_BOUNDS : pieceBounds;

  const labelled = modelUrl ? null : (hovered ?? selectedIndex);

  const onPieceClick = (e: ThreeEvent<MouseEvent>, d: number) => {
    e.stopPropagation();
    if (e.delta > 6) return; // was a drag/orbit, not a tap
    onSelect(d === selectedIndex ? null : d);
  };

  return (
    <div className="relative h-[52dvh] min-h-80 w-full touch-none overflow-hidden rounded-xl border bg-muted/40 lg:h-[68dvh]">
      <Canvas
        camera={{ fov: FOV, near: 0.1, far: 200 }}
        dpr={[1, 2]}
        onPointerMissed={(e) => e.type === "click" && !modelUrl && onSelect(null)}
        aria-label="3D model — drag to rotate, pinch or scroll to zoom, tap a part to select it"
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[6, 10, 6]} intensity={1.6} />
        <directionalLight position={[-6, 4, -8]} intensity={0.6} />
        <hemisphereLight args={["#ffffff", "#9ca3af", 0.9]} />
        {/* Soft studio reflections so metallic (PBR) part models don't render black. Built from
            Lightformers, so no HDR file is downloaded. */}
        {modelUrl && (
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
            <Lightformer intensity={1.2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
            <Lightformer intensity={1.2} position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
            <Lightformer intensity={0.6} position={[0, 1, -5]} scale={[10, 4, 1]} />
          </Environment>
        )}

        {modelUrl && selectedIndex !== null && (
          <Suspense fallback={null}>
            <GeneratedModel url={modelUrl} color={diagramColor(selectedIndex)} ownMaterials={ownMaterials} />
          </Suspense>
        )}

        {(modelUrl ? [] : pieces).map((piece, i) => {
          const ghost = piece.d < 0;
          const active = piece.d === selectedIndex;
          const hot = piece.d === hovered;
          const dimmed = !ghost && selectedIndex !== null && !active;
          return (
            <mesh
              key={i}
              position={piece.p}
              rotation={pieceRotation(piece)}
              raycast={ghost ? () => null : undefined}
              onClick={ghost ? undefined : (e) => onPieceClick(e, piece.d)}
              onPointerOver={
                ghost
                  ? undefined
                  : (e) => {
                      e.stopPropagation();
                      setHovered(piece.d);
                      document.body.style.cursor = "pointer";
                    }
              }
              onPointerOut={
                ghost
                  ? undefined
                  : () => {
                      setHovered((h) => (h === piece.d ? null : h));
                      document.body.style.cursor = "";
                    }
              }
            >
              <PieceGeometry piece={piece} />
              <meshStandardMaterial
                color={ghost ? "#94a3b8" : diagramColor(piece.d)}
                emissive={active ? "#ffffff" : hot ? "#ffffff" : "#000000"}
                emissiveIntensity={active ? 0.35 : hot ? 0.2 : 0}
                roughness={0.55}
                metalness={0.15}
                transparent={ghost || dimmed}
                opacity={ghost ? 0.12 : dimmed ? 0.3 : 1}
                depthWrite={!ghost}
              />
            </mesh>
          );
        })}


        <gridHelper args={[14, 14, "#94a3b8", "#cbd5e1"]} position={[center.x, center.y - radius * 0.62, center.z]} />
        <CameraRig center={center} radius={radius} handle={rig} />
      </Canvas>

      {/* Name of the hovered (or selected) diagram. A plain overlay rather than drei's <Html>,
          which creates its own React root and warns when React remounts it in development. */}
      {!modelUrl && labelled !== null && diagrams[labelled] && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute top-2 left-2 rounded-md border bg-background/95 px-2 py-1 text-xs font-medium shadow-sm"
        >
          {diagrams[labelled].name}
        </div>
      )}

      <div className="absolute right-2 bottom-2 flex flex-col gap-1.5">
        <Button size="icon" variant="secondary" aria-label="Zoom in" onClick={() => rig.current?.zoom(0.75)}>
          <Plus />
        </Button>
        <Button size="icon" variant="secondary" aria-label="Zoom out" onClick={() => rig.current?.zoom(1 / 0.75)}>
          <Minus />
        </Button>
        <Button size="icon" variant="secondary" aria-label="Reset view" onClick={() => rig.current?.reset()}>
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
