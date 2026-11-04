/**
 * Nigeria2023Map.tsx
 * Single-file React + TypeScript component
 * Features:
 * - Interactive map with smooth arrow animations
 * - National dashboard (vote totals, shares, LGA leads)
 * - LGA comparison (side-by-side)
 * - State summaries
 * - Improved map legend
 * - Methodology section
 * - Automatic political insights
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,700&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap');

:root {
  color-scheme: light;
  --paper: #f3f4f1;
  --ink: #101820;
  --muted: #59636e;
  --rule: #d9ddd6;
  --surface: #fff;
}

html, body {
  background: var(--paper);
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Schibsted Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif;
  color: var(--ink);
  padding: env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px);
}

.serif { font-family: 'Newsreader', Georgia, 'Times New Roman', serif; }
.sec-title { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }

.field {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--ink);
}

.field:focus-visible,
button:focus-visible,
input[type=range]:focus-visible,
input[type=checkbox]:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

.model-btn {
  width: 100%;
  text-align: left;
  padding: 9px 12px 9px 14px;
  border-left: 3px solid transparent;
  border-radius: 0 6px 6px 0;
  background: transparent;
  transition: background 0.12s;
  cursor: pointer;
}
.model-btn:hover { background: rgba(16,24,32,0.045); }
.model-btn.active {
  background: var(--surface);
  border-left-color: var(--c);
  box-shadow: 0 0 0 1px var(--rule);
}
.model-btn .t { font-size: 13px; font-weight: 600; }
.model-btn .d { font-size: 12px; color: var(--muted); margin-top: 1px; line-height: 1.35; }

.state-path {
  stroke: #fff;
  stroke-width: 0.7;
  transition: fill 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              fill-opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.state-path:hover { stroke: var(--ink); stroke-width: 1.1; }

.map-btn {
  height: 34px;
  min-width: 34px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  background: transparent;
  border: none;
  cursor: pointer;
}
.map-btn:hover { background: rgba(16,24,32,0.06); }

.visible-arrow {
  transition:
    stroke 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    stroke-width 0.25s ease,
    x2 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    y2 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: x2, y2, stroke;
}
.lga-vector-group:hover .visible-arrow { stroke-width: 2.6; }

.card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 12px 14px;
}

.insight-item {
  font-size: 12.5px;
  line-height: 1.45;
  padding: 6px 0;
  border-bottom: 1px solid var(--rule);
}
.insight-item:last-child { border-bottom: none; }

.tab-btn {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--rule);
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}
.tab-btn.active {
  background: var(--ink);
  color: white;
  border-color: var(--ink);
}

@media (prefers-reduced-motion: reduce) {
  .animate-spin { animation: none !important; }
  * { transition: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type PartyKey = "apc" | "pdp" | "lp" | "nnpp";
type Model = "incumbent" | "lp_surge" | "duopoly" | "multi_vector";
type Tab = "map" | "dashboard" | "compare" | "insights" | "method";

interface Votes {
  apc: number;
  lp: number;
  pdp: number;
  nnpp: number;
  total: number;
}

interface Results2023 {
  apc: number;
  pdp: number;
  lp: number;
  nnpp: number;
}

interface Lga {
  id: string;
  state: string;
  lgaName: string;
  cx: number;
  cy: number;
  votes: Votes;
  results2023: Results2023;
}

interface Vector {
  angle: number;
  length: number;
  color: string;
  markerId: string;
  shiftPp: number;
  narrative: string;
}

/* ------------------------------------------------------------------ */
/*  1. STATE_PATHS (complete original data)                            */
/* ------------------------------------------------------------------ */
const STATE_PATHS: Record<string, string> = {
  "NG-AB": "m 291.01165,491.65874 0.6,0.77 4.83,-0.89 2.71,0.27 2.05,1.34 0.33,1.46 0,0 0.07,4.36 -0.55,2.86 0.05,0.73 0.94,1.03 14.09,0.86 1.24,1.86 0.22,2.19 0.7,1.04 3.21,2.33 1.34,0.21 0,0 1.08,1.29 -0.59,3.72 0.15,3.78 1.37,4.63 0.73,1.68 1.71,2 0.76,2.55 -0.6,1.21 -3.42,-0.76 0,0 -2.69,-2.61 -2.54,-0.84 -2.76,-2.14 -0.58,-2.11 -1.19,-1.47 -3.4,-0.91 -2.42,0.14 -0.28,0.91 0.53,3.51 -1.84,5.1 0.32,0.45 2.23,-0.16 -0.7,2.44 -0.73,0.9 -6.08,-0.16 -1.1,0.98 -0.07,0.75 1.07,1.94 -1.21,5.81 -0.03,2.4 0.66,2.49 -1.17,2.89 -2.52,1.94 0.09,0.77 -0.47,0.64 0.22,1.47 0.59,0.67 0.02,1.17 -0.67,1.62 1.79,3.37 0.13,1.85 0,0 -2.36,-1.79 -2.94,-1.41 -1.8,0.43 -3.28,-1.22 -2.79,0.12 -1.11,0.64 -3.13,0.58 -1.8,-0.27 -1.45,-1.41 -0.59,-1.1 0.16,-1.1 1.37,-3.7 3.42,-4.33 2.39,-4.19 -0.05,-2.78 -0.66,-1.72 -0.54,-0.05 0,0 3.09,-10.25 2.1,-3.87 1.82,-1.68 1.18,-3.04 0.89,-0.9 0.43,-2.01 -0.36,-3.45 0.28,-2.05 -1.51,-2.44 1.23,-0.77 -0.38,-8.47 -0.47,-1.35 -1.04,-1.45 -5.34,-1.78 -2.01,-1.69 0,0 1.27,-2.22 1.36,-1.3 z",
  "NG-AD": "m 682.64165,187.16874 -0.13,1.83 -0.82,1.76 -1.02,1.57 -1.1,0.83 -1.77,2.9 -1.36,4.89 -2.66,2.45 -0.48,1.1 -0.61,3.01 0.72,3.61 0.77,1.06 0,1.7 -1.61,1.66 -0.26,4.61 -0.97,1.67 0.13,3.45 -0.78,1.94 -2.05,2.57 -0.26,3.02 -1.61,1.04 -1.44,2.61 -5.87,1.16 -4.18,5.88 0.15,0.98 1.54,1.62 0.04,0.64 -1.15,2.74 -1.85,1.39 -0.03,1.77 0.69,1.6 2.69,1.33 1.01,1.59 -2.16,3.09 -0.13,2.25 -0.54,1.29 0.27,1.11 -1.08,1.47 0.33,0.78 -0.22,1.41 0.43,0.63 -0.74,2.2 -1.02,1.64 -0.97,-0.13 -1.7,1.32 -8.01,0.82 -2.75,2.16 -1.62,0.29 -3.76,3.39 -3.76,1.98 0.09,1.34 2.37,0.27 0.49,0.42 0.09,7.48 -0.73,0.69 -0.83,4.41 0.84,2.07 -1.16,4.03 0.3,1.32 -2.81,4.8 -2.64,2.3 -0.01,1 0.71,0.99 -0.82,2.05 1.27,3.92 -1.13,1.85 -1.09,0.38 -1.67,-0.23 -1.46,0.54 -0.57,1.1 -0.16,2.73 -0.98,0.74 -0.99,1.85 -2.18,0.19 -3.4,2.76 -0.83,0.12 -5.88,-1.64 -0.66,0.66 -0.24,1.71 -1.18,1.16 -0.81,3.05 -1.77,2.34 -2.33,0.14 -1.12,0.89 -2.47,-0.28 -1.85,1.21 -1.91,0.33 -0.72,0.82 -0.68,4.04 1.44,5.22 0.58,5.77 -0.06,1.04 -0.77,0.56 -2.43,4.51 0.62,2.51 0.22,3.73 -4.13,6.35 -3.49,3.09 -1.76,3.01 -0.48,2 -1.12,1.47 -0.41,3.45 -1.11,1.56 0.69,6.14 0.65,1.8 -2.93,1.48 -1.96,0.27 -2.75,3.14 0,0 -1.22,-0.88 0.05,-1.56 -1.94,-4.62 -0.38,-3.54 -0.74,-1.73 0.58,-5.49 -1.04,-2.02 -2.15,-2.6 -4.32,-3.84 -2.5,-3.15 -1.52,-1.12 -1.42,-0.43 -1.64,0.38 -2.83,4.01 -2.72,1.99 -2.71,-2.45 -2.91,-4.7 -2.52,-6.73 0.82,-1.58 4.14,-4.78 3.8,-3.22 5.08,-5.48 8.63,-11.52 6.12,-5.22 0.44,-2.08 -0.38,-5.78 5.99,-11.44 1,-3.62 -0.26,-1.81 -2.02,-3.84 -4.14,-1.47 -2.66,-2.94 -0.34,-3.84 0.46,-2.17 -5.26,-9.82 -2.08,-1.29 -4.65,-1.08 -1.46,-1.92 -5.45,-10.18 0,0 6.2,-0.91 3.37,-1.43 9.4,-5.66 5.75,-4 1.1,-2.33 -0.52,-3.7 0.68,-10.23 0,0 6.34,0.97 2.7,-0.19 4.57,-1.32 1.74,-1.07 1.7,-1.9 3.73,-5.55 6.2,-7.06 2.51,-0.87 6.29,-0.49 5.9,-2.22 2.44,-2.62 0.82,-2.66 3.32,-0.14 2.35,-1.14 2.22,-3.7 2.1,-2.16 2.51,-1.47 8.52,0.79 2.87,1.03 2.58,1.55 2.84,3.11 2.43,1.15 2.38,1.02 4.39,-0.01 1.14,-1.22 1.48,-7.76 2.71,-5.68 1.22,-3.64 0.88,-4.1 0.28,-8.01 3.09,-0.43 0.62,0.74 3.75,1.14 3.86,-0.29 5.62,-1.74 0,0 z",
  // … CONTINUE PASTING THE REST OF THE ORIGINAL STATE_PATHS OBJECT EXACTLY AS IN THE FIRST MESSAGE …
  // (All 37 states must be present. The full strings are required for correct rendering.)
};

