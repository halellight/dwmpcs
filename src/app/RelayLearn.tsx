import { useEffect, useState, useMemo, useRef } from "react";
import confetti from "canvas-confetti";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Users,
  ShieldCheck,
  Share2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Calendar,
  Trash2,
  Send,
  Search,
  Flame,
  Award,
  HelpCircle,
  UserCheck,
  ChevronRight,
  Info
} from "lucide-react";

/* RelayLearn: learner app and educator dashboard in one component.
   Data lives in localStorage. Designed for community learning nodes,
   shared tablets, and mobile learners. */

type Q = [string, string[], number, string];
type Rec = { s: number; m: number[] };
type Learner = { id: string; f: string; c: string; p: Record<string, Rec>; t: number; x?: boolean; pk?: boolean };
type Store = { cur: string | null; ls: Learner[] };

const LS = "relaylearn.v2";
const CLS = ["JSS1A", "JSS1B", "JSS2A", "JSS2B", "JSS3A", "JSS3B"];
const AL = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const LES: { id: string; t: string; pts: string[]; q: Q[]; icon: string; category: string }[] = [
  {
    id: "eng",
    t: "English: Intonation",
    category: "Languages",
    icon: "🗣️",
    pts: [
      "Intonation is how your voice rises and falls when you speak.",
      "Yes or no questions usually rise at the end: “Are you coming?”",
      "Statements usually fall at the end: “Close the door.”"
    ],
    q: [
      ["Intonation is…", ["the rise and fall of the voice", "the spelling of a word", "how fast you write"], 0, "Meaning of intonation"],
      ["Which usually ends with a falling tone?", ["Close the door.", "Are you coming?", "Is it ready?"], 0, "Falling tone"],
      ["“Is it ready?” usually ends with…", ["a falling tone", "a rising tone", "no change"], 1, "Rising tone"]
    ]
  },
  {
    id: "math",
    t: "Maths: Fractions",
    category: "Mathematics",
    icon: "➗",
    pts: [
      "Ada shares 8 pieces of akara equally between 2 friends. Each gets 4 of 8, which is ½ of the akara.",
      "The top number is the numerator. The bottom number is the denominator.",
      "Same denominator? Add the tops: 2/7 + 3/7 = 5/7."
    ],
    q: [
      ["In 3/8, which number is the denominator?", ["3", "8", "11"], 1, "Denominator"],
      ["What is 2/7 + 3/7?", ["5/14", "5/7", "6/7"], 1, "Adding fractions"],
      ["Which fraction equals ½?", ["2/4", "2/5", "1/4"], 0, "Equivalent fractions"]
    ]
  },
  {
    id: "sci",
    t: "Science: States of Matter",
    category: "Basic Science",
    icon: "🔬",
    pts: [
      "Solids keep their shape. Liquids take the shape of the container. Gases fill the whole container.",
      "Melting turns a solid into a liquid. Freezing does the reverse.",
      "Wet clothes dry on a line by evaporation: liquid water becomes a gas."
    ],
    q: [
      ["Ice melting becomes…", ["liquid water", "a gas", "a harder solid"], 0, "Melting"],
      ["Wet clothes drying on a line is…", ["condensation", "evaporation", "freezing"], 1, "Evaporation"],
      ["Which has no fixed shape or volume?", ["stone", "water", "air"], 2, "Gases"]
    ]
  },
];

/* name, days since last active, scores for English, Maths, Science (-1 = not started) */
const SEED: [string, number, number, number, number][] = [
  ["Amina", 1, 3, 3, 2], ["Chidi", 2, 2, 1, 3], ["Ngozi", 0, 3, 3, 3], ["Musa", 9, 1, -1, -1],
  ["Blessing", 3, 2, 2, 1], ["Ibrahim", 12, 0, -1, -1], ["Hauwa", 1, 3, 2, 2], ["Emeka", 4, 1, 1, 2],
  ["Zainab", 2, 3, 3, 1], ["Tunde", 8, 2, -1, -1], ["Grace", 1, 3, 3, 3], ["Yusuf", 5, 1, 0, 1],
];

