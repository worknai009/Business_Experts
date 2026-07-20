import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const seedMediaDir = path.join(__dirname, "..", "public", "seed");
export const uploadsDir = path.join(__dirname, "..", "uploads");

/* Icon glyphs (24x24 viewBox, stroke style) */
const GLYPHS = {
  growth: "M3 17l6-6 4 4 8-8M15 7h6v6",
  support: "M4 13a8 8 0 0 1 16 0M4 13v4a2 2 0 0 0 2 2h1v-6H6M20 13v4a2 2 0 0 1-2 2h-1v-6h1M12 21h4",
  handshake:
    "M4 11l4-4 4 3 4-3 4 4M8 7l4 4-2 2a1.5 1.5 0 0 1-2-2M12 10l4 4M14 16l2 2M11 13l2 2",
  heart: "M12 21C7 16.5 3 13 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8C21 13 17 16.5 12 21z",
  network: "M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 5v6M12 11l-7 6M12 11l7 6",
  users:
    "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 8a3 3 0 1 1-2 5.2M15 14a6 6 0 0 1 6 6",
  rocket:
    "M12 15c-2 0-4-2-4-4 0-4 2-8 4-9 2 1 4 5 4 9 0 2-2 4-4 4zM8 13l-3 2 1 3M16 13l3 2-1 3M12 15v5",
  cube: "M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2zM12 2v9M4 6.5l8 4.5 8-4.5M12 20v-9",
  calendar: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM16 3v4M8 3v4M3 11h18",
  pen: "M15 4l5 5L8 21H3v-5L15 4zM13 6l5 5",
  image: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5-9 9",
  mic: "M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v4M9 21h6",
  briefcase: "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM3 13h18"
};

const PALETTES = {
  blue: ["#059669", "#047857", "#34D399"],
  indigo: ["#065F46", "#064E3B", "#10B981"],
  sky: ["#0D9488", "#0F766E", "#2DD4BF"],
  teal: ["#10B981", "#059669", "#6EE7B7"],
  slate: ["#334155", "#1E293B", "#94A3B8"],
  violet: ["#B45309", "#92400E", "#FBBF24"]
};

function chartPath(seedNum) {
  const points = [];
  let y = 620;
  for (let x = 0; x <= 1200; x += 120) {
    points.push(`${x},${Math.round(y)}`);
    y -= 20 + ((seedNum * (x / 120 + 3)) % 60);
  }
  return points.join(" ");
}

