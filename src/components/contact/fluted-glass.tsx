"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// An image seen through fluted glass: vertical ribs that each act as a small lens, bending what is behind them,
// splitting its colour a little at the rib's edge, and drifting slowly. Written for Botlane in plain WebGL.
const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`
const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D img;
uniform vec2 res, imgRes, focus;
uniform float t, ribs, bend, split;

// Cover-fit the image around a focal point, with a slow wander so the scene is never quite still.
vec2 cover(vec2 uv) {
  float r = res.x / res.y, ir = imgRes.x / imgRes.y;
  vec2 s = r > ir ? vec2(1.0, ir / r) : vec2(r / ir, 1.0);
  vec2 wander = vec2(sin(t * 0.05), cos(t * 0.04)) * 0.025;
  return (uv - 0.5) * s * 0.92 + focus + wander;
}

void main() {
  vec2 uv = vec2(v.x, 1.0 - v.y);
  // Where this pixel sits across its rib, from -0.5 to 0.5; the ribs drift sideways very slowly.
  float x = uv.x * ribs + t * 0.03;
  float f = fract(x) - 0.5;
  // A lens: the further from the rib's centre, the more the image behind is pushed, back towards the centre.
  float push = f * bend / ribs;
  vec2 q = cover(uv);
  float r = texture2D(img, q + vec2(push * (1.0 + split), 0.0)).r;
  float g = texture2D(img, q + vec2(push, 0.0)).g;
  float b = texture2D(img, q + vec2(push * (1.0 - split), 0.0)).b;
  vec3 c = vec3(r, g, b);
  // Each rib is lit on one side and shaded on the other, with a fine bright line where two ribs meet.
  c *= 0.9 + 0.16 * (0.5 - f);
  c += smoothstep(0.46, 0.5, abs(f)) * 0.07;
  gl_FragColor = vec4(c, 1.0);
}`

/**
 * A rounded window onto an image through fluted glass. Pauses off screen and in hidden tabs; under reduced
 * motion it draws one still frame. Without WebGL the image shows plainly, under CSS ribs, so nothing breaks.
 */
export function FlutedGlass({ src, fallback, className, ribs = 22, bend = 2.4, split = 0.18, focus = [0.5, 0.5] }: {
  src: string
  /** A JPEG for browsers without WebP. `src` should be the WebP. */
  fallback?: string
  className?: string
  /** The point of the image to keep in view, 0–1 from the top left; keep it 0.1–0.9 so the frame never runs off the image. */
  focus?: [number, number]
  ribs?: number
  bend?: number
  split?: number
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [fx, fy] = focus

  useEffect(() => {
    const el = canvas.current
    const gl = el?.getContext("webgl", { antialias: false, premultipliedAlpha: false })
    if (!el || !gl) return
    el.dataset.ready = "false"

    const shader = (type: number, code: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, code)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const at = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(at)
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(prog, n)
    gl.uniform1f(u("ribs"), ribs)
    gl.uniform1f(u("bend"), bend)
    gl.uniform1f(u("split"), split)
    gl.uniform2f(u("focus"), fx, fy)

    const tex = gl.createTexture()
    const image = new Image()
    let loaded = false
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
      gl.uniform2f(u("imgRes"), image.naturalWidth, image.naturalHeight)
      loaded = true
      el.dataset.ready = "true"
      draw(performance.now())
    }
    image.src = src

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      const w = Math.round(el.clientWidth * dpr), h = Math.round(el.clientHeight * dpr)
      if (el.width !== w || el.height !== h) { el.width = w; el.height = h }
      gl.viewport(0, 0, w, h)
      gl.uniform2f(u("res"), w, h)
    }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0, visible = true
    const t0 = performance.now()
    const draw = (now: number) => {
      raf = 0
      if (!loaded) return
      resize()
      gl.uniform1f(u("t"), still ? 0 : (now - t0) / 1000)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (!still && visible && !document.hidden) raf = requestAnimationFrame(draw)
    }
    const wake = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake() })
    io.observe(el)
    const ro = new ResizeObserver(() => { if (still) draw(performance.now()) })
    ro.observe(el)
    document.addEventListener("visibilitychange", wake)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", wake)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [src, ribs, bend, split, fx, fy])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Underneath, and the whole picture if WebGL is missing: the image, with ribs drawn in CSS. */}
      <picture>
        <source srcSet={src} type="image/webp" />
        <img src={fallback ?? src} alt="" aria-hidden className="absolute inset-0 size-full object-cover" style={{ objectPosition: `${fx * 100}% ${fy * 100}%` }} />
      </picture>
      <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.10)_0,rgb(255_255_255/0)_2%,rgb(0_0_0/0.06)_4.5%)]" />
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100" />
    </div>
  )
}
