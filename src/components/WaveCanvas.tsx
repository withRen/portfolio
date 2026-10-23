'use client';

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D t;
uniform vec2 r;
uniform float time;
uniform float amp;
void main() {
  vec2 uv = vec2(v.x, 1.0 - v.y);
  uv = (uv - 0.5) * r + 0.5;
  float lower = smoothstep(0.30, 0.72, uv.y) + 0.25;
  float wave = sin(uv.x * 7.0 + time * 1.1 + uv.y * 5.0)
             + 0.55 * sin(uv.x * 15.0 - time * 0.9 + uv.y * 11.0);
  uv.y += amp * 0.022 * wave * lower;
  uv.x += amp * 0.01 * sin(uv.y * 20.0 + time * 1.4) * lower;
  gl_FragColor = texture2D(t, uv);
}`;

const INTRO_TAU = 1100; // ms, decay of the wave on first load
const SCROLL_TAU = 420; // ms, decay of the wave after scrolling
const STOP_BELOW = 0.02;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

/**
 * Draws the image through a small wave-distortion shader.
 * Renders on demand only: during the intro and while scroll energy decays,
 * paused when off-screen, never a continuous loop. The static <img> stays
 * underneath as fallback (no WebGL, reduced motion, context lost).
 */
export default function WaveCanvas({ src }: { src: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One oversized triangle covers the viewport
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(program, 'r');
    const uTime = gl.getUniformLocation(program, 'time');
    const uAmp = gl.getUniformLocation(program, 'amp');

    const tex = gl.createTexture();
    let ready = false;
    let imgAspect = 16 / 9;
    let energy = 0;
    let introStart = 0;
    let timeAcc = 0;
    let last = 0;
    let raf: number | null = null;
    let visible = true;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let dead = false;

    const draw = (amp: number) => {
      const ca = canvas.width / Math.max(1, canvas.height);
      const rx = ca > imgAspect ? 1 : ca / imgAspect;
      const ry = ca > imgAspect ? imgAspect / ca : 1;
      gl.uniform2f(uR, rx, ry);
      gl.uniform1f(uTime, timeAcc);
      gl.uniform1f(uAmp, amp);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = null;
      if (dead || !ready) return;
      const dt = Math.min(now - last, 50);
      last = now;
      energy *= Math.exp(-dt / SCROLL_TAU);
      const intro = Math.exp(-(now - introStart) / INTRO_TAU);
      const amp = Math.min(1.4, intro + energy);
      timeAcc += dt * 0.001 * (0.6 + amp * 1.6);
      if (amp > STOP_BELOW && visible) {
        draw(amp);
        raf = requestAnimationFrame(frame);
      } else {
        draw(0);
      }
    };

    const kick = () => {
      if (raf || dead || !ready || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        if (ready && !raf) draw(0);
      }
    };

    const onScroll = () => {
      const now = performance.now();
      const v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      energy = Math.max(energy, Math.min(1.2, v * 0.5));
      kick();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      dead = true;
      canvas.style.opacity = '0';
    };
    canvas.addEventListener('webglcontextlost', onLost);
    window.addEventListener('scroll', onScroll, { passive: true });

    const img = new Image();
    img.onload = () => {
      if (dead) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      imgAspect = img.naturalWidth / img.naturalHeight;
      ready = true;
      introStart = performance.now();
      draw(1);
      canvas.style.opacity = '1';
      kick();
    };
    img.src = src;

    return () => {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [src]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 size-full opacity-0 transition-opacity duration-500"
    />
  );
}
