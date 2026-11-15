/**
 * The hackathon trophy shelf, built in code with three.js (no model files):
 * a gold winner's cup, a silver merit cup, two finalist medals on stands, a
 * bronze finalist star and a judge's gavel, each on a neon-rimmed pedestal.
 * Loaded with a dynamic import only when the shelf scrolls near the screen.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type TrophyKind = "cup-gold" | "cup-silver" | "medal-gold" | "medal-cyan" | "star" | "gavel";
export type TrophyPiece = { kind: TrophyKind; face: string; sub: string; accent: string };
export type ShelfOptions = {
  pieces: TrophyPiece[];
  animate: boolean;
  onHover?: (index: number | null) => void;
  onSelect?: (index: number) => void;
};
export type Shelf3D = { highlight: (index: number | null) => void; dispose: () => void };

const GOLD = new THREE.MeshStandardMaterial({ color: 0xffc24a, metalness: 1, roughness: 0.2 });
const SILVER = new THREE.MeshStandardMaterial({ color: 0xdfe4f0, metalness: 1, roughness: 0.18 });
const BRONZE = new THREE.MeshStandardMaterial({ color: 0xd88a4a, metalness: 1, roughness: 0.28 });
const MARBLE = new THREE.MeshStandardMaterial({ color: 0x1a1230, metalness: 0.2, roughness: 0.35 });
const WOOD = new THREE.MeshStandardMaterial({ color: 0x5a2e1c, metalness: 0.1, roughness: 0.55 });

/** Text painted on a canvas, for medal faces and plaques. */
function textTexture(
  face: string,
  sub: string,
  { size = 512, round = false, bg = "#2a1d0a", fg = "#ffe3a0", ring = "#ffcf66" } = {},
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = round ? size : size / 4;
  const c = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  if (round) {
    const g = c.createRadialGradient(w * 0.4, h * 0.35, w * 0.05, w / 2, h / 2, w / 2);
    g.addColorStop(0, ring);
    g.addColorStop(1, bg);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = fg;
    c.lineWidth = w * 0.025;
    c.beginPath();
    c.arc(w / 2, h / 2, w * 0.4, 0, Math.PI * 2);
    c.stroke();
  } else {
    c.fillStyle = bg;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = ring;
    c.lineWidth = h * 0.06;
    c.strokeRect(h * 0.08, h * 0.08, w - h * 0.16, h - h * 0.16);
  }
  c.fillStyle = fg;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.shadowColor = "rgba(0,0,0,0.55)";
  c.shadowOffsetY = w * 0.008;
  c.font = `900 ${round ? w * 0.26 : h * 0.5}px "Arial Black", Impact, sans-serif`;
  c.fillText(face, w / 2, round ? h * 0.47 : h * 0.5, w * 0.8);
  if (sub && round) {
    c.font = `700 ${w * 0.075}px Arial, sans-serif`;
    c.fillText(sub, w / 2, h * 0.7, w * 0.62);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function cup(metal: THREE.Material, piece: TrophyPiece, scale: number) {
  const group = new THREE.Group();
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.2, 0.72), MARBLE);
  plinth.position.y = 0.1;
  const step = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.52), metal);
  step.position.y = 0.26;
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.15),
    new THREE.MeshStandardMaterial({
      map: textTexture(piece.face, "", { bg: "#120b22", fg: "#fff2c7", ring: piece.accent }),
      metalness: 0.3,
      roughness: 0.4,
    }),
  );
  plaque.position.set(0, 0.1, 0.361);
  const profile = [
    [0, 0], [0.13, 0], [0.13, 0.05], [0.05, 0.11], [0.045, 0.36], [0.11, 0.43],
    [0.33, 0.56], [0.43, 0.8], [0.46, 1.05], [0.48, 1.13], [0.44, 1.13], [0.41, 0.84],
    [0.31, 0.62], [0, 0.6],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), metal);
  body.position.y = 0.32;
  const handleGeometry = new THREE.TorusGeometry(0.18, 0.035, 14, 36, Math.PI);
  for (const side of [-1, 1]) {
    const handle = new THREE.Mesh(handleGeometry, metal);
    handle.rotation.z = (-side * Math.PI) / 2;
    handle.position.set(side * 0.42, 1.18, 0);
    group.add(handle);
  }
  group.add(plinth, step, plaque, body);
  group.scale.setScalar(scale);
  return group;
}

