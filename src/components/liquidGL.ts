/*
 * Liquid image renderer for the project showcase.
 * One full-screen triangle, two textures (current and next project) and a fragment shader that:
 * - wobbles the image with flowing noise, stronger with scroll velocity;
 * - adds a ripple lens around the pointer;
 * - reveals the next project from the bottom behind an organic wave edge;
 * - splits colour channels slightly when scrolling fast.
 * The owner drives it frame by frame (render()) only while the section is on screen.
 */

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() {
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uRes;
uniform float uT;
uniform float uTime;
uniform float uVel;
uniform vec2 uMouse;
uniform float uHover;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int k = 0; k < 4; k++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
vec2 cover(vec2 uv, vec2 size) {
  float rs = uRes.x / uRes.y, ri = size.x / size.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}
vec3 sampleRGB(sampler2D t, vec2 uv, vec2 size, float split) {
  vec2 c = cover(uv, size);
  return vec3(
    texture2D(t, c + vec2(split, 0.0)).r,
    texture2D(t, c).g,
    texture2D(t, c - vec2(split, 0.0)).b
  );
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float aspect = uRes.x / uRes.y;
  float vel = clamp(abs(uVel), 0.0, 1.0);

  // Flowing liquid wobble, stronger while scrolling
  float n1 = fbm(uv * 3.0 + vec2(0.0, uTime * 0.12));
  float n2 = fbm(uv * 3.0 + vec2(7.3, -uTime * 0.1));
  vec2 disp = (vec2(n1, n2) - 0.5) * (0.012 + vel * 0.16);

  // Ripple lens around the pointer
  vec2 m = (uv - uMouse) * vec2(aspect, 1.0);
  float d = length(m);
  float lens = exp(-d * d * 14.0) * uHover;
  disp += (m / max(d, 0.0001)) * lens * 0.018 * sin(d * 38.0 - uTime * 5.0);
  disp -= (uv - uMouse) * lens * 0.06;

  // Wave edge rising from the bottom to reveal the next project
  float r = (1.0 - uv.y) * 0.72 + fbm(uv * 2.4 + uTime * 0.05) * 0.28;
  float edge = uT * 1.36 - 0.18;
  float mask = 1.0 - smoothstep(edge - 0.06, edge + 0.06, r);
  float band = exp(-pow((r - edge) * 9.0, 2.0)) * step(0.001, uT) * step(uT, 0.999);
  disp += vec2(0.0, band * 0.07);

  float split = vel * 0.012 + band * 0.006;
  vec3 a = sampleRGB(uA, uv + disp + vec2(0.0, -uT * 0.06), uSizeA, split);
  vec3 b = sampleRGB(uB, uv + disp + vec2(0.0, (1.0 - uT) * 0.06), uSizeB, split);
  vec3 col = mix(a, b, mask);

  // Light edge on the wave crest, then a soft vignette for the captions
  col += band * 0.08;
  float v = smoothstep(1.15, 0.25, length((uv - 0.5) * vec2(1.0, 1.25)));
  col *= 0.62 + 0.38 * v;
  gl_FragColor = vec4(col, 1.0);
}`;

type Tex = { tex: WebGLTexture; w: number; h: number };

export type LiquidState = { a: number; b: number; t: number; time: number; vel: number; mx: number; my: number; hover: number };

export class LiquidGL {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private buf: WebGLBuffer;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private textures: (Tex | null)[];
  private canvas: HTMLCanvasElement;

  static create(canvas: HTMLCanvasElement, sources: string[], onReady: () => void): LiquidGL | null {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false });
    if (!gl) return null;
    try {
      return new LiquidGL(canvas, gl, sources, onReady);
    } catch {
      return null;
    }
  }

  private constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, sources: string[], onReady: () => void) {
    this.canvas = canvas;
    this.gl = gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    gl.useProgram(prog);
    this.prog = prog;

    this.buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    ['uA', 'uB', 'uSizeA', 'uSizeB', 'uRes', 'uT', 'uTime', 'uVel', 'uMouse', 'uHover'].forEach((k) => {
      this.u[k] = gl.getUniformLocation(prog, k);
    });
    gl.uniform1i(this.u.uA, 0);
    gl.uniform1i(this.u.uB, 1);

    this.textures = sources.map(() => null);
    let loaded = 0;
    sources.forEach((src, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        this.textures[i] = { tex, w: img.naturalWidth, h: img.naturalHeight };
        loaded += 1;
        if (loaded === sources.length) onReady();
      };
      img.src = src;
    });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
  }

  render(s: LiquidState) {
    const gl = this.gl;
    const A = this.textures[s.a];
    const B = this.textures[s.b] ?? A;
    if (!A || !B) return;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, B.tex);
    gl.uniform2f(this.u.uSizeA, A.w, A.h);
    gl.uniform2f(this.u.uSizeB, B.w, B.h);
    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.u.uT, s.t);
    gl.uniform1f(this.u.uTime, s.time);
    gl.uniform1f(this.u.uVel, s.vel);
    gl.uniform2f(this.u.uMouse, s.mx, s.my);
    gl.uniform1f(this.u.uHover, s.hover);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    const gl = this.gl;
    this.textures.forEach((t) => t && gl.deleteTexture(t.tex));
    gl.deleteBuffer(this.buf);
    gl.deleteProgram(this.prog);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