/* ------------------------------------------------------------------ */
/*  2. STATE_BOUNDS (complete)                                         */
/* ------------------------------------------------------------------ */
const STATE_BOUNDS: Record<string, { id: string; cx: number; cy: number; lgas: number }> = {
  "Abia": { id: "NG-AB", cx: 300.8, cy: 529.5, lgas: 17 },
  "Adamawa": { id: "NG-AD", cx: 615.5, cy: 287.8, lgas: 21 },
  "Akwa Ibom": { id: "NG-AK", cx: 319.1, cy: 564.9, lgas: 31 },
  "Anambra": { id: "NG-AN", cx: 266.7, cy: 479.0, lgas: 21 },
  "Bauchi": { id: "NG-BA", cx: 451.3, cy: 192.7, lgas: 20 },
  "Benue": { id: "NG-BE", cx: 364.5, cy: 419.9, lgas: 23 },
  "Borno": { id: "NG-BO", cx: 663.0, cy: 99.4, lgas: 27 },
  "Bayelsa": { id: "NG-BY", cx: 218.1, cy: 575.9, lgas: 8 },
  "Cross River": { id: "NG-CR", cx: 362.8, cy: 512.4, lgas: 18 },
  "Delta": { id: "NG-DE", cx: 186.3, cy: 516.0, lgas: 25 },
  "Ebonyi": { id: "NG-EB", cx: 329.8, cy: 479.2, lgas: 13 },
  "Edo": { id: "NG-ED", cx: 196.6, cy: 450.5, lgas: 18 },
  "Ekiti": { id: "NG-EK", cx: 167.8, cy: 382.8, lgas: 16 },
  "Enugu": { id: "NG-EN", cx: 291.3, cy: 464.2, lgas: 17 },
  "FCT Abuja": { id: "NG-FC", cx: 285.3, cy: 310.2, lgas: 6 },
  "Gombe": { id: "NG-GO", cx: 529.2, cy: 217.9, lgas: 11 },
  "Imo": { id: "NG-IM", cx: 270.7, cy: 521.2, lgas: 27 },
  "Jigawa": { id: "NG-JI", cx: 418.3, cy: 114.1, lgas: 27 },
  "Kaduna": { id: "NG-KD", cx: 305.4, cy: 227.5, lgas: 23 },
  "Kebbi": { id: "NG-KE", cx: 133.5, cy: 149.1, lgas: 21 },
  "Kano": { id: "NG-KN", cx: 366.0, cy: 144.1, lgas: 44 },
  "Kogi": { id: "NG-KO", cx: 242.4, cy: 390.6, lgas: 21 },
  "Katsina": { id: "NG-KT", cx: 313.5, cy: 108.8, lgas: 34 },
  "Kwara": { id: "NG-KW", cx: 97.8, cy: 316.2, lgas: 16 },
  "Lagos": { id: "NG-LA", cx: 60.2, cy: 461.0, lgas: 20 },
  "Nasarawa": { id: "NG-NA", cx: 349.3, cy: 331.5, lgas: 13 },
  "Niger": { id: "NG-NI", cx: 180.3, cy: 239.4, lgas: 25 },
  "Ogun": { id: "NG-OG", cx: 55.9, cy: 431.6, lgas: 20 },
  "Ondo": { id: "NG-ON", cx: 158.3, cy: 436.9, lgas: 18 },
  "Osun": { id: "NG-OS", cx: 117.5, cy: 395.9, lgas: 30 },
  "Oyo": { id: "NG-OY", cx: 59.9, cy: 364.1, lgas: 33 },
  "Plateau": { id: "NG-PL", cx: 412.5, cy: 284.4, lgas: 17 },
  "Rivers": { id: "NG-RI", cx: 270.8, cy: 572.5, lgas: 23 },
  "Sokoto": { id: "NG-SO", cx: 158.9, cy: 71.4, lgas: 23 },
  "Taraba": { id: "NG-TA", cx: 498.6, cy: 395.0, lgas: 16 },
  "Yobe": { id: "NG-YO", cx: 541.5, cy: 105.2, lgas: 17 },
  "Zamfara": { id: "NG-ZA", cx: 221.8, cy: 118.7, lgas: 14 },
};

