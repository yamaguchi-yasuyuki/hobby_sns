import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import sharp from "sharp"

const W = 800, H = 600

type RGB = { r: number; g: number; b: number }

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t))
}
function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) }
}
function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function hashStr(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i)
  return h & 0x7fffffff
}

function smooth(t: number): number { return t * t * t * (t * (t * 6 - 15) + 10) }

function vnoise(x: number, y: number, s: number): number {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const ux = smooth(xf), uy = smooth(yf)
  const sin = Math.sin
  function r(a: number, b: number): number {
    const n = sin(a * 127.1 + b * 311.7 + s * 74.9) * 43758.5
    return n - Math.floor(n)
  }
  const v00 = r(xi, yi), v10 = r(xi + 1, yi)
  const v01 = r(xi, yi + 1), v11 = r(xi + 1, yi + 1)
  return v00 + (v10 - v00) * ux + (v01 - v00) * uy + (v00 - v10 - v01 + v11) * ux * uy
}

function fbm(x: number, y: number, s: number, o = 5): number {
  let v = 0, a = 0.5, f = 1
  for (let i = 0; i < o; i++) {
    v += vnoise(x * f, y * f, s + i * 137) * a
    a *= 0.5; f *= 2
  }
  return v
}

// 公共施設に合う落ち着いた日本的カラーパレット
const PALETTES = [
  { sky1:"#4E8EC2",sky2:"#87BCDA",sky3:"#B8D8EE",glow:"#FFF8D8",l1:"#4A8838",l2:"#347028",l3:"#1E5018" },
  { sky1:"#3A94B2",sky2:"#72B8CC",sky3:"#A8D4E0",glow:"#E0F8F4",l1:"#306840",l2:"#205030",l3:"#123820" },
  { sky1:"#508AAA",sky2:"#80B0C8",sky3:"#AACCE0",glow:"#E8F4F8",l1:"#388040",l2:"#286830",l3:"#185020" },
  { sky1:"#7898C0",sky2:"#9CB8D4",sky3:"#C0D4E8",glow:"#F0F4FF",l1:"#6080A0",l2:"#487090",l3:"#305060" },
  { sky1:"#7AABCC",sky2:"#A2C8DE",sky3:"#C8E0EE",glow:"#EEF8FF",l1:"#3A7050",l2:"#285840",l3:"#183A28" },
  { sky1:"#28A8C0",sky2:"#60C8DC",sky3:"#98E0EE",glow:"#E0F8F4",l1:"#20986A",l2:"#147850",l3:"#0C5030" },
  { sky1:"#608CC0",sky2:"#8CB0D4",sky3:"#B4CDE4",glow:"#EEF4FF",l1:"#508040",l2:"#386828",l3:"#224C18" },
  { sky1:"#4A78B0",sky2:"#7AA8CC",sky3:"#A8CDE0",glow:"#E8F2FA",l1:"#3A6888",l2:"#285870",l3:"#184858" },
  { sky1:"#D8A828",sky2:"#ECC860",sky3:"#F8E090",glow:"#FFFAC0",l1:"#788018",l2:"#586010",l3:"#384008" },
  { sky1:"#6898B0",sky2:"#90B8CC",sky3:"#B4D4E0",glow:"#EAF4F8",l1:"#4A7050",l2:"#385840",l3:"#284030" },
  { sky1:"#A8C028",sky2:"#C8DC60",sky3:"#E0F098",glow:"#F8FFC0",l1:"#607818",l2:"#486010",l3:"#304808" },
  { sky1:"#C8A828",sky2:"#E0C850",sky3:"#F0E088",glow:"#FFF8A0",l1:"#808020",l2:"#606018",l3:"#404010" },
]

function buildTerrainLayer(
  hv: number, h: number, amp: number, s: number, W: number, H: number
): Float32Array {
  const arr = new Float32Array(W)
  for (let x = 0; x < W; x++) {
    const nx = x / W
    let y = hv + fbm(nx * 2.5, 0.0, s, 5) * amp
                + fbm(nx * 7.0, 0.5, s + 83, 4) * amp * 0.35
                + fbm(nx * 18.0, 1.2, s + 167, 3) * amp * 0.12
    arr[x] = Math.max(0.05, Math.min(0.92, y)) * H
  }
  return arr
}