function medal(face: THREE.Material, rim: THREE.Material, ribbon: string, piece: TrophyPiece) {
  const group = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.7, 12), SILVER);
  post.position.y = 0.85;
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.56, 12), SILVER);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = 1.7;
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.06, 32), MARBLE);
  foot.position.y = 0.03;
  const ribbonMaterial = new THREE.MeshStandardMaterial({ color: ribbon, roughness: 0.6, side: THREE.DoubleSide });
  for (const side of [-1, 1]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.62, 0.012), ribbonMaterial);
    strip.position.set(side * 0.1, 1.42, 0.06);
    strip.rotation.z = side * 0.32;
    group.add(strip);
  }
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.07, 64), [
    rim,
    new THREE.MeshStandardMaterial({
      map: textTexture(piece.face, piece.sub, { round: true, ...faceColours(piece.kind) }),
      metalness: 0.75,
      roughness: 0.3,
    }),
    rim,
  ]);
  disc.rotation.x = Math.PI / 2;
  disc.rotation.y = Math.PI;
  disc.position.set(0, 0.92, 0.07);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.03, 12, 64), rim);
  ring.position.copy(disc.position);
  group.add(post, bar, foot, disc, ring);
  return group;
}

function faceColours(kind: TrophyKind) {
  return kind === "medal-cyan"
    ? { bg: "#0f3340", fg: "#e6fdff", ring: "#7ee8f5" }
    : { bg: "#5a3a08", fg: "#fff3cf", ring: "#ffd36b" };
}

function star(piece: TrophyPiece) {
  const group = new THREE.Group();
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.2 : 0.46;
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    if (i) shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 3,
  });
  geometry.center();
  const body = new THREE.Mesh(geometry, BRONZE);
  body.position.y = 0.95;
  const badge = new THREE.Mesh(
    new THREE.CircleGeometry(0.17, 40),
    new THREE.MeshStandardMaterial({
      map: textTexture(piece.face, "", { round: true, size: 256, bg: "#3a1c08", fg: "#ffe2c2", ring: "#f0a060" }),
      metalness: 0.6,
      roughness: 0.35,
    }),
  );
  badge.position.set(0, 0.95, 0.095);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.5, 16), BRONZE);
  stem.position.y = 0.25;
  group.add(stem, body, badge);
  return group;
}

function gavel() {
  const group = new THREE.Group();
  const block = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.14, 40), WOOD);
  block.position.y = 0.07;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.345, 0.345, 0.03, 40), GOLD);
  band.position.y = 0.1;
  const tool = new THREE.Group();
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 32), WOOD);
  head.rotation.z = Math.PI / 2;
  for (const side of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.05, 32), GOLD);
    cap.rotation.z = Math.PI / 2;
    cap.position.x = side * 0.2;
    tool.add(cap);
  }
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.85, 16), WOOD);
  handle.position.y = -0.48;
  tool.add(head, handle);
  // Raised mid-strike above the sound block.
  tool.position.set(0.05, 1.05, 0);
  tool.rotation.z = 0.5;
  group.add(block, band, tool);
  return group;
}

function build(piece: TrophyPiece) {
  switch (piece.kind) {
    case "cup-gold":
      return cup(GOLD, piece, 1.05);
    case "cup-silver":
      return cup(SILVER, piece, 0.9);
    case "medal-gold":
      return medal(GOLD, GOLD, "#ff2e88", piece);
    case "medal-cyan":
      return medal(SILVER, SILVER, "#18c8ff", piece);
    case "star":
      return star(piece);
    case "gavel":
      return gavel();
  }
}