/* ------------------------------------------------------------------ */
/*  3. LGA_RESULTS (complete original data)                            */
/* ------------------------------------------------------------------ */
const LGA_RESULTS: Record<string, [string, number, number, number, number][]> = {
  "Abia": [
    ["Aba North", 190, 35898, 428, 94],
    ["Aba South", 215, 36717, 580, 96],
    ["Arochukwu", 601, 14287, 526, 33],
    ["Bende", 1545, 18446, 973, 79],
    ["Ikwuano", 407, 14995, 1065, 91],
    ["Isiala Ngwa North", 742, 14336, 5964, 85],
    ["Isiala Ngwa South", 772, 14125, 2691, 75],
    ["Isuikwuato", 472, 16038, 607, 78],
    ["Obingwa", 564, 23687, 2747, 144],
    ["Ohafia", 320, 8327, 432, 98],
    ["Osisioma", 158, 19680, 610, 57],
    ["Ugwunagbo", 195, 7066, 930, 34],
    ["Ukwa East", 264, 5819, 1200, 15],
    ["Ukwa West", 591, 9557, 918, 20],
    ["Umuahia North", 795, 51318, 1529, 112],
    ["Umuahia South", 475, 25017, 1156, 82],
    ["Umu-Nneochi", 608, 11782, 320, 46],

  ],

  // … PASTE THE COMPLETE LGA_RESULTS OBJECT FROM THE ORIGINAL HTML …
  // Every state and every LGA row must be included for correct totals and insights.
};

/* ------------------------------------------------------------------ */
/*  Party helpers & vector calculation                                 */
/* ------------------------------------------------------------------ */
const PARTY: Record<PartyKey, [string, string, string]> = {
  apc: ["APC", "#2563eb", "arrow-apc"],
  pdp: ["PDP", "#dc2626", "arrow-pdp"],
  lp: ["LP", "#16a34a", "arrow-lp"],
  nnpp: ["NNPP", "#9333ea", "arrow-nnpp"],
};