async function generatePhoto(seed: string): Promise<Buffer> {
  const h = hashStr(seed)
  const p = PALETTES[h % PALETTES.length]
  const skyCols  = [hexToRgb(p.sky1), hexToRgb(p.sky2), hexToRgb(p.sky3)]
  const landCols = [hexToRgb(p.l1), hexToRgb(p.l2), hexToRgb(p.l3)]
  const glowCol  = hexToRgb(p.glow)

  const terrainLayers = [
    buildTerrainLayer(0.26, h,       0.14, h,       W, H),
    buildTerrainLayer(0.42, h + 37,  0.10, h + 37,  W, H),
    buildTerrainLayer(0.56, h + 73,  0.07, h + 73,  W, H),
    buildTerrainLayer(0.70, h + 109, 0.05, h + 109, W, H),
  ]

  const showSun = h % 3 !== 0
  const sunX = 80 + (h % 640)
  const sunY = 35 + (h % 140)
  const sunR = 28 + (h % 22)

  const pixels = new Uint8Array(W * H * 3)

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 3
      const fx = x / W, fy = y / H

      const t0 = terrainLayers[0][x]
      const t1 = terrainLayers[1][x]
      const t2 = terrainLayers[2][x]
      const t3 = terrainLayers[3][x]

      const grain = (fbm(fx * 180, fy * 180, h + 700, 2) - 0.5) * 18

      let col: RGB

      if (y < t0) {
        const skyT = y / t0
        const baseSky = skyT < 0.55
          ? lerpRgb(skyCols[0], skyCols[1], skyT / 0.55)
          : lerpRgb(skyCols[1], skyCols[2], (skyT - 0.55) / 0.45)
        const cloudNoise = Math.max(0, fbm(fx * 3.5, fy * 5.5 + 2, h + 300, 6) * 2.2 - 1.0)
        col = lerpRgb(baseSky, { r: 255, g: 255, b: 252 }, cloudNoise * 0.8)
        const hazeT = Math.pow(skyT, 3)
        col = lerpRgb(col, skyCols[2], hazeT * 0.4)
        if (showSun) {
          const dx = x - sunX, dy = y - sunY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < sunR * 5) {
            const gf = dist < sunR
              ? 1.0
              : Math.max(0, 1 - (dist - sunR) / (sunR * 4)) * 0.8
            col = lerpRgb(col, glowCol, gf)
          }
        }
      } else if (y < t1) {
        const mt = (y - t0) / Math.max(1, t1 - t0)
        const base = lerpRgb(landCols[0], landCols[1], mt)
        const atmo = lerpRgb(skyCols[2], skyCols[1], 0.3)
        col = lerpRgb(base, atmo, 0.45)
        const tex = (fbm(fx * 8, fy * 6, h + 400, 4) - 0.5) * 22
        col = { r: col.r + tex, g: col.g + tex * 0.9, b: col.b + tex * 0.7 }
      } else if (y < t2) {
        const mt = (y - t1) / Math.max(1, t2 - t1)
        col = lerpRgb(landCols[0], landCols[1], mt)
        const atmo = lerpRgb(skyCols[2], skyCols[1], 0.1)
        col = lerpRgb(col, atmo, 0.22)
        const tex = (fbm(fx * 12, fy * 9, h + 450, 4) - 0.5) * 28
        col = { r: col.r + tex, g: col.g + tex * 0.85, b: col.b + tex * 0.6 }
      } else if (y < t3) {
        const mt = (y - t2) / Math.max(1, t3 - t2)
        col = lerpRgb(landCols[1], landCols[2], mt)
        const tex = (fbm(fx * 20, fy * 15, h + 500, 4) - 0.5) * 35
        col = { r: col.r + tex, g: col.g + tex * 0.8, b: col.b + tex * 0.5 }
      } else {
        const mt = (y - t3) / Math.max(1, H - t3)
        col = lerpRgb(landCols[2], { r: landCols[2].r * 0.7, g: landCols[2].g * 0.7, b: landCols[2].b * 0.7 }, mt)
        const tex = (fbm(fx * 35, fy * 30, h + 550, 3) - 0.5) * 40
        col = { r: col.r + tex, g: col.g + tex * 0.75, b: col.b + tex * 0.45 }
      }

      const vx = (fx - 0.5) * 2, vy = (fy - 0.5) * 2
      const vig = Math.max(0.62, 1 - (vx * vx + vy * vy) * 0.32)

      pixels[idx]     = clamp((col.r + grain) * vig)
      pixels[idx + 1] = clamp((col.g + grain * 0.9) * vig)
      pixels[idx + 2] = clamp((col.b + grain * 0.75) * vig)
    }
  }

  return sharp(Buffer.from(pixels), { raw: { width: W, height: H, channels: 3 } })
    .jpeg({ quality: 88 })
    .toBuffer()
}

const cacheBuffers = new Map<string, Buffer>()

function bufferToResponse(buf: Buffer): NextResponse {
  return new NextResponse(
    new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buf))
        controller.close()
      },
    }),
    { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" } }
  )
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ seed: string }> }
) {
  const { seed } = await params

  if (cacheBuffers.has(seed)) return bufferToResponse(cacheBuffers.get(seed)!)

  try {
    const jpeg = await generatePhoto(seed)
    cacheBuffers.set(seed, jpeg)
    return bufferToResponse(jpeg)
  } catch (e) {
    console.error("photo gen error:", e)
    return new NextResponse("error", { status: 500 })
  }
}
