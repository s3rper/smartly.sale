/**
 * Generates public/og-earn-gcash.jpg — the OG/Twitter card image for /earn-gcash
 * Run: node scripts/generate-og-earn-gcash.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../public/og-earn-gcash.jpg');

const W = 1200;
const H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <!-- Background gradient (GCash blue) -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d6efd"/>
      <stop offset="50%" stop-color="#0a58ca"/>
      <stop offset="100%" stop-color="#084298"/>
    </linearGradient>
    <!-- Subtle radial accent top-right -->
    <radialGradient id="glow" cx="85%" cy="15%" r="45%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0d6efd" stop-opacity="0"/>
    </radialGradient>
    <!-- Bottom accent -->
    <radialGradient id="glow2" cx="15%" cy="90%" r="40%">
      <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0d6efd" stop-opacity="0"/>
    </radialGradient>
    <!-- Coin gradient -->
    <radialGradient id="coin" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="60%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Decorative circles / orbs -->
  <circle cx="1050" cy="90" r="180" fill="white" fill-opacity="0.04"/>
  <circle cx="1100" cy="140" r="100" fill="white" fill-opacity="0.05"/>
  <circle cx="80"  cy="560" r="130" fill="white" fill-opacity="0.04"/>
  <circle cx="130" cy="590" r="70"  fill="white" fill-opacity="0.05"/>

  <!-- Grid dots pattern (right side, subtle) -->
  ${Array.from({ length: 6 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) =>
      `<circle cx="${720 + col * 60}" cy="${60 + row * 88}" r="2.5" fill="white" fill-opacity="0.12"/>`
    ).join('')
  ).join('')}

  <!-- Large peso / GCash coin icon (decorative, right side) -->
  <circle cx="960" cy="315" r="188" fill="url(#coin)" fill-opacity="0.18"/>
  <circle cx="960" cy="315" r="158" fill="none" stroke="#f59e0b" stroke-width="3" stroke-opacity="0.25"/>
  <!-- Peso sign -->
  <text x="960" y="355" font-family="Arial,Helvetica,sans-serif" font-size="160" font-weight="900"
        fill="#f59e0b" fill-opacity="0.30" text-anchor="middle">₱</text>

  <!-- Left content block -->
  <!-- Eyebrow badge -->
  <rect x="72" y="72" width="290" height="38" rx="19" fill="white" fill-opacity="0.15"/>
  <text x="90" y="97" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="700"
        fill="white" fill-opacity="0.90" letter-spacing="2">🎁  UPDATED DAILY · LIBRE</text>

  <!-- Main headline -->
  <text x="72" y="205" font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="74" font-weight="900"
        fill="white" letter-spacing="-1">Kumita ng</text>
  <text x="72" y="292" font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="74" font-weight="900"
        fill="#fbbf24" letter-spacing="-1">GCash Online</text>

  <!-- Subtitle -->
  <text x="72" y="358" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="400"
        fill="white" fill-opacity="0.80">Free Rewards &amp; Prizes · Philippines 2026</text>

  <!-- Divider line -->
  <rect x="72" y="392" width="500" height="2" rx="1" fill="white" fill-opacity="0.20"/>

  <!-- Trust pills row -->
  <!-- Pill 1 -->
  <rect x="72"  y="415" width="148" height="40" rx="20" fill="white" fill-opacity="0.15"/>
  <text x="146" y="441" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700"
        fill="white" text-anchor="middle">✅ Libre</text>

  <!-- Pill 2 -->
  <rect x="232" y="415" width="172" height="40" rx="20" fill="white" fill-opacity="0.15"/>
  <text x="318" y="441" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700"
        fill="white" text-anchor="middle">⚡ Instant Rewards</text>

  <!-- Pill 3 -->
  <rect x="416" y="415" width="158" height="40" rx="20" fill="white" fill-opacity="0.15"/>
  <text x="495" y="441" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700"
        fill="white" text-anchor="middle">🔒 Verified</text>

  <!-- Stats row -->
  <!-- Stat 1 -->
  <text x="72"  y="525" font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="36" font-weight="900"
        fill="white">2,400+</text>
  <text x="72"  y="554" font-family="Arial,Helvetica,sans-serif" font-size="16"
        fill="white" fill-opacity="0.65">Active Members</text>

  <!-- Divider -->
  <rect x="222" y="500" width="1.5" height="60" fill="white" fill-opacity="0.25"/>

  <!-- Stat 2 -->
  <text x="240" y="525" font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="36" font-weight="900"
        fill="white">₱500K+</text>
  <text x="240" y="554" font-family="Arial,Helvetica,sans-serif" font-size="16"
        fill="white" fill-opacity="0.65">Rewards Claimed</text>

  <!-- Divider -->
  <rect x="420" y="500" width="1.5" height="60" fill="white" fill-opacity="0.25"/>

  <!-- Stat 3 -->
  <text x="438" y="525" font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="36" font-weight="900"
        fill="#fbbf24">4.8★</text>
  <text x="438" y="554" font-family="Arial,Helvetica,sans-serif" font-size="16"
        fill="white" fill-opacity="0.65">Avg. Rating</text>

  <!-- Bottom bar with brand -->
  <rect x="0" y="${H - 58}" width="${W}" height="58" fill="black" fill-opacity="0.25"/>
  <text x="72" y="${H - 22}" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700"
        fill="white" fill-opacity="0.90">smartly.sale</text>
  <text x="${W - 72}" y="${H - 22}" font-family="Arial,Helvetica,sans-serif" font-size="16"
        fill="white" fill-opacity="0.60" text-anchor="end">smartly.sale/earn-gcash</text>
</svg>`;

await sharp(Buffer.from(svg))
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(outPath);

console.log(`✅  OG image written to: ${outPath}`);