const seed = (): Store => ({
  cur: null,
  ls: SEED.map((r, i) => {
    const p: Record<string, Rec> = {};
    LES.forEach((x, k) => {
      const s = r[2 + k] as number;
      if (s >= 0) p[x.id] = { s, m: Array.from({ length: 3 - s }, (_, j) => (i + k + j * 2) % 3) };
    });
    return { id: "RL-S" + String(i + 1).padStart(2, "0"), f: r[0], c: "JSS1A", p, t: Date.now() - r[1] * 864e5, x: true };
  }),
});

const load = (): Store => {
  try {
    const d = JSON.parse(localStorage.getItem(LS) || "null");
    if (d && Array.isArray(d.ls)) return d;
  } catch { }
  return seed();
};

const days = (l: Learner) => (Date.now() - l.t) / 864e5;
const ago = (l: Learner) => {
  const d = Math.floor(days(l));
  return d < 1 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
};
const lesson = (id: string) => LES.find((x) => x.id === id)!;
const done = (l: Learner) => LES.filter((x) => l.p[x.id]).length;
const bucket = (r?: Rec) => (!r ? "n" : r.s === 3 ? "g" : r.s === 2 ? "a" : "r");
const mkId = (ls: Learner[]) => {
  let id: string;
  do {
    id = "RL-" + Array.from({ length: 4 }, () => AL[Math.floor(Math.random() * AL.length)]).join("");
  } while (ls.some((l) => l.id === id));
  return id;
};