/* A themed abstract illustration: gradient scene, glass panels, glyph badge, rising chart. */
function illustration(glyphKey, paletteKey, seedNum = 3) {
  const [c1, c2, c3] = PALETTES[paletteKey];
  const glyph = GLYPHS[glyphKey];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.05"/>
    </linearGradient>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <circle cx="1050" cy="120" r="260" fill="${c3}" opacity="0.5" filter="url(#blur)"/>
  <circle cx="120" cy="700" r="300" fill="${c2}" opacity="0.7" filter="url(#blur)"/>
  <g fill="#ffffff" opacity="0.12">${Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 12 }, (_, c) => `<circle cx="${80 + c * 96}" cy="${64 + r * 96}" r="3"/>`).join("")
  ).join("")}</g>
  <polyline points="${chartPath(seedNum)}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="360" y="220" width="480" height="360" rx="36" fill="url(#shine)" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
  <circle cx="600" cy="360" r="86" fill="#ffffff" opacity="0.95"/>
  <g transform="translate(552,312) scale(4)" fill="none" stroke="${c1}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="${glyph}"/>
  </g>
  <rect x="440" y="486" width="320" height="18" rx="9" fill="#ffffff" opacity="0.85"/>
  <rect x="490" y="522" width="220" height="14" rx="7" fill="#ffffff" opacity="0.5"/>
</svg>`;
}

/* Hero: founders + dashboard + investment scene. */
function heroIllustration() {
  const avatar = (x, y, fill) =>
    `<g transform="translate(${x},${y})"><circle r="26" fill="${fill}"/><circle cx="0" cy="-7" r="9" fill="#ffffff"/><path d="M-14 16a14 11 0 0 1 28 0z" fill="#ffffff"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 820" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="hbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ECFDF5"/><stop offset="1" stop-color="#D1FAE5"/>
    </linearGradient>
    <linearGradient id="hb" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#059669"/><stop offset="1" stop-color="#065F46"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#6EE7B7"/><stop offset="1" stop-color="#059669"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#064E3B" flood-opacity="0.18"/>
    </filter>
    <filter id="hblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
  </defs>
  <rect x="30" y="30" width="940" height="760" rx="48" fill="url(#hbg)"/>
  <circle cx="850" cy="140" r="180" fill="#6EE7B7" opacity="0.55" filter="url(#hblur)"/>
  <circle cx="150" cy="700" r="200" fill="#A7F3D0" opacity="0.8" filter="url(#hblur)"/>
  <g fill="#059669" opacity="0.1">${Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => `<circle cx="${110 + c * 88}" cy="${100 + r * 120}" r="3.5"/>`).join("")
  ).join("")}</g>

  <!-- Main analytics dashboard card -->
  <g filter="url(#soft)">
    <rect x="150" y="150" width="560" height="400" rx="28" fill="#ffffff"/>
    <rect x="150" y="150" width="560" height="66" rx="28" fill="#F1F5F9"/>
    <rect x="150" y="188" width="560" height="28" fill="#F1F5F9"/>
    <circle cx="190" cy="183" r="8" fill="#FCA5A5"/><circle cx="216" cy="183" r="8" fill="#FCD34D"/><circle cx="242" cy="183" r="8" fill="#86EFAC"/>
    <rect x="580" y="170" width="104" height="26" rx="13" fill="url(#hb)"/>
    <rect x="190" y="250" width="200" height="16" rx="8" fill="#0F172A" opacity="0.85"/>
    <rect x="190" y="280" width="130" height="10" rx="5" fill="#94A3B8"/>
    <!-- Bars -->
    <rect x="190" y="430" width="46" height="80" rx="8" fill="url(#bar)"/>
    <rect x="252" y="392" width="46" height="118" rx="8" fill="url(#bar)"/>
    <rect x="314" y="418" width="46" height="92" rx="8" fill="url(#bar)"/>
    <rect x="376" y="352" width="46" height="158" rx="8" fill="url(#bar)"/>
    <rect x="438" y="316" width="46" height="194" rx="8" fill="url(#bar)"/>
    <!-- Trend line -->
    <polyline points="520,470 570,420 610,436 660,360" fill="none" stroke="#059669" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="660" cy="360" r="10" fill="#059669"/><circle cx="660" cy="360" r="4" fill="#ffffff"/>
    <path d="M646 330h28l-4-8m4 8l-8 4" stroke="#16A34A" stroke-width="0" fill="none"/>
  </g>

  <!-- Growth stat chip -->
  <g filter="url(#soft)">
    <rect x="600" y="96" width="230" height="84" rx="20" fill="#ffffff"/>
    <g transform="translate(624,120) scale(1.6)" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${GLYPHS.growth}"/></g>
    <text x="676" y="132" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#0F172A">+248%</text>
    <text x="676" y="158" font-family="Arial, sans-serif" font-size="14" fill="#64748B">Business growth</text>
  </g>

  <!-- Founders / team card -->
  <g filter="url(#soft)">
    <rect x="96" y="590" width="330" height="130" rx="24" fill="#ffffff"/>
    ${avatar(160, 640, "#059669")}${avatar(220, 640, "#0D9488")}${avatar(280, 640, "#065F46")}${avatar(340, 640, "#D97706")}
    <rect x="140" y="682" width="180" height="12" rx="6" fill="#0F172A" opacity="0.8"/>
    <rect x="140" y="700" width="120" height="9" rx="4.5" fill="#94A3B8"/>
  </g>

  <!-- Investment / funding card -->
  <g filter="url(#soft)">
    <rect x="560" y="470" width="330" height="230" rx="24" fill="url(#hb)"/>
    <circle cx="640" cy="548" r="44" fill="#ffffff" opacity="0.16"/>
    <g transform="translate(616,524) scale(2)" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${GLYPHS.handshake}"/></g>
    <text x="712" y="540" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">Funding</text>
    <text x="712" y="566" font-family="Arial, sans-serif" font-size="14" fill="#A7F3D0">Secured round</text>
    <rect x="600" y="614" width="250" height="14" rx="7" fill="#ffffff" opacity="0.35"/>
    <rect x="600" y="614" width="170" height="14" rx="7" fill="#ffffff" opacity="0.9"/>
    <text x="600" y="668" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff">$2.4M raised</text>
  </g>

  <!-- Floating coins -->
  <g filter="url(#soft)">
    <circle cx="900" cy="330" r="34" fill="#FBBF24"/><circle cx="900" cy="330" r="24" fill="#F59E0B"/>
    <text x="900" y="341" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#ffffff">$</text>
  </g>
  <g filter="url(#soft)">
    <circle cx="120" cy="260" r="26" fill="#FBBF24"/><circle cx="120" cy="260" r="18" fill="#F59E0B"/>
    <text x="120" y="269" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">$</text>
  </g>
  <!-- Rocket badge -->
  <g filter="url(#soft)">
    <circle cx="880" cy="720" r="42" fill="#ffffff"/>
    <g transform="translate(856,696) scale(2)" fill="none" stroke="#059669" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${GLYPHS.rocket}"/></g>
  </g>