export function mountShelf(canvas: HTMLCanvasElement, options: ShelfOptions): Shelf3D {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.add(new THREE.HemisphereLight(0x8a7cff, 0x120820, 0.6));
  const key = new THREE.DirectionalLight(0xfff0d8, 2.2);
  key.position.set(2, 5, 6);
  const pink = new THREE.PointLight(0xff2e88, 30, 14);
  pink.position.set(-5, 2.5, 3);
  const cyan = new THREE.PointLight(0x18f0ff, 30, 14);
  cyan.position.set(5, 2.5, 3);
  scene.add(key, pink, cyan);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const shelf = new THREE.Group();
  scene.add(shelf);

  const pedestal = new THREE.CylinderGeometry(0.58, 0.64, 0.28, 48);
  const rimGeometry = new THREE.TorusGeometry(0.58, 0.02, 8, 64);
  const items = options.pieces.map((piece, index) => {
    const stand = new THREE.Group();
    const base = new THREE.Mesh(pedestal, MARBLE);
    base.position.y = -0.14;
    const rim = new THREE.Mesh(
      rimGeometry,
      new THREE.MeshBasicMaterial({ color: piece.accent, toneMapped: false }),
    );
    rim.rotation.x = Math.PI / 2;
    const object = build(piece);
    const spinner = new THREE.Group();
    spinner.add(object);
    stand.add(base, rim, spinner);
    stand.traverse((child) => (child.userData.piece = index));
    shelf.add(stand);
    return { stand, spinner, angle: -0.5 + index * 0.35, lift: 0, grow: options.animate ? 0 : 1 };
  });

  let rows = 1;
  const layout = () => {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    rows = camera.aspect < 1.2 ? 2 : 1;
    const perRow = Math.ceil(items.length / rows);
    const gap = rows === 2 ? 1.5 : 1.3;
    items.forEach(({ stand }, index) => {
      const row = Math.floor(index / perRow);
      const column = index % perRow;
      const count = Math.min(perRow, items.length - row * perRow);
      stand.position.set((column - (count - 1) / 2) * gap, rows === 2 ? (row ? -1.3 : 1.3) : 0, row * -0.4);
    });
    // Frame the tallest pieces (~2.1 units incl. medal stands) with a little air.
    const spanW = perRow * gap + 0.1;
    const spanH = rows === 2 ? 5.1 : 2.6;
    const centre = 0.95;
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(spanH / 2 / tan, spanW / 2 / (tan * camera.aspect)) * 1.02;
    camera.position.set(0, centre + distance * 0.1, distance);
    camera.lookAt(0, centre, 0);
    camera.updateProjectionMatrix();
    draw();
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(9, 9);
  let hovered: number | null = null;
  let external: number | null = null;
  const focus = () => hovered ?? external;
  let tiltX = 0, tiltY = 0;
  const pick = () => {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(shelf.children, true)[0];
    const index = hit ? (hit.object.userData.piece as number) : null;
    if (index !== hovered) {
      hovered = index;
      canvas.style.cursor = index === null ? "" : "pointer";
      options.onHover?.(index);
    }
  };
  const move = (event: PointerEvent) => {
    const box = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
    tiltX = pointer.x;
    tiltY = pointer.y;
    pick();
    wake();
  };
  const leave = () => {
    pointer.set(9, 9);
    tiltX = tiltY = 0;
    pick();
    wake();
  };
  const click = (event: PointerEvent) => {
    move(event);
    if (hovered !== null) options.onSelect?.(hovered);
  };

  let frame = 0;
  let last = performance.now();
  let visible = true;
  let started = performance.now();
  function draw() {
    renderer.render(scene, camera);
  }
  const tick = (now: number) => {
    frame = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    let busy = false;
    items.forEach((item, index) => {
      const target = focus() === index ? 1 : 0;
      item.lift += (target - item.lift) * Math.min(1, dt * 8);
      item.angle += dt * (0.35 + item.lift * 2.4);
      const delay = index * 0.12;
      item.grow = Math.min(1, Math.max(0, ((now - started) / 1000 - delay) / 0.9));
      const grow = 1 - Math.pow(1 - item.grow, 3);
      item.spinner.rotation.y = item.angle;
      item.spinner.position.y = item.lift * 0.18 + (1 - grow) * -0.6;
      item.spinner.scale.setScalar(Math.max(0.001, grow));
      if (item.grow < 1) busy = true;
    });
    shelf.rotation.y += (tiltX * 0.18 - shelf.rotation.y) * Math.min(1, dt * 4);
    shelf.rotation.x += (-tiltY * 0.05 - shelf.rotation.x) * Math.min(1, dt * 4);
    draw();
    if (options.animate || busy) wake();
  };
  function wake() {
    if (!options.animate) {
      // Still mode: no spinning, just redraw on demand.
      items.forEach((item, index) => {
        item.spinner.rotation.y = item.angle;
        item.spinner.position.y = focus() === index ? 0.12 : 0;
        item.spinner.scale.setScalar(1);
      });
      draw();
      return;
    }
    if (!frame && visible && !document.hidden) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    const was = visible;
    visible = entry.isIntersecting;
    if (visible && !was && items.some((item) => item.grow < 1)) started = performance.now();
    wake();
  });
  const sizer = new ResizeObserver(layout);
  observer.observe(canvas);
  sizer.observe(canvas);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerleave", leave);
  canvas.addEventListener("click", click as EventListener);
  document.addEventListener("visibilitychange", wake);
  layout();
  wake();

  const dispose = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    sizer.disconnect();
    canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("click", click as EventListener);
    document.removeEventListener("visibilitychange", wake);
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const material of [child.material].flat()) {
          (material as THREE.MeshStandardMaterial).map?.dispose();
          if (![GOLD, SILVER, BRONZE, MARBLE, WOOD].includes(material)) material.dispose();
        }
      }
    });
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
  return {
    highlight(index) {
      external = index;
      wake();
    },
    dispose,
  };
}
