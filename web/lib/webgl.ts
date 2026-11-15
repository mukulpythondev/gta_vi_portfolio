/**
 * Tiny WebGL helpers shared by the depth hero and the poster hover. Raw WebGL
 * instead of three.js: each effect is a single full-screen quad and a fragment
 * shader, so the whole thing costs a few KB instead of ~150 KB.
 */

const VERTEX = `
attribute vec2 p;
varying vec2 vUv;
void main() {
  // Row 0 of the texture is the top of the image (no UNPACK_FLIP_Y).
  vUv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

/** GLSL: maps the canvas UV to image UV like CSS object-fit: cover + object-position. */
export const COVER_GLSL = `
uniform vec2 uCanvas;
uniform vec2 uImage;
uniform vec2 uPos;
vec2 cover(vec2 uv) {
  float ca = uCanvas.x / uCanvas.y;
  float ia = uImage.x / uImage.y;
  vec2 size = ca > ia ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);
  return (1.0 - size) * uPos + uv * size;
}`;

export type Gl = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uniform: (name: string) => WebGLUniformLocation | null;
  texture: (unit: number, source: TexImageSource) => void;
  draw: () => void;
  dispose: () => void;
};

/** Compiles the shader onto a canvas. Returns null when WebGL isn't available. */
export function createGl(canvas: HTMLCanvasElement, fragment: string): Gl | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, `precision mediump float;\n${fragment}`);
  if (!vs || !fs) return null;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  const textures: WebGLTexture[] = [];
  return {
    gl,
    program,
    uniform: (name) => gl.getUniformLocation(program, name),
    texture(unit, source) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      if (!textures[unit]) {
        textures[unit] = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
        // Clamp + linear so non-power-of-two images work in WebGL 1.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      }
      gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    },
    draw() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      textures.forEach((texture) => gl.deleteTexture(texture));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

/** Sizes the canvas backing store to its CSS box (DPR capped for fill-rate). */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 1.5) {
  const dpr = Math.min(devicePixelRatio || 1, maxDpr);
  const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return [width, height] as const;
}

/** CSS object-position of an image as 0..1 fractions ("100% 30%" -> [1, 0.3]). */
export function objectPosition(image: HTMLImageElement): [number, number] {
  const keyword: Record<string, number> = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };
  const parts = getComputedStyle(image).objectPosition.split(/\s+/);
  const read = (value = "50%") => (value in keyword ? keyword[value] : parseFloat(value) / 100 || 0);
  return [read(parts[0]), read(parts[1])];
}

/** Resolves once the image has decoded pixels to upload. */
export function imageReady(image: HTMLImageElement) {
  return image.complete && image.naturalWidth
    ? Promise.resolve(image)
    : new Promise<HTMLImageElement>((resolve, reject) => {
        image.addEventListener("load", () => resolve(image), { once: true });
        image.addEventListener("error", reject, { once: true });
      });
}