</svg>`;
}

function avatarSvg(initials, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#0B1220"/></linearGradient></defs>
  <rect width="200" height="200" rx="100" fill="url(#a)"/>
  <text x="100" y="122" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff">${initials}</text>
</svg>`;
}

function logoSvg(name, accent) {
  const short = name.split(" ")[0];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 96">
  <rect width="320" height="96" rx="18" fill="#ffffff"/>
  <circle cx="52" cy="48" r="22" fill="${accent}"/>
  <path d="M42 48l7 7 13-14" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="90" y="58" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#0F172A">${short}</text>
</svg>`;
}

const FILES = {
  "hero.svg": heroIllustration,
  "service-growth.svg": () => illustration("growth", "blue", 5),
  "service-support.svg": () => illustration("support", "sky", 4),
  "service-investment.svg": () => illustration("handshake", "indigo", 6),
  "service-seniors.svg": () => illustration("heart", "teal", 3),
  "service-networking.svg": () => illustration("network", "violet", 5),
  "service-community.svg": () => illustration("users", "blue", 7),
  "project-fintech.svg": () => illustration("rocket", "indigo", 8),
  "project-crm.svg": () => illustration("briefcase", "sky", 5),
  "project-community.svg": () => illustration("users", "teal", 6),
  "event-summit.svg": () => illustration("mic", "indigo", 9),
  "event-meetup.svg": () => illustration("network", "blue", 6),
  "blog-growth.svg": () => illustration("pen", "sky", 4),
  "blog-funding.svg": () => illustration("handshake", "blue", 8),
  "blog-network.svg": () => illustration("users", "indigo", 5),
  "gallery-1.svg": () => illustration("mic", "blue", 3),
  "gallery-2.svg": () => illustration("users", "teal", 8),
  "gallery-3.svg": () => illustration("network", "violet", 4),
  "gallery-4.svg": () => illustration("growth", "indigo", 6),
  "gallery-5.svg": () => illustration("briefcase", "sky", 9),
  "gallery-6.svg": () => illustration("heart", "slate", 5),
  "avatar-1.svg": () => avatarSvg("RS", "#059669"),
  "avatar-2.svg": () => avatarSvg("AP", "#0D9488"),
  "avatar-3.svg": () => avatarSvg("VK", "#B45309"),
  "avatar-4.svg": () => avatarSvg("SM", "#065F46"),
  "avatar-5.svg": () => avatarSvg("NG", "#10B981"),
  "avatar-6.svg": () => avatarSvg("DJ", "#DC2626"),
  "logo-1.svg": () => logoSvg("NovaBank Financial", "#059669"),
  "logo-2.svg": () => logoSvg("TechBridge Labs", "#0D9488"),
  "logo-3.svg": () => logoSvg("GrowthWorks Capital", "#B45309"),
  "logo-4.svg": () => logoSvg("UnityCorp Group", "#EA580C")
};

export function ensureSeedMedia() {
  fs.mkdirSync(seedMediaDir, { recursive: true });
  fs.mkdirSync(uploadsDir, { recursive: true });
  for (const [name, build] of Object.entries(FILES)) {
    const filePath = path.join(seedMediaDir, name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, build(), "utf8");
    }
  }
}

export const media = (name) => `/api/media/seed/${name}`;