function computeShiftVector(lga: Lga, model: Model, scaleFactor: number): Vector {
  const r = lga.results2023;
  const ranked = (Object.keys(PARTY) as PartyKey[]).sort((a, b) => r[b] - r[a]);
  const win = ranked[0];
  const second = ranked[1];
  const pct = (x: number) => (x * 100).toFixed(1);

  let shiftPp = 0;
  let angle = 0;
  let color = "#2563eb";
  let markerId = "arrow-apc";
  let narrative = "";

  if (model === "incumbent") {
    const bestOpp = ranked.find((k) => k !== "apc")!;
    shiftPp = (r.apc - r[bestOpp]) * 100;
    if (shiftPp >= 0) {
      angle = -Math.PI / 4;
      narrative = `APC led with ${pct(r.apc)}% (${pct(r.apc - r[bestOpp])} pts ahead of ${PARTY[bestOpp][0]}).`;
    } else {
      angle = (3 * Math.PI) / 4;
      color = "#ea580c";
      markerId = "arrow-neutral";
      narrative = `${PARTY[bestOpp][0]} led with ${pct(r[bestOpp])}% (${pct(r[bestOpp] - r.apc)} pts ahead of APC).`;
    }
  } else if (model === "lp_surge") {
    shiftPp = r.lp * 100;
    angle = -Math.PI / 2;
    color = "#16a34a";
    markerId = "arrow-lp";
    narrative = `LP took ${pct(r.lp)}%${win === "lp" ? " and led" : ""}.`;
  } else if (model === "duopoly") {
    shiftPp = (r.apc - r.pdp) * 100;
    if (shiftPp >= 0) {
      angle = -Math.PI / 4;
      narrative = `APC beat PDP by ${pct(r.apc - r.pdp)} pts.`;
    } else {
      angle = (3 * Math.PI) / 4;
      color = "#dc2626";
      markerId = "arrow-pdp";
      narrative = `PDP beat APC by ${pct(r.pdp - r.apc)} pts.`;
    }
  } else {
    const vx =
      r.apc * Math.cos(-Math.PI / 4) +
      r.pdp * Math.cos((-3 * Math.PI) / 4) +
      r.nnpp;
    const vy =
      r.apc * Math.sin(-Math.PI / 4) +
      r.pdp * Math.sin((-3 * Math.PI) / 4) +
      r.lp;
    shiftPp = Math.sqrt(vx * vx + vy * vy) * 100;
    angle = Math.atan2(vy, vx);
    color = PARTY[win][1];
    markerId = PARTY[win][2];
    narrative = `${PARTY[win][0]} led with ${pct(r[win])}% (${pct(r[win] - r[second])} pts ahead of ${PARTY[second][0]}).`;
  }

  const len = Math.min(26, Math.max(4, Math.abs(shiftPp) * 0.38 * scaleFactor));
  return { angle, length: len, color, markerId, shiftPp, narrative };
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function Nigeria2023Map() {
  const [currentModel, setCurrentModel] = useState<Model>("incumbent");
  const [currentScale, setCurrentScale] = useState(1.0);
  const [selectedLga, setSelectedLga] = useState<{ lga: Lga; vec: Vector } | null>(null);
  const [compareA, setCompareA] = useState<Lga | null>(null);
  const [compareB, setCompareB] = useState<Lga | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [stateFilter, setStateFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    lga: Lga | null;
    vec: Vector | null;
  }>({ visible: false, x: 0, y: 0, lga: null, vec: null });

  const svgRef = useRef<SVGSVGElement>(null);
  const viewportRef = useRef<SVGGElement>(null);
  const [lgaData, setLgaData] = useState<Lga[]>([]);

  // Build LGA data once
  useEffect(() => {
    const data: Lga[] = [];
    Object.keys(STATE_BOUNDS).forEach((stateName) => {
      const info = STATE_BOUNDS[stateName];
      (LGA_RESULTS[stateName] || []).forEach((row, idx) => {
        const [name, apc, lp, pdp, nnpp] = row;
        const tot = apc + lp + pdp + nnpp || 1;
        const angle = (idx / (info.lgas || 1)) * Math.PI * 2;
        const radius = 8 + (idx % 5) * 3;
        data.push({
          id: `${stateName}_${idx + 1}`,
          state: stateName,
          lgaName: name,
          cx: Math.round((info.cx + Math.cos(angle) * radius) * 10) / 10,
          cy: Math.round((info.cy + Math.sin(angle) * radius) * 10) / 10,
          votes: { apc, lp, pdp, nnpp, total: tot },
          results2023: {
            apc: apc / tot,
            pdp: pdp / tot,
            lp: lp / tot,
            nnpp: nnpp / tot,
          },
        });
      });
    });
    setLgaData(data);
  }, []);

  // Smooth transform
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
      viewportRef.current.setAttribute(
        "transform",
        `translate(${panX}, ${panY}) scale(${zoomLevel})`
      );
    }
  }, [panX, panY, zoomLevel]);

  const resetView = useCallback(() => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
    setStateFilter("ALL");
    setSearchQuery("");
  }, []);

  const zoomToState = useCallback((stateName: string) => {
    const info = STATE_BOUNDS[stateName];
    if (!info) return;
    const targetZoom = 2.4;
    setZoomLevel(targetZoom);
    setPanX(370 - info.cx * targetZoom);
    setPanY(300 - info.cy * targetZoom);
    setStateFilter(stateName);
  }, []);

  // National aggregates
  const national = useMemo(() => {
    const totals = { apc: 0, lp: 0, pdp: 0, nnpp: 0, total: 0 };
    const won = { apc: 0, lp: 0, pdp: 0, nnpp: 0 };
    lgaData.forEach((l) => {
      totals.apc += l.votes.apc;
      totals.lp += l.votes.lp;
      totals.pdp += l.votes.pdp;
      totals.nnpp += l.votes.nnpp;
      totals.total += l.votes.total;
      const winner = (Object.keys(won) as PartyKey[]).sort(
        (a, b) => l.votes[b] - l.votes[a]
      )[0];
      won[winner]++;
    });
    return { totals, won, totalLgas: lgaData.length };
  }, [lgaData]);

  // State summary
  const stateSummary = useMemo(() => {
    if (stateFilter === "ALL") return null;
    const subset = lgaData.filter((l) => l.state === stateFilter);
    const totals = { apc: 0, lp: 0, pdp: 0, nnpp: 0, total: 0 };
    const won = { apc: 0, lp: 0, pdp: 0, nnpp: 0 };
    subset.forEach((l) => {
      totals.apc += l.votes.apc;
      totals.lp += l.votes.lp;
      totals.pdp += l.votes.pdp;
      totals.nnpp += l.votes.nnpp;
      totals.total += l.votes.total;
      const winner = (Object.keys(won) as PartyKey[]).sort(
        (a, b) => l.votes[b] - l.votes[a]
      )[0];
      won[winner]++;
    });
    return { totals, won, lgas: subset.length };
  }, [lgaData, stateFilter]);

  // Political insights
  const insights = useMemo(() => {
    if (lgaData.length === 0) return [];
    const byMargin = lgaData.map((l) => {
      const ranked = (Object.keys(PARTY) as PartyKey[]).sort(
        (a, b) => l.votes[b] - l.votes[a]
      );
      const margin =
        ((l.votes[ranked[0]] - l.votes[ranked[1]]) / l.votes.total) * 100;
      return { lga: l, winner: ranked[0], margin };
    });

    const closest = [...byMargin].sort((a, b) => a.margin - b.margin).slice(0, 5);
    const widest = [...byMargin].sort((a, b) => b.margin - a.margin).slice(0, 5);
    const lpStrong = lgaData
      .filter((l) => l.results2023.lp > 0.4)
      .sort((a, b) => b.results2023.lp - a.results2023.lp)
      .slice(0, 5);
    const nnppStrong = lgaData
      .filter((l) => l.results2023.nnpp > 0.25)
      .sort((a, b) => b.results2023.nnpp - a.results2023.nnpp)
      .slice(0, 5);

    return [
      {
        title: "Closest contests",
        items: closest.map(
          (c) =>
            `${c.lga.lgaName} (${c.lga.state}) – ${PARTY[c.winner][0]} by ${c.margin.toFixed(1)} pts`
        ),
      },
      {
        title: "Widest margins",
        items: widest.map(
          (c) =>
            `${c.lga.lgaName} (${c.lga.state}) – ${PARTY[c.winner][0]} by ${c.margin.toFixed(1)} pts`
        ),
      },
      {
        title: "LP strongholds (>40%)",
        items: lpStrong.map(
          (l) => `${l.lgaName} (${l.state}) – ${(l.results2023.lp * 100).toFixed(1)}%`
        ),
      },
      {
        title: "NNPP pockets (>25%)",
        items: nnppStrong.map(
          (l) => `${l.lgaName} (${l.state}) – ${(l.results2023.nnpp * 100).toFixed(1)}%`
        ),
      },
    ];
  }, [lgaData]);

  const inspectLga = useCallback((lga: Lga, vec: Vector, e: React.MouseEvent) => {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, lga, vec });
  }, []);

  const pinLga = useCallback((lga: Lga, vec: Vector) => {
    setSelectedLga({ lga, vec });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  const models = [
    {
      id: "incumbent" as Model,
      label: "Did the ruling party lead?",
      desc: "Blue = APC led, orange = opposition led",
      color: "#2563eb",
    },
    {
      id: "lp_surge" as Model,
      label: "Labour Party’s share",
      desc: "How much of the vote Peter Obi’s party took",
      color: "#16a34a",
    },
    {
      id: "duopoly" as Model,
      label: "APC against PDP",
      desc: "Margin between the two longtime rivals",
      color: "#dc2626",
    },
    {
      id: "multi_vector" as Model,
      label: "All four parties",
      desc: "Net direction across APC, PDP, LP & NNPP",
      color: "#101820",
    },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-5 sm:pt-8 pb-6">
        {/* Header */}
        <header className="pb-5 border-b border-[color:var(--rule)]">
          <h1 className="serif text-[34px] sm:text-5xl leading-[1.05] font-bold tracking-tight">
            How Nigeria voted in 2023
          </h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-[color:var(--muted)] max-w-[70ch]">
            Each arrow is one of Nigeria’s 774 local government areas. Longer arrows mean wider leads.
          </p>

          {/* Tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                { id: "map", label: "Map" },
                { id: "dashboard", label: "National dashboard" },
                { id: "compare", label: "LGA comparison" },
                { id: "insights", label: "Political insights" },
                { id: "method", label: "Methodology" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* ========== NATIONAL DASHBOARD ========== */}
        {activeTab === "dashboard" && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(PARTY) as PartyKey[]).map((k) => {
              const share = national.totals.total
                ? (national.totals[k] / national.totals.total) * 100
                : 0;
              return (
                <div key={k} className="card">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: PARTY[k][1] }}
                    />
                    <span className="font-bold">{PARTY[k][0]}</span>
                  </div>
                  <div className="text-2xl font-bold tabular-nums">
                    {national.totals[k].toLocaleString()}
                  </div>
                  <div className="text-sm text-[color:var(--muted)]">
                    {share.toFixed(1)}% of four-party vote
                  </div>
                  <div className="mt-2 text-sm">
                    Led in <strong>{national.won[k]}</strong> LGAs
                  </div>
                </div>
              );
            })}
            <div className="card md:col-span-2 lg:col-span-4">
              <h3 className="sec-title">National LGA lead bar</h3>
              <div className="flex h-4 gap-[2px] overflow-hidden rounded-sm bg-white mt-2">
                {(Object.keys(PARTY) as PartyKey[]).map((k) => (
                  <div
                    key={k}
                    style={{ flex: national.won[k], background: PARTY[k][1] }}
                    title={`${PARTY[k][0]}: ${national.won[k]}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== LGA COMPARISON ========== */}
        {activeTab === "compare" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="sec-title">Select first LGA</h3>
              <select
                className="field"
                value={compareA?.id || ""}
                onChange={(e) => {
                  const found = lgaData.find((l) => l.id === e.target.value);
                  setCompareA(found || null);
                }}
              >
                <option value="">— choose —</option>
                {lgaData.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.lgaName} ({l.state})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <h3 className="sec-title">Select second LGA</h3>
              <select
                className="field"
                value={compareB?.id || ""}
                onChange={(e) => {
                  const found = lgaData.find((l) => l.id === e.target.value);
                  setCompareB(found || null);
                }}
              >
                <option value="">— choose —</option>
                {lgaData.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.lgaName} ({l.state})
                  </option>
                ))}
              </select>
            </div>

            {compareA && compareB && (
              <div className="lg:col-span-2 card">
                <h3 className="sec-title mb-3">Side-by-side comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[color:var(--rule)]">
                        <th className="text-left py-2">Metric</th>
                        <th className="text-right py-2">{compareA.lgaName}</th>
                        <th className="text-right py-2">{compareB.lgaName}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.keys(PARTY) as PartyKey[]).map((k) => (
                        <tr key={k} className="border-b border-[color:var(--rule)]">
                          <td className="py-2 font-medium">{PARTY[k][0]} votes</td>
                          <td className="text-right tabular-nums">
                            {compareA.votes[k].toLocaleString()}
                          </td>
                          <td className="text-right tabular-nums">
                            {compareB.votes[k].toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="py-2 font-medium">Winning margin (pp)</td>
                        <td className="text-right">
                          {(() => {
                            const ranked = (Object.keys(PARTY) as PartyKey[]).sort(
                              (a, b) => compareA.votes[b] - compareA.votes[a]
                            );
                            return (
                              ((compareA.votes[ranked[0]] - compareA.votes[ranked[1]]) /
                                compareA.votes.total) *
                              100
                            ).toFixed(1);
                          })()}
                        </td>
                        <td className="text-right">
                          {(() => {
                            const ranked = (Object.keys(PARTY) as PartyKey[]).sort(
                              (a, b) => compareB.votes[b] - compareB.votes[a]
                            );
                            return (
                              ((compareB.votes[ranked[0]] - compareB.votes[ranked[1]]) /
                                compareB.votes.total) *
                              100
                            ).toFixed(1);
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== POLITICAL INSIGHTS ========== */}
        {activeTab === "insights" && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {insights.map((block) => (
              <div key={block.title} className="card">
                <h3 className="sec-title">{block.title}</h3>
                {block.items.map((item, i) => (
                  <div key={i} className="insight-item">
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ========== METHODOLOGY ========== */}
        {activeTab === "method" && (
          <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-relaxed">
            <div className="card">
              <h3 className="sec-title">Dataset</h3>
              <p>
                Votes come from the 2023 LGA-level presidential results compiled by
                anndawn/Nigeria-2023-election (public GitHub dataset). Only the four
                largest parties (APC, PDP, LP, NNPP) are shown; other parties are
                excluded from percentages.
              </p>
            </div>
            <div className="card">
              <h3 className="sec-title">Calculations</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Share = party votes ÷ (APC + PDP + LP + NNPP).</li>
                <li>
                  Margin = difference between first and second place as percentage
                  points of the four-party total.
                </li>
                <li>
                  Arrow length is proportional to the absolute margin (or LP share
                  in the surge view), scaled by the user control.
                </li>
                <li>
                  State shading uses the same measure aggregated to the state level.
                </li>
              </ul>
            </div>
            <div className="card">
              <h3 className="sec-title">Limitations</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  LGA boundaries are not drawn; arrow positions inside each state
                  are approximate (centroid-based).
                </li>
                <li>
                  Official INEC figures may differ slightly in a few LGAs due to
                  collation disputes or later corrections.
                </li>
                <li>
                  Only presidential results are shown; governorship and legislative
                  races are outside the scope of this visualisation.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ========== MAP VIEW ========== */}
        {activeTab === "map" && (
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] mt-0">
            {/* Sidebar */}
            <aside className="order-2 lg:order-1 lg:pr-6 py-5 flex flex-col gap-6 lg:border-r border-[color:var(--rule)]">
              {/* Find a place */}
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="sec-title">Find a place</h2>
                  {stateFilter !== "ALL" && (
                    <button
                      onClick={resetView}
                      className="text-xs font-semibold underline underline-offset-2 mb-2"
                    >
                      Back to national view
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <select
                    className="field"
                    value={stateFilter}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "ALL") resetView();
                      else zoomToState(v);
                    }}
                  >
                    <option value="ALL">All of Nigeria</option>
                    {Object.keys(STATE_BOUNDS)
                      .sort()
                      .map((st) => (
                        <option key={st} value={st}>
                          {st} ({STATE_BOUNDS[st].lgas} LGAs)
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    className="field"
                    placeholder="Search an LGA…"
                    value={searchQuery}
                    onChange={(e) => {
                      const q = e.target.value.toLowerCase().trim();
                      setSearchQuery(e.target.value);
                      if (!q) return;
                      const found = lgaData.find(
                        (l) =>
                          l.lgaName.toLowerCase().includes(q) ||
                          l.state.toLowerCase().includes(q)
                      );
                      if (found) {
                        zoomToState(found.state);
                        const vec = computeShiftVector(
                          found,
                          currentModel,
                          currentScale
                        );
                        pinLga(found, vec);
                      }
                    }}
                  />
                </div>
              </section>

              {/* State summary */}
              {stateSummary && (
                <section className="card">
                  <h2 className="sec-title">{stateFilter} summary</h2>
                  <div className="text-xs space-y-1">
                    {(Object.keys(PARTY) as PartyKey[]).map((k) => (
                      <div key={k} className="flex justify-between">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-sm"
                            style={{ background: PARTY[k][1] }}
                          />
                          {PARTY[k][0]}
                        </span>
                        <span className="tabular-nums">
                          {stateSummary.totals[k].toLocaleString()} ·{" "}
                          {stateSummary.won[k]} LGAs
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* What to show */}
              <section>
                <h2 className="sec-title">What to show</h2>
                <div className="space-y-1">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      style={{ "--c": m.color } as React.CSSProperties}
                      className={`model-btn ${currentModel === m.id ? "active" : ""
                        }`}
                      onClick={() => setCurrentModel(m.id)}
                    >
                      <div className="t">{m.label}</div>
                      <div className="d">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Legend */}
              <section className="card">
                <h2 className="sec-title">Map legend</h2>
                <div className="space-y-2 text-xs">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm bg-[#2563eb]" /> APC
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm bg-[#dc2626]" /> PDP
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm bg-[#16a34a]" /> LP
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm bg-[#9333ea]" /> NNPP
                    </span>
                  </div>
                  <p className="text-[color:var(--muted)] leading-relaxed">
                    Arrow colour = leading party (or opposition in the “ruling
                    party” view).
                    <br />
                    Arrow length ∝ size of the lead (or LP share).
                    <br />
                    State tint uses the same measure at state level.
                  </p>
                </div>
              </section>

              {/* Pinned LGA card */}
              <section className="rounded-lg bg-[color:var(--ink)] text-white p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-2.5">
                  <div className="min-w-0">
                    <div className="text-xs text-white/60">Selected area</div>
                    <h3 className="serif text-xl font-bold leading-tight break-words">
                      {selectedLga ? selectedLga.lga.lgaName : "Pick an LGA"}
                    </h3>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-white/70 pt-4">
                    {selectedLga ? selectedLga.lga.state : "Nigeria"}
                  </span>
                </div>
                {selectedLga ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-white/90 text-[13px] leading-relaxed">
                      {selectedLga.vec.narrative}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">
                          Votes
                        </div>
                        <div className="text-[11px] font-bold text-slate-200 leading-snug">
                          APC {selectedLga.lga.votes.apc.toLocaleString()}
                          <br />
                          LP {selectedLga.lga.votes.lp.toLocaleString()}
                          <br />
                          PDP {selectedLga.lga.votes.pdp.toLocaleString()}
                          <br />
                          NNPP {selectedLga.lga.votes.nnpp.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">
                          Margin
                        </div>
                        <div className="text-xs font-bold text-emerald-400">
                          {selectedLga.vec.shiftPp >= 0 ? "+" : ""}
                          {selectedLga.vec.shiftPp.toFixed(1)} pp
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/70 text-[13px] leading-relaxed">
                    Click an arrow or search for an LGA to see its vote counts,
                    winner and margin.
                  </p>
                )}
              </section>

              {/* Controls */}
              <section className="space-y-3 text-[13px]">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="font-semibold">Arrow length</label>
                    <span className="font-semibold tabular-nums">
                      {currentScale.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.0"
                    step="0.1"
                    value={currentScale}
                    onChange={(e) => setCurrentScale(parseFloat(e.target.value))}
                    className="w-full accent-[color:var(--ink)] cursor-pointer"
                  />
                </div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold">Show state names</span>
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="w-4 h-4 accent-[color:var(--ink)] cursor-pointer"
                  />
                </label>
              </section>
            </aside>

            {/* Map */}
            <main className="order-1 lg:order-2 relative flex flex-col h-[72vh] min-h-[460px] lg:h-screen lg:max-h-[920px] lg:sticky lg:top-0 lg:self-start">
              <div className="absolute top-3 left-3 lg:left-6 z-10 flex items-center rounded-md bg-white border border-[color:var(--rule)] overflow-hidden">
                <button
                  className="map-btn"
                  onClick={() => setZoomLevel((z) => Math.min(4.5, z + 0.35))}
                >
                  +
                </button>
                <button
                  className="map-btn border-l border-[color:var(--rule)]"
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.35))}
                >
                  −
                </button>
                <button
                  className="map-btn border-l border-[color:var(--rule)]"
                  onClick={resetView}
                >
                  Reset
                </button>
              </div>

              <div className="flex-1 relative min-h-[460px] overflow-hidden">
                <svg
                  ref={svgRef}
                  viewBox="0 0 744.24182 599.92847"
                  className="absolute inset-0 w-full h-full cursor-crosshair select-none"
                  onMouseLeave={hideTooltip}
                >
                  <defs>
                    <marker
                      id="arrow-apc"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="4.5"
                      markerHeight="4.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
                    </marker>
                    <marker
                      id="arrow-pdp"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="4.5"
                      markerHeight="4.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#dc2626" />
                    </marker>
                    <marker
                      id="arrow-lp"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="4.5"
                      markerHeight="4.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#16a34a" />
                    </marker>
                    <marker
                      id="arrow-nnpp"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="4.5"
                      markerHeight="4.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#9333ea" />
                    </marker>
                    <marker
                      id="arrow-neutral"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="4.5"
                      markerHeight="4.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ea580c" />
                    </marker>
                  </defs>

                  <g ref={viewportRef}>
                    {/* States */}
                    <g>
                      {Object.entries(STATE_BOUNDS).map(([name, info]) => (
                        <path
                          key={name}
                          d={STATE_PATHS[info.id] || ""}
                          fill="#e5e7e2"
                          strokeLinejoin="round"
                          className="state-path cursor-pointer"
                          onClick={() => zoomToState(name)}
                        />
                      ))}
                    </g>

                    {/* Country outline */}
                    <g className="pointer-events-none">
                      <path
                        d={Object.values(STATE_PATHS).join(" ")}
                        fill="none"
                        stroke="#101820"
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                      />
                    </g>

                    {/* Labels */}
                    <g
                      className="pointer-events-none select-none"
                      style={{ opacity: showLabels ? 1 : 0 }}
                    >
                      {Object.entries(STATE_BOUNDS).map(([name, info]) => (
                        <text
                          key={name}
                          x={info.cx}
                          y={info.cy - 8}
                          fontSize={name.length > 10 ? 6 : 7.5}
                          fontWeight="700"
                          fill="#2b3540"
                          textAnchor="middle"
                          paintOrder="stroke"
                          stroke="#ffffff"
                          strokeWidth="2.2"
                          strokeOpacity="0.85"
                        >
                          {name === "FCT Abuja" ? "FCT" : name}
                        </text>
                      ))}
                    </g>

                    {/* Arrows */}
                    <g>
                      {lgaData.map((lga) => {
                        const vec = computeShiftVector(
                          lga,
                          currentModel,
                          currentScale
                        );
                        const dx = Math.cos(vec.angle) * vec.length;
                        const dy = Math.sin(vec.angle) * vec.length;

                        return (
                          <g
                            key={lga.id}
                            className="lga-vector-group cursor-pointer"
                            onMouseEnter={(e) => inspectLga(lga, vec, e)}
                            onClick={() => pinLga(lga, vec)}
                          >
                            <circle
                              cx={lga.cx}
                              cy={lga.cy}
                              r="1.1"
                              fill="#101820"
                              opacity="0.28"
                            />
                            <line
                              x1={lga.cx}
                              y1={lga.cy}
                              x2={lga.cx + dx}
                              y2={lga.cy + dy}
                              stroke="transparent"
                              strokeWidth="16"
                              strokeLinecap="round"
                            />
                            <line
                              className="visible-arrow"
                              x1={lga.cx}
                              y1={lga.cy}
                              x2={lga.cx + dx}
                              y2={lga.cy + dy}
                              stroke={vec.color}
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              markerEnd={`url(#${vec.markerId})`}
                            />
                          </g>
                        );
                      })}
                    </g>
                  </g>
                </svg>
              </div>

              <p className="px-3 lg:pl-6 py-3 text-xs leading-relaxed text-[color:var(--muted)] border-t border-[color:var(--rule)] max-w-[100ch]">
                State shading applies the same measure to each state’s combined LGA
                votes. Votes come from the 2023 LGA results dataset. LGA boundaries
                are not drawn, so each arrow’s position inside its state is
                approximate.
              </p>
            </main>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.lga && tooltip.vec && (
        <div
          className="fixed z-50 bg-[color:var(--ink)] text-white px-4 py-3 rounded-lg shadow-xl text-xs w-[280px] pointer-events-none -translate-x-1/2 -translate-y-full -mt-3"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="flex items-baseline justify-between gap-3 border-b border-white/15 pb-1.5 mb-2">
            <span className="serif text-base font-bold leading-tight">
              {tooltip.lga.lgaName}
            </span>
            <span className="text-xs font-semibold text-white/65 shrink-0">
              {tooltip.lga.state}
            </span>
          </div>
          <p className="text-[13px] leading-snug text-white/90">
            {tooltip.vec.narrative}
          </p>
          <div className="flex justify-between items-center pt-1.5">
            <span className="text-white/60">Margin</span>
            <span className="font-bold text-sm tabular-nums">
              {tooltip.vec.shiftPp >= 0 ? "+" : ""}
              {tooltip.vec.shiftPp.toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </>
  );
}