export default function RelayLearn() {
  const [S, setS] = useState<Store>(load);
  const [tab, setTab] = useState<"learn" | "edu">("learn");
  const [les, setLes] = useState<string | null>(null);
  const [ans, setAns] = useState<Record<number, number>>({});
  const [plan, setPlan] = useState(false);
  const [code, setCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [el, setEl] = useState("eng");
  const [cf, setCf] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [nm, setNm] = useState("");
  const [cl, setCl] = useState(CLS[0]);
  const [cs, setCs] = useState(false);
  const [tc, setTc] = useState("");
  const [inc, setInc] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Educator search & filter
  const [eduSearch, setEduSearch] = useState("");
  const [eduFilter, setEduFilter] = useState<"all" | "attention" | "active">("all");
  const [eduClassFilter, setEduClassFilter] = useState<string>("all");

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LS, JSON.stringify(S));
    } catch { }
  }, [S]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  const upd = (fn: (s: Store) => void) =>
    setS((p) => {
      const n: Store = JSON.parse(JSON.stringify(p));
      fn(n);
      return n;
    });

  const me = S.ls.find((l) => l.id === S.cur);

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = (text: string) => {
    const synth = synthRef.current || (typeof window !== "undefined" ? window.speechSynthesis : null);
    if (!synth) return;

    if (synth.speaking) {
      stopAudio();
      return;
    }

    // Clean text for natural speech rhythm
    const cleaned = text
      .replace(/[:•]/g, ". ")
      .replace(/½/g, "one half")
      .replace(/\s+/g, " ")
      .trim();

    const u = new SpeechSynthesisUtterance(cleaned);

    // Pick best available English voice
    const voices = synth.getVoices();
    if (voices.length > 0) {
      const bestVoice =
        voices.find((v) => v.lang === "en-NG" || v.lang.startsWith("en-NG")) ||
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Online") ||
              v.name.includes("Google") ||
              v.name.includes("Jenny") ||
              v.name.includes("Aria") ||
              v.name.includes("Samantha"))
        ) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];

      if (bestVoice) {
        u.voice = bestVoice;
      }
    }

    u.rate = 0.95;
    u.pitch = 1.0;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synth.speak(u);
  };

  const go = (t: "learn" | "edu") => {
    setTab(t);
    setLes(null);
    setMsg("");
    stopAudio();
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  const pick = (id: string | null) => {
    upd((s) => {
      s.cur = id;
    });
    setLes(null);
    setCode("");
    setPlan(false);
    setMsg("");
    stopAudio();
  };

  const create = () => {
    const n = nm.trim().slice(0, 20);
    if (!n) return setMsg("Please enter a first name or nickname.");
    if (!cs) return setMsg("A parent or guardian must agree first.");
    const id = mkId(S.ls);
    upd((s) => {
      s.ls.push({ id, f: n, c: cl, p: {}, t: Date.now() });
      s.cur = id;
    });
    setNm("");
    setCs(false);
    setMsg(`Welcome ${n}! Your code is ${id}. Keep it safe.`);
  };

  const answer = (i: number, o: number) => {
    if (!les || ans[i] != null) return;
    const next = { ...ans, [i]: o };
    setAns(next);

    if (Object.keys(next).length === 3) {
      const L = lesson(les);
      const m = L.q.map((q, j) => (next[j] !== q[2] ? j : -1)).filter((j) => j >= 0);
      const score = 3 - m.length;
      upd((s) => {
        const l = s.ls.find((x) => x.id === s.cur)!;
        l.p[L.id] = { s: score, m };
        l.t = Date.now();
      });

      // Pass the baton celebration
      try {
        confetti({
          particleCount: score === 3 ? 80 : 45,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#10b981", "#f59e0b", "#3b82f6", "#10201a"],
        });
      } catch { }
    }
  };

  const makeCode = () => {
    if (!me) return;
    const p: Record<string, number[]> = {};
    LES.forEach((x) => {
      if (me.p[x.id]) p[x.id] = me.p[x.id].m;
    });
    const o: { i: string; c: string; p: typeof p; f?: string } = { i: me.id, c: me.c, p };
    if (inc) o.f = me.f;
    const str = "RL1." + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
    setCode(str);
  };

  const copyToClipboard = (text: string, isPassport = false) => {
    navigator.clipboard?.writeText(text);
    if (isPassport) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2200);
    }
  };

  const importCode = () => {
    try {
      const t = tc.trim();
      if (!t.startsWith("RL1.")) throw 0;
      const o = JSON.parse(decodeURIComponent(escape(atob(t.slice(4)))));
      const id = String(o.i || "").replace(/[^A-Z0-9-]/g, "").slice(0, 8);
      if (!id.startsWith("RL-")) throw 0;
      const p: Record<string, Rec> = {};
      LES.forEach((x) => {
        const m = o.p?.[x.id];
        if (Array.isArray(m)) {
          const u = m.filter((n: number, i: number) => [0, 1, 2].includes(n) && m.indexOf(n) === i);
          p[x.id] = { s: 3 - u.length, m: u };
        }
      });
      upd((s) => {
        const ex = s.ls.find((z) => z.id === id);
        if (ex) {
          LES.forEach((x) => {
            if (p[x.id] && (!ex.p[x.id] || p[x.id].s > ex.p[x.id].s)) ex.p[x.id] = p[x.id];
          });
          ex.t = Date.now();
        } else {
          s.ls.push({
            id,
            f: String(o.f || "Learner").slice(0, 20),
            c: CLS.includes(o.c) ? o.c : CLS[0],
            p,
            t: Date.now(),
          });
        }
        s.cur = id;
      });
      setTc("");
      setMsg("Record imported. Welcome to your new school.");
    } catch {
      setMsg("That code could not be read. Check it and try again.");
    }
  };

  const steps = (l: Learner) => [
    ...LES.filter((x) => !l.p[x.id]).map((x) => ({ x, k: "New lesson" })),
    ...LES.filter((x) => l.p[x.id] && l.p[x.id].s < 3).map((x) => ({ x, k: "Revise" })),
  ];

  /* ------------------- CATCH-UP PLAN HELPER ------------------- */
  const renderPlan = (l: Learner) => {
    const it = steps(l);
    return it.length ? (
      <div className="space-y-2 mt-3">
        {it.map((r, i) => (
          <div
            key={r.x.id}
            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-bold text-xs flex items-center justify-center shrink-0">
                Day {i + 1}
              </span>
              <div>
                <span className="font-semibold text-sm text-slate-900 block">
                  {r.x.t}
                </span>
                <span className="text-xs text-slate-600">
                  {r.k}, about 8 minutes
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setLes(r.x.id);
                setAns({});
                setTab("learn");
                window.scrollTo?.({ top: 0, behavior: "smooth" });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-700 hover:text-white text-xs font-semibold text-slate-800 border border-slate-300 transition"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-emerald-800 font-medium py-2">You are all caught up.</p>
    );
  };

  /* ------------------- LEARNER SELECTION VIEW ------------------- */
  const renderWho = () => (
    <div className="space-y-6">
      {/* Shared Device Selector */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
          <Users className="w-3.5 h-3.5" />
          Shared Device
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          Who is learning on this device?
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Devices are shared, so pick your name. No password or surname is needed.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
          {S.ls.map((x) => {
            const completedCount = done(x);
            return (
              <button
                key={x.id}
                onClick={() => pick(x.id)}
                className="group relative flex flex-col items-start p-4 text-left rounded-2xl border-2 border-slate-200 hover:border-emerald-700 bg-slate-50 hover:bg-emerald-50/50 transition duration-150 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-[#0f3d2e] text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                  {x.f.slice(0, 1)}
                </div>
                <div className="mt-3 font-semibold text-slate-900 text-base group-hover:text-emerald-900">
                  {x.f}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <span className="font-mono font-medium text-slate-700">{x.id}</span>
                  {x.x && <span className="text-[10px] bg-slate-200 px-1 rounded text-slate-600">sample</span>}
                </div>
                <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {completedCount}/{LES.length} completed
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Forms Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Learner Card */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-sans text-slate-900">New learner</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Pick a nickname. No surname, password, or phone number needed.
            </p>

            <div className="space-y-3.5 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  First name or nickname
                </label>
                <input
                  type="text"
                  value={nm}
                  maxLength={20}
                  onChange={(e) => setNm(e.target.value)}
                  placeholder="e.g. Amina"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Class
                </label>
                <select
                  value={cl}
                  onChange={(e) => setCl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {CLS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cs}
                  onChange={(e) => setCs(e.target.checked)}
                  className="mt-1 rounded text-emerald-700 focus:ring-emerald-700 h-4 w-4 border-slate-300"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  A parent or guardian agrees we keep this learner’s first name and scores.
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={create}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-[#0f3d2e] hover:bg-[#165541] active:scale-[0.99] text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Create my learning code
          </button>
        </section>

        {/* Transfer Import Card */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-sans text-slate-900">Joining from another school?</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Paste the transfer code from your last school. Your progress comes with you.
            </p>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Transfer code
              </label>
              <textarea
                value={tc}
                onChange={(e) => setTc(e.target.value)}
                placeholder="RL1.…"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <button
            onClick={importCode}
            disabled={!tc.trim()}
            className="mt-6 w-full py-3 px-4 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Import my record
          </button>
        </section>
      </div>
    </div>
  );

  /* ------------------- INTERACTIVE LESSON VIEW ------------------- */
  const renderLesson = (l: Learner) => {
    const L = lesson(les!);
    const n = Object.keys(ans).length;
    const r = l.p[L.id];

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setLes(null);
              stopAudio();
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-900 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to the track
          </button>

          <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            About 8 minutes
          </div>
        </div>

        {/* Lesson Overview Card */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 uppercase tracking-wider">
                {L.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900 mt-2">
                {L.t}
              </h2>
            </div>

            <button
              onClick={() => speak(L.t.replace(":", ".") + ". " + L.pts.join(". "))}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition shadow-sm ${isSpeaking
                ? "bg-amber-400 text-slate-950 ring-2 ring-amber-500 animate-pulse"
                : "bg-[#0f3d2e] text-white hover:bg-[#165541]"
                }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen or stop</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Key lesson points
            </h4>
            <ul className="space-y-2.5">
              {L.pts.map((x, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Practice Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-800" />
              Check your understanding (3 questions)
            </h3>
            <span className="text-xs text-slate-600 font-medium">
              {Object.keys(ans).length} of 3 answered
            </span>
          </div>

          {L.q.map((q, i) => {
            const chosen = ans[i];
            const isAnswered = chosen != null;
            const isCorrect = chosen === q[2];

            return (
              <section
                key={i}
                className={`bg-white border rounded-3xl p-6 transition shadow-sm ${isAnswered
                  ? isCorrect
                    ? "border-emerald-400 bg-emerald-50/40"
                    : "border-rose-400 bg-rose-50/40"
                  : "border-slate-200"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-semibold text-slate-900 text-base sm:text-lg">
                    <span className="text-emerald-800 font-bold mr-2">{i + 1}.</span>
                    {q[0]}
                  </h4>

                  {isAnswered && (
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isCorrect
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-rose-100 text-rose-900"
                        }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" /> Review
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="grid gap-2.5 mt-4">
                  {q[1].map((o, j) => {
                    const isSelected = chosen === j;
                    const isRightOption = j === q[2];
                    let btnStyle =
                      "border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-800";

                    if (isAnswered) {
                      if (isRightOption) {
                        btnStyle =
                          "border-emerald-600 bg-emerald-100 text-emerald-950 font-semibold ring-1 ring-emerald-600";
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          "border-rose-500 bg-rose-100 text-rose-950 font-medium";
                      } else {
                        btnStyle = "border-slate-200 opacity-50 text-slate-500";
                      }
                    }

                    return (
                      <button
                        key={o}
                        disabled={isAnswered}
                        onClick={() => answer(i, j)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition text-sm sm:text-base flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{o}</span>
                        {isAnswered && isRightOption && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Baton Handed Off celebration card */}
        {n === 3 && r && (
          <section className="bg-white border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-2">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Baton Passed
                </div>
                <h3 className="text-2xl font-bold font-sans text-slate-900">
                  You scored {r.s} out of 3.
                </h3>
                <p className="text-slate-600 text-sm mt-1 max-w-lg">
                  Saved on this device.{" "}
                  {r.m.length
                    ? `Practise next: ${r.m.map((j) => L.q[j][3]).join(", ")}.`
                    : "Excellent work! Try the next lesson."}
                </p>
              </div>

              <div className="shrink-0 flex sm:flex-col gap-2.5">
                <button
                  onClick={() => {
                    setLes(null);
                    window.scrollTo?.({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-[#0f3d2e] hover:bg-[#165541] text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                >
                  Back to track
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAns({})}
                  className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition border border-slate-300 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try again
                </button>
              </div>
            </div>

            {/* Visual Baton strip */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1.5">
                <span>Start</span>
                <span>Baton passed</span>
                <span>Saved</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${(r.s / 3) * 100}%` }}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    );
  };

  /* ------------------- LEARNER HOME VIEW ------------------- */
  const renderHome = (l: Learner) => {
    const next = LES.find((x) => !l.p[x.id])?.id;
    const progressPercent = Math.round((done(l) / LES.length) * 100);

    return (
      <div className="space-y-8">
        {/* Learner Welcome Banner - Light and Warm */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
                Hello, {l.f}
              </h2>
              <p className="text-slate-600 text-sm">
                Your code is <b className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">{l.id}</b>. It holds your lessons and scores, with no surname or address.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(l.id)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId ? "Code copied" : "Copy code"}
              </button>
              <button
                onClick={() => pick(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Switch learner
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Progress:</span>
              <span className="text-xs text-slate-600">
                {done(l)} of {LES.length} lessons completed ({progressPercent}%)
              </span>
            </div>
            <div className="flex-1 max-w-sm bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* Catch-up Notification if Teacher sent one */}
        {l.pk && (
          <section className="bg-amber-50 border-l-4 border-amber-400 border-y border-r border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Your teacher sent you a catch-up plan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Small, bite-sized daily steps to catch up.
                </p>
                {renderPlan(l)}
              </div>
            </div>
          </section>
        )}

        {/* The Track: Modular Lessons */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900">
            Your track
          </h3>

          <div className="grid gap-3.5">
            {LES.map((x, idx) => {
              const r = l.p[x.id];
              const isNext = x.id === next;
              const isMastered = r?.s === 3;
              const isPart = r && r.s < 3;

              return (
                <div
                  key={x.id}
                  className={`p-5 rounded-3xl border transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isNext
                    ? "bg-white border-2 border-amber-400 shadow-sm"
                    : "bg-white border-slate-200 shadow-sm"
                    }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${isMastered
                        ? "bg-emerald-600 text-white"
                        : isPart
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : isNext
                            ? "bg-amber-400 text-slate-900"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                    >
                      {isMastered ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {x.category}
                        </span>
                        {isNext && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                            Next up
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        {x.t}
                      </h4>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {r
                          ? `Score ${r.s} out of 3`
                          : isNext
                            ? "Next up, 8 minutes"
                            : "Not started, 8 minutes"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <button
                      onClick={() => {
                        setLes(x.id);
                        setAns({});
                        window.scrollTo?.({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 ${isNext
                        ? "bg-[#0f3d2e] hover:bg-[#165541] text-white"
                        : r
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                          : "bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 border border-slate-200"
                        }`}
                    >
                      {r ? "Review" : "Start"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Catch-up & Transfer Tools */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Catch-up Plan Card */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="text-lg font-bold font-sans text-slate-900">Missed some school?</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Get a short plan to catch up, one small step a day. Every lesson also works as audio.
            </p>

            <button
              onClick={() => setPlan(!plan)}
              className="mt-4 px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-800 transition"
            >
              {plan ? "Hide plan" : "Show my catch-up plan"}
            </button>

            {plan && renderPlan(l)}
          </section>

          {/* Transfer Passport */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="text-lg font-bold font-sans text-slate-900">
              Moving schools or leaving home?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Make a transfer code. It carries only your learning record, so you can continue anywhere without a national records system.
            </p>

            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={inc}
                  onChange={(e) => setInc(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                Include my first name
              </label>

              <button
                onClick={makeCode}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                Make my transfer code
              </button>
            </div>

            {code && (
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-300 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Your Transfer Code:</span>
                  <button
                    onClick={() => copyToClipboard(code, true)}
                    className="flex items-center gap-1 font-bold text-emerald-800 hover:underline"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? "Copied" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={code}
                  rows={2}
                  className="w-full text-xs font-mono bg-white p-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <p className="text-[11px] text-slate-500">
                  Give this to your new teacher or Steward. Keep it private.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  /* ------------------- EDUCATOR DASHBOARD VIEW ------------------- */
  const renderEdu = () => {
    const L = lesson(el);
    const d = S.ls.filter((l) => l.p[L.id]);
    const u = d.filter((l) => l.p[L.id].s === 3).length;
    const a = d.filter((l) => l.p[L.id].s === 2).length;
    const r = d.length - u - a;
    const N = d.length || 1;
    const aw = S.ls.filter((l) => days(l) >= 7);

    // Filter learners
    const filteredLearners = S.ls.filter((l) => {
      const matchesSearch =
        l.f.toLowerCase().includes(eduSearch.toLowerCase()) ||
        l.id.toLowerCase().includes(eduSearch.toLowerCase());
      const matchesClass = eduClassFilter === "all" || l.c === eduClassFilter;
      const matchesStatus =
        eduFilter === "all"
          ? true
          : eduFilter === "attention"
            ? days(l) >= 7 || Object.values(l.p).some((p) => p.s < 2)
            : days(l) < 7;
      return matchesSearch && matchesClass && matchesStatus;
    });

    return (
      <div className="space-y-8">
        {/* Class Overview Cards */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold font-sans text-slate-900">Class overview</h2>
          <p className="text-slate-600 text-sm mt-0.5">
            First names and learner codes only. In a pilot, access is limited to the teacher and Steward.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <b className="block text-3xl font-bold font-sans text-slate-900">{S.ls.length}</b>
              <span className="text-xs text-slate-600 font-medium">learners</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <b className="block text-3xl font-bold font-sans text-emerald-800">
                {S.ls.length - aw.length}
              </b>
              <span className="text-xs text-slate-600 font-medium">active this week</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <b className={`block text-3xl font-bold font-sans ${aw.length ? "text-rose-600" : "text-slate-900"}`}>
                {aw.length}
              </b>
              <span className="text-xs text-slate-600 font-medium">away 7+ days</span>
            </div>
          </div>
        </section>

        {/* Learning Gap Detector */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-sans text-slate-900">
                Learning gap detector
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                See topic comprehension and questions most often missed.
              </p>
            </div>

            <div className="min-w-[200px]">
              <select
                value={el}
                onChange={(e) => setEl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-700"
              >
                {LES.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mastery Bar */}
          <div>
            <div className="flex h-7 rounded-xl overflow-hidden bg-slate-200 p-0.5 border border-slate-300">
              <span
                style={{ width: `${(u / N) * 100}%` }}
                className="bg-emerald-600 h-full"
                title={`${u} Understood`}
              />
              <span
                style={{ width: `${(a / N) * 100}%` }}
                className="bg-amber-400 h-full"
                title={`${a} Need Support`}
              />
              <span
                style={{ width: `${(r / N) * 100}%` }}
                className="bg-rose-500 h-full"
                title={`${r} Need Revision`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <b>{u}</b> understood the topic
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <b>{a}</b> need additional support
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <b>{r}</b> need a revision on the foundation
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {S.ls.length - d.length} not started. Understood is 3 of 3, support is 2 of 3, foundation is 0 or 1.
            </p>
          </div>

          {/* Questions most often missed */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Questions most often missed
            </h3>

            <div className="grid gap-3">
              {L.q.map((q, j) => {
                const pc = Math.round((d.filter((l) => l.p[L.id]?.m.includes(j)).length / N) * 100);
                return (
                  <div
                    key={j}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-slate-800">
                        {q[3]} <span className="text-slate-500 font-normal">({q[0]})</span>
                      </span>
                      <span className="font-bold text-slate-900">
                        {pc}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-500"
                        style={{ width: `${pc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Learner Lanes Matrix */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-sans text-slate-900">
                Learner lanes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Each lane is one learner. Each stop is a lesson, coloured by understanding.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={eduSearch}
                  onChange={(e) => setEduSearch(e.target.value)}
                  placeholder="Search name or ID..."
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <select
                value={eduClassFilter}
                onChange={(e) => setEduClassFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
              >
                <option value="all">All Classes</option>
                {CLS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={eduFilter}
                onChange={(e) => setEduFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
              >
                <option value="all">All Status</option>
                <option value="attention">Needs Attention</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Learner</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3 text-center">English • Maths • Science</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLearners.map((l) => {
                  const isAway = days(l) >= 7;
                  return (
                    <tr key={l.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {l.f}
                          {l.x && (
                            <span className="text-[10px] font-normal px-1 rounded bg-slate-200 text-slate-600">
                              sample
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs text-slate-400">{l.id}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {l.c}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-3">
                          {LES.map((x) => {
                            const b = bucket(l.p[x.id]);
                            const color =
                              b === "g"
                                ? "bg-emerald-600 text-white"
                                : b === "a"
                                  ? "bg-amber-400 text-slate-950"
                                  : b === "r"
                                    ? "bg-rose-500 text-white"
                                    : "bg-white border-2 border-slate-300 text-transparent";
                            return (
                              <div
                                key={x.id}
                                title={`${x.t}: ${l.p[x.id] ? l.p[x.id].s + " of 3" : "not started"}`}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${color}`}
                              >
                                {l.p[x.id] ? l.p[x.id].s : ""}
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isAway ? "text-rose-600 font-bold" : "text-slate-600"
                            }`}
                        >
                          {isAway ? `away ${Math.floor(days(l))} days` : ago(l)}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isAway && (
                            l.pk ? (
                              <span className="text-xs text-emerald-800 font-medium">
                                Plan sent
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  upd((s) => {
                                    s.ls.find((z) => z.id === l.id)!.pk = true;
                                  });
                                  setMsg(`Catch-up plan sent to ${l.f}.`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition"
                              >
                                Send plan
                              </button>
                            )
                          )}

                          {cf === l.id ? (
                            <button
                              onClick={() => {
                                upd((s) => {
                                  s.ls = s.ls.filter((z) => z.id !== l.id);
                                  if (s.cur === l.id) s.cur = null;
                                });
                                setCf(null);
                                setMsg("Record erased.");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
                            >
                              Confirm erase
                            </button>
                          ) : (
                            <button
                              onClick={() => setCf(l.id)}
                              className="text-xs text-slate-500 hover:text-rose-600 hover:underline px-2 py-1"
                            >
                              Erase
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Key:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              Understood
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              Needs support
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              Needs revision
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-white border border-slate-400" />
              Not started
            </div>
          </div>
        </section>

        {/* Protecting Children's Information - Simple, Direct, Straightforward */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#0f3d2e]" />
            <h2 className="text-2xl font-bold font-sans text-slate-900">
              Protecting children’s information
            </h2>
          </div>

          <p className="text-slate-600 text-sm">
            RelayLearn is built to keep children safe. We collect only what is needed for learning:
          </p>

          <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
            <li>
              Only a first name or nickname, class, learner code, and lesson scores are kept.
            </li>
            <li>
              No surname, home address, phone number, or photo is ever requested.
            </li>
            <li>
              A parent or guardian must agree before any learner record is created.
            </li>
            <li>
              Records move by transfer code, so school continuity never depends on a national database.
            </li>
            <li>
              Any learner’s record can be erased right here with one click.
            </li>
          </ul>

          {S.ls.some((l) => l.x) && (
            <div className="pt-2">
              <button
                onClick={() => {
                  upd((s) => {
                    s.ls = s.ls.filter((l) => !l.x);
                    if (!s.ls.some((l) => l.id === s.cur)) s.cur = null;
                  });
                  setMsg("Sample learners removed.");
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition border border-slate-300"
              >
                Remove sample learners
              </button>
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#eef3ee] text-[#10201a] antialiased selection:bg-emerald-600 selection:text-white">
      {/* Inline styles for original baton logo icon */}
      <style>{`
        .relay-baton-icon {
          width: 12px;
          height: 34px;
          border-radius: 6px;
          background: #f5b700;
          transform: rotate(24deg);
          box-shadow: -9px 5px 0 -2px #0f3d2e;
          display: inline-block;
          margin-right: 12px;
          margin-left: 6px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header with Original Logo */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#d3ddd5]">
          <div className="flex items-center">
            <i className="relay-baton-icon" aria-hidden="true" />
            <div>
              <div className="text-2xl sm:text-[1.7rem] font-bold font-sans text-[#10201a] leading-none">
                RelayLearn
              </div>
              <small className="block text-xs sm:text-[0.82rem] text-[#51635a] mt-1 font-sans">
                Learning that follows the child, not the device.
              </small>
            </div>
          </div>

          {/* Role View Toggle */}
          <nav
            aria-label="View"
            className="flex p-1 bg-white border border-[#d3ddd5] rounded-full shadow-sm self-start sm:self-auto"
          >
            <button
              onClick={() => go("learn")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition ${tab === "learn"
                ? "bg-[#0f3d2e] text-white"
                : "text-[#51635a] hover:text-[#10201a]"
                }`}
            >
              Learner
              {me && (
                <span className="text-[11px] font-normal opacity-90">
                  ({me.f})
                </span>
              )}
            </button>

            <button
              onClick={() => go("edu")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition ${tab === "edu"
                ? "bg-[#0f3d2e] text-white"
                : "text-[#51635a] hover:text-[#10201a]"
                }`}
            >
              Educator
            </button>
          </nav>
        </header>

        {/* Global Banner Notification */}
        {msg && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0f3d2e] text-white text-xs sm:text-sm shadow-sm">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{msg}</span>
            </div>
            <button
              onClick={() => setMsg("")}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Sections */}
        <main>
          {tab === "edu"
            ? renderEdu()
            : !me
              ? renderWho()
              : les
                ? renderLesson(me)
                : renderHome(me)}
        </main>

        {/* Footer */}
        <footer className="pt-6 pb-4 border-t border-[#d3ddd5] text-xs text-[#51635a] leading-relaxed">
          Demo data is stored in this browser only. In a pilot the app runs from a community learning node over local Wi-Fi. Scores marked sample are illustrative.
        </footer>
      </div>
    </div>
  );
}
