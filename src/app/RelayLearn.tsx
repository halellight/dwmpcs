import { useEffect, useState, type CSSProperties } from "react";

/* RelayLearn: learner app and educator dashboard in one component.
   Data lives in localStorage (demo). In a pilot, swap load/save for the community node's local API. */

type Q = [string, string[], number, string];
type Rec = { s: number; m: number[] };
type Learner = { id: string; f: string; c: string; p: Record<string, Rec>; t: number; x?: boolean; pk?: boolean };
type Store = { cur: string | null; ls: Learner[] };

const LS = "relaylearn.v2";
const CLS = ["JSS1A", "JSS1B", "JSS2A"];
const AL = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const LES: { id: string; t: string; pts: string[]; q: Q[] }[] = [
  { id: "eng", t: "English: Intonation",
    pts: ["Intonation is how your voice rises and falls when you speak.", "Yes or no questions usually rise at the end: “Are you coming?”", "Statements usually fall at the end: “Close the door.”"],
    q: [["Intonation is…", ["the rise and fall of the voice", "the spelling of a word", "how fast you write"], 0, "Meaning of intonation"],
        ["Which usually ends with a falling tone?", ["Close the door.", "Are you coming?", "Is it ready?"], 0, "Falling tone"],
        ["“Is it ready?” usually ends with…", ["a falling tone", "a rising tone", "no change"], 1, "Rising tone"]] },
  { id: "math", t: "Maths: Fractions",
    pts: ["Ada shares 8 pieces of akara equally between 2 friends. Each gets 4 of 8, which is ½ of the akara.", "The top number is the numerator. The bottom number is the denominator.", "Same denominator? Add the tops: 2/7 + 3/7 = 5/7."],
    q: [["In 3/8, which number is the denominator?", ["3", "8", "11"], 1, "Denominator"],
        ["What is 2/7 + 3/7?", ["5/14", "5/7", "6/7"], 1, "Adding fractions"],
        ["Which fraction equals ½?", ["2/4", "2/5", "1/4"], 0, "Equivalent fractions"]] },
  { id: "sci", t: "Science: States of Matter",
    pts: ["Solids keep their shape. Liquids take the shape of the container. Gases fill the whole container.", "Melting turns a solid into a liquid. Freezing does the reverse.", "Wet clothes dry on a line by evaporation: liquid water becomes a gas."],
    q: [["Ice melting becomes…", ["liquid water", "a gas", "a harder solid"], 0, "Melting"],
        ["Wet clothes drying on a line is…", ["condensation", "evaporation", "freezing"], 1, "Evaporation"],
        ["Which has no fixed shape or volume?", ["stone", "water", "air"], 2, "Gases"]] },
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
  } catch {}
  return seed();
};

const days = (l: Learner) => (Date.now() - l.t) / 864e5;
const ago = (l: Learner) => { const d = Math.floor(days(l)); return d < 1 ? "today" : d === 1 ? "yesterday" : `${d} days ago`; };
const lesson = (id: string) => LES.find((x) => x.id === id)!;
const done = (l: Learner) => LES.filter((x) => l.p[x.id]).length;
const bucket = (r?: Rec) => (!r ? "n" : r.s === 3 ? "g" : r.s === 2 ? "a" : "r");
const mkId = (ls: Learner[]) => { let id: string; do { id = "RL-" + Array.from({ length: 4 }, () => AL[Math.floor(Math.random() * AL.length)]).join(""); } while (ls.some((l) => l.id === id)); return id; };

function speak(text: string) {
  const w = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  if (!w) return;
  if (w.speaking) { w.cancel(); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-NG"; u.rate = 0.9; w.speak(u);
}

export default function RelayLearn() {
  const [S, setS] = useState<Store>(load);
  const [tab, setTab] = useState<"learn" | "edu">("learn");
  const [les, setLes] = useState<string | null>(null);
  const [ans, setAns] = useState<Record<number, number>>({});
  const [plan, setPlan] = useState(false);
  const [code, setCode] = useState("");
  const [el, setEl] = useState("eng");
  const [cf, setCf] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [nm, setNm] = useState(""); const [cl, setCl] = useState(CLS[0]); const [cs, setCs] = useState(false);
  const [tc, setTc] = useState(""); const [inc, setInc] = useState(false);

  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(S)); } catch {} }, [S]);

  const upd = (fn: (s: Store) => void) => setS((p) => { const n: Store = JSON.parse(JSON.stringify(p)); fn(n); return n; });
  const me = S.ls.find((l) => l.id === S.cur);
  const go = (t: "learn" | "edu") => { setTab(t); setLes(null); setMsg(""); window.speechSynthesis?.cancel(); window.scrollTo?.(0, 0); };
  const pick = (id: string | null) => { upd((s) => { s.cur = id; }); setLes(null); setCode(""); setPlan(false); setMsg(""); };

  const create = () => {
    const n = nm.trim().slice(0, 20);
    if (!n) return setMsg("Please type a first name or nickname.");
    if (!cs) return setMsg("A parent or guardian must agree first.");
    const id = mkId(S.ls);
    upd((s) => { s.ls.push({ id, f: n, c: cl, p: {}, t: Date.now() }); s.cur = id; });
    setNm(""); setCs(false); setMsg(`Your code is ${id}. Keep it safe.`);
  };

  const answer = (i: number, o: number) => {
    if (!les || ans[i] != null) return;
    const next = { ...ans, [i]: o };
    setAns(next);
    if (Object.keys(next).length === 3) {
      const L = lesson(les);
      const m = L.q.map((q, j) => (next[j] !== q[2] ? j : -1)).filter((j) => j >= 0);
      upd((s) => { const l = s.ls.find((x) => x.id === s.cur)!; l.p[L.id] = { s: 3 - m.length, m }; l.t = Date.now(); });
    }
  };

  const makeCode = () => {
    if (!me) return;
    const p: Record<string, number[]> = {};
    LES.forEach((x) => { if (me.p[x.id]) p[x.id] = me.p[x.id].m; });
    const o: { i: string; c: string; p: typeof p; f?: string } = { i: me.id, c: me.c, p };
    if (inc) o.f = me.f;
    setCode("RL1." + btoa(unescape(encodeURIComponent(JSON.stringify(o)))));
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
        if (Array.isArray(m)) { const u = m.filter((n: number, i: number) => [0, 1, 2].includes(n) && m.indexOf(n) === i); p[x.id] = { s: 3 - u.length, m: u }; }
      });
      upd((s) => {
        const ex = s.ls.find((z) => z.id === id);
        if (ex) { LES.forEach((x) => { if (p[x.id] && (!ex.p[x.id] || p[x.id].s > ex.p[x.id].s)) ex.p[x.id] = p[x.id]; }); ex.t = Date.now(); }
        else s.ls.push({ id, f: String(o.f || "Learner").slice(0, 20), c: CLS.includes(o.c) ? o.c : CLS[0], p, t: Date.now() });
        s.cur = id;
      });
      setTc(""); setMsg("Record imported. Welcome to your new school.");
    } catch { setMsg("That code could not be read. Check it and try again."); }
  };

  const steps = (l: Learner) => [
    ...LES.filter((x) => !l.p[x.id]).map((x) => ({ x, k: "New lesson" })),
    ...LES.filter((x) => l.p[x.id] && l.p[x.id].s < 3).map((x) => ({ x, k: "Revise" })),
  ];
  const Plan = ({ l }: { l: Learner }) => {
    const it = steps(l);
    return it.length ? (
      <ol className="plan">{it.map((r, i) => (
        <li key={r.x.id}><b>Day {i + 1}</b><span>{r.x.t}<small>{r.k}, about 8 minutes</small></span>
          <button className="ghost" onClick={() => { setLes(r.x.id); setAns({}); setTab("learn"); }}>Open</button></li>
      ))}</ol>
    ) : <p>You are all caught up.</p>;
  };

  /* ---------- learner ---------- */
  const Who = () => (
    <>
      <section className="card">
        <h2>Who is learning on this device?</h2>
        <p className="mut">Devices are shared, so pick your name. No password or surname is needed.</p>
        <div className="chips">{S.ls.map((x) => (
          <button key={x.id} className="chip" onClick={() => pick(x.id)}>{x.f}<small>{x.id}{x.x ? " (sample)" : ""}</small></button>
        ))}</div>
      </section>
      <section className="card">
        <h2>New learner</h2>
        <input value={nm} maxLength={20} onChange={(e) => setNm(e.target.value)} placeholder="First name or nickname" aria-label="First name or nickname" />
        <select value={cl} onChange={(e) => setCl(e.target.value)} aria-label="Class">{CLS.map((c) => <option key={c}>{c}</option>)}</select>
        <label className="chk"><input type="checkbox" checked={cs} onChange={(e) => setCs(e.target.checked)} /> A parent or guardian agrees we keep this learner’s first name and scores.</label>
        <button className="pri" onClick={create}>Create my learning code</button>
      </section>
      <section className="card">
        <h2>Joining from another school?</h2>
        <p className="mut">Paste the transfer code from your last school. Your progress comes with you.</p>
        <input value={tc} onChange={(e) => setTc(e.target.value)} placeholder="RL1.…" aria-label="Transfer code" />
        <button onClick={importCode}>Import my record</button>
      </section>
    </>
  );

  const Lesson = ({ l }: { l: Learner }) => {
    const L = lesson(les!), n = Object.keys(ans).length, r = l.p[L.id];
    return (
      <>
        <button className="ghost" onClick={() => { setLes(null); window.speechSynthesis?.cancel(); }}>Back to the track</button>
        <section className="card">
          <h2>{L.t}</h2>
          <button className="pri" onClick={() => speak(L.t.replace(":", ".") + ". " + L.pts.join(" "))}>Listen or stop</button>
          <ul>{L.pts.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>
        {L.q.map((q, i) => (
          <section className="card" key={i}>
            <h3>{i + 1}. {q[0]}</h3>
            <div className="opts">{q[1].map((o, j) => (
              <button key={o} className={ans[i] == null ? "" : j === q[2] ? "right" : j === ans[i] ? "wrong" : ""} onClick={() => answer(i, j)}>{o}</button>
            ))}</div>
          </section>
        ))}
        {n === 3 && r && (
          <section className="card note">
            <h3>You scored {r.s} out of 3. Baton passed.</h3>
            <div className="strip" aria-hidden="true"><i className="baton" /></div>
            <p>Saved on this device. {r.m.length ? `Practise next: ${r.m.map((j) => L.q[j][3]).join(", ")}.` : "Try the next lesson."}</p>
          </section>
        )}
      </>
    );
  };

  const Home = ({ l }: { l: Learner }) => {
    const next = LES.find((x) => !l.p[x.id])?.id;
    const style = { "--p": `${(done(l) / LES.length) * 100}%` } as CSSProperties;
    return (
      <>
        <section className="hello">
          <div><h2>Hello, {l.f}</h2><p className="mut">Your code is <b>{l.id}</b>. It holds your lessons and scores, with no surname or address.</p></div>
          <button className="ghost" onClick={() => pick(null)}>Switch learner</button>
        </section>
        {l.pk && <section className="card note"><h3>Your teacher sent you a catch-up plan</h3><Plan l={l} /></section>}
        <h2>Your track</h2>
        <ol className="track" style={style}>{LES.map((x) => {
          const r = l.p[x.id];
          return (
            <li key={x.id} className={r ? (r.s === 3 ? "done" : "part") : x.id === next ? "next" : ""}>
              <span className="st" aria-hidden="true" />
              <div className="stc">
                <h3>{x.t}</h3>
                <span className="mut">{r ? `Score ${r.s} out of 3` : x.id === next ? "Next up, 8 minutes" : "Not started, 8 minutes"}</span>
                <button className={x.id === next ? "pri" : ""} onClick={() => { setLes(x.id); setAns({}); }}>{r ? "Review" : "Start"}</button>
              </div>
            </li>
          );
        })}</ol>
        <section className="card">
          <h3>Missed some school?</h3>
          <p className="mut">Get a short plan to catch up, one small step a day. Every lesson also works as audio.</p>
          <button onClick={() => setPlan(!plan)}>{plan ? "Hide plan" : "Show my catch-up plan"}</button>
          {plan && <Plan l={l} />}
        </section>
        <section className="card">
          <h3>Moving schools or leaving home?</h3>
          <p className="mut">Make a transfer code. It carries only your learning record, so you can continue anywhere without a national records system.</p>
          <label className="chk"><input type="checkbox" checked={inc} onChange={(e) => setInc(e.target.checked)} /> Include my first name</label>
          <button onClick={makeCode}>Make my transfer code</button>
          {code && <><textarea readOnly value={code} aria-label="Transfer code" onFocus={(e) => e.currentTarget.select()} /><p className="mut">Give this to your new teacher or Steward. Keep it private.</p></>}
        </section>
      </>
    );
  };

  /* ---------- educator ---------- */
  const Edu = () => {
    const L = lesson(el), d = S.ls.filter((l) => l.p[L.id]);
    const u = d.filter((l) => l.p[L.id].s === 3).length, a = d.filter((l) => l.p[L.id].s === 2).length, r = d.length - u - a, N = d.length || 1;
    const aw = S.ls.filter((l) => days(l) >= 7);
    return (
      <>
        <section className="card">
          <h2>Class overview</h2>
          <p className="mut">First names and learner codes only. In a pilot, access is limited to the teacher and Steward.</p>
          <div className="stats"><div><b>{S.ls.length}</b>learners</div><div><b>{S.ls.length - aw.length}</b>active this week</div><div><b className={aw.length ? "alert" : ""}>{aw.length}</b>away 7+ days</div></div>
        </section>
        <section className="card">
          <h2>Learning gap detector</h2>
          <select value={el} onChange={(e) => setEl(e.target.value)} aria-label="Lesson">{LES.map((x) => <option key={x.id} value={x.id}>{x.t}</option>)}</select>
          <div className="bar" role="img" aria-label={`${u} understood, ${a} need support, ${r} need foundation revision`}>
            <span style={{ width: `${(u / N) * 100}%`, background: "var(--g)" }} /><span style={{ width: `${(a / N) * 100}%`, background: "var(--a)" }} /><span style={{ width: `${(r / N) * 100}%`, background: "var(--r)" }} />
          </div>
          <div className="lg"><span><i style={{ background: "var(--g)" }} />{u} understood the topic</span><span><i style={{ background: "var(--a)" }} />{a} need additional support</span><span><i style={{ background: "var(--r)" }} />{r} need a revision on the foundation</span></div>
          <p className="mut">{S.ls.length - d.length} not started. Understood is 3 of 3, support is 2 of 3, foundation is 0 or 1.</p>
          <h3>Questions most often missed</h3>
          {L.q.map((q, j) => {
            const pc = Math.round((d.filter((l) => l.p[L.id].m.includes(j)).length / N) * 100);
            return <div className="miss" key={j}><div><span>{q[3]}</span><b>{pc}%</b></div><div className="m"><i style={{ width: `${pc}%` }} /></div></div>;
          })}
        </section>
        <section className="card">
          <h2>Learner lanes</h2>
          <p className="mut">Each lane is one learner. Each stop is a lesson, coloured by understanding.</p>
          <div className="lanes">
            <div className="lh"><span /><span className="lhr">{LES.map((x) => <span key={x.id}>{x.t.split(":")[0]}</span>)}</span><span /><span /></div>
            {S.ls.map((l) => (
              <div className="lane" key={l.id}>
                <div className="who"><b>{l.f}</b><small>{l.id}{l.x ? " (sample)" : ""}</small></div>
                <div className="rail">{LES.map((x) => <i key={x.id} className={"pt " + bucket(l.p[x.id])} title={`${x.t}: ${l.p[x.id] ? l.p[x.id].s + " of 3" : "not started"}`} />)}</div>
                <div className={"aw" + (days(l) >= 7 ? " alert" : "")}>{days(l) >= 7 ? `away ${Math.floor(days(l))} days` : ago(l)}</div>
                <div className="act">
                  {days(l) >= 7 && (l.pk ? <small>Plan sent</small> : <button className="ghost" onClick={() => { upd((s) => { s.ls.find((z) => z.id === l.id)!.pk = true; }); setMsg(`Catch-up plan sent to ${l.f}.`); }}>Send plan</button>)}
                  {cf === l.id
                    ? <button className="ghost" onClick={() => { upd((s) => { s.ls = s.ls.filter((z) => z.id !== l.id); if (s.cur === l.id) s.cur = null; }); setCf(null); setMsg("Record erased."); }}>Confirm erase</button>
                    : <button className="ghost" onClick={() => setCf(l.id)}>Erase</button>}
                </div>
              </div>
            ))}
          </div>
          <div className="lg"><span><i style={{ background: "var(--g)" }} />Understood</span><span><i style={{ background: "var(--a)" }} />Needs support</span><span><i style={{ background: "var(--r)" }} />Needs revision</span><span><i className="hol" />Not started</span></div>
        </section>
        <section className="card">
          <h2>Protecting children’s information</h2>
          <ul>
            <li>Only a first name or nickname, class, learner code and lesson scores are kept.</li>
            <li>No surname, address, phone number or photo.</li>
            <li>A guardian must agree before a record is created.</li>
            <li>Records move by transfer code, so continuity does not depend on a national database.</li>
            <li>Any record can be erased here.</li>
          </ul>
          {S.ls.some((l) => l.x) && <button onClick={() => { upd((s) => { s.ls = s.ls.filter((l) => !l.x); if (!s.ls.some((l) => l.id === s.cur)) s.cur = null; }); setMsg("Sample learners removed."); }}>Remove sample learners</button>}
        </section>
      </>
    );
  };

  return (
    <div className="rl">
      <style>{css}</style>
      <div className="wrap">
        <header>
          <div className="logo"><i className="bt" aria-hidden="true" /><div>RelayLearn<small>Learning that follows the child, not the device.</small></div></div>
          <nav aria-label="View">
            <button aria-pressed={tab === "learn"} onClick={() => go("learn")}>Learner</button>
            <button aria-pressed={tab === "edu"} onClick={() => go("edu")}>Educator</button>
          </nav>
        </header>
        {msg && <p className="msg" role="status">{msg}</p>}
        {tab === "edu" ? <Edu /> : !me ? <Who /> : les ? <Lesson l={me} /> : <Home l={me} />}
        <footer className="mut">Demo data is stored in this browser only. In a pilot the app runs from a community learning node over local Wi-Fi. Scores marked sample are illustrative.</footer>
      </div>
    </div>
  );
}

const css = `
.rl{--bg:#eef3ee;--fg:#10201a;--mut:#51635a;--card:#fff;--line:#d3ddd5;--pine:#0f3d2e;--pinefg:#fff;--gold:#f5b700;--g:#1fa65a;--a:#f2a900;--r:#e5484d;--lane:#2b59c3;
 background:var(--bg);color:var(--fg);min-height:100vh;font:17px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;box-sizing:border-box}
@media(prefers-color-scheme:dark){.rl{--bg:#0b1713;--fg:#e8f0ea;--mut:#9db0a5;--card:#12251d;--line:#25402f;--pine:#4fd1a0;--pinefg:#06241a;--lane:#7aa2ff}}
.rl *{box-sizing:border-box}.wrap{max-width:780px;margin:0 auto;padding:16px 16px 48px}
.rl h2{font:700 1.4rem/1.2 Georgia,"Times New Roman",serif;letter-spacing:-.01em;margin:0 0 8px}.rl h3{font-size:1.05rem;margin:0 0 4px}.rl p{margin:0 0 10px}
.mut{color:var(--mut);font-size:.92rem}.alert{color:var(--r);font-weight:700}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:8px 0 18px}
.logo{display:flex;align-items:center;gap:10px;font:700 1.6rem Georgia,serif}.logo small{display:block;font:400 .8rem system-ui;color:var(--mut)}
.bt{width:12px;height:34px;border-radius:6px;background:var(--gold);transform:rotate(24deg);box-shadow:-9px 5px 0 -2px var(--pine)}
nav{display:flex;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:3px}
.rl button,.rl input,.rl select,.rl textarea{font:inherit;color:inherit}
.rl button{cursor:pointer;min-height:44px;padding:8px 18px;border-radius:999px;border:1.5px solid var(--line);background:var(--card)}
.rl button:focus-visible,.rl input:focus-visible,.rl select:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
nav button{border:0;background:none}nav button[aria-pressed=true]{background:var(--pine);color:var(--pinefg);font-weight:700}
.pri{background:var(--pine)!important;color:var(--pinefg);border-color:var(--pine)!important;font-weight:700}.ghost{background:none!important;min-height:40px;padding:6px 14px}
.rl input,.rl select,.rl textarea{display:block;width:100%;min-height:44px;margin:0 0 10px;padding:8px 12px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg)}
.rl input[type=checkbox]{display:inline-block;width:auto;min-height:0;margin:0 6px 0 0}.rl textarea{margin-top:10px;min-height:90px;font:13px ui-monospace,Menlo,monospace}
.chk{display:block;margin:0 0 12px;font-size:.95rem}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;margin:14px 0}.card.note{border-left:6px solid var(--gold)}
.hello{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin:6px 0 4px}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{display:flex;flex-direction:column;align-items:flex-start;line-height:1.25;border-radius:14px!important}.chip small{font-size:.72rem;color:var(--mut)}
.msg{background:var(--pine);color:var(--pinefg);padding:10px 16px;border-radius:14px}
.track{list-style:none;margin:14px 0 0;padding:0 0 0 46px;position:relative}
.track::before{content:"";position:absolute;left:15px;top:14px;bottom:14px;width:6px;border-radius:3px;background:linear-gradient(to bottom,var(--g) var(--p),var(--line) var(--p))}
.track li{position:relative;padding:0 0 18px}.track .st{position:absolute;left:-46px;top:2px;width:36px;height:36px;border-radius:50%;background:var(--card);border:4px solid var(--line);display:grid;place-items:center;font-weight:700}
.track .done .st{background:var(--g);border-color:var(--g);color:#fff}.track .done .st::after{content:"✓"}
.track .part .st{border-color:var(--a)}.track .part .st::after{content:"!";color:var(--a)}
.track .next .st{background:var(--gold);border-color:var(--gold);animation:pulse 2.2s ease-in-out infinite}.track .next .st::after{content:"";width:10px;height:22px;border-radius:5px;background:var(--pine);transform:rotate(24deg)}
@keyframes pulse{50%{box-shadow:0 0 0 10px #f5b70033}}
.stc{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:6px;align-items:flex-start}
.track .next .stc{border-color:var(--gold);border-width:2px}
.plan{list-style:none;padding:0;margin:10px 0 0}.plan li{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--line)}.plan span{flex:1}.plan small{display:block;color:var(--mut)}
.opts{display:grid;gap:8px}.opts button{text-align:left;border-radius:14px}.opts .right{border-color:var(--g);color:var(--g);font-weight:700}.opts .wrong{border-color:var(--r);color:var(--r)}
.strip{position:relative;height:8px;border-radius:99px;background:var(--line);margin:12px 0}
.baton{position:absolute;top:-8px;left:0;width:12px;height:24px;border-radius:6px;background:var(--gold);transform:rotate(24deg);animation:run 1.1s cubic-bezier(.3,.8,.3,1) forwards}
@keyframes run{to{left:calc(100% - 12px)}}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.stats b{display:block;font:700 2rem Georgia,serif}
.bar{display:flex;height:28px;border-radius:10px;overflow:hidden;background:var(--line);margin:10px 0}.bar span{display:block}
.lg{display:flex;gap:14px;flex-wrap:wrap;font-size:.88rem;margin:8px 0}.lg i{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:6px}.hol{border:2px solid var(--line)}
.miss{margin:10px 0}.miss>div:first-child{display:flex;justify-content:space-between}.miss .m{height:8px;border-radius:99px;background:var(--line)}.miss .m i{display:block;height:100%;border-radius:99px;background:var(--r)}
.lanes{margin:12px 0;overflow-x:auto}.lh,.lane{display:grid;grid-template-columns:minmax(110px,1.2fr) minmax(170px,1.4fr) minmax(90px,.8fr) minmax(130px,auto);gap:10px;align-items:center;min-width:560px}
.lh{font-size:.75rem;color:var(--mut)}
.lane{padding:8px 0;border-top:1px solid var(--line)}.who small{display:block;font-size:.72rem;color:var(--mut)}.act{display:flex;gap:4px;align-items:center;justify-content:flex-end}.act small{color:var(--mut)}
.rail{position:relative;display:flex;justify-content:space-between;padding:0 14px}.rail::before{content:"";position:absolute;left:0;right:0;top:50%;height:8px;margin-top:-4px;border-radius:4px;background:repeating-linear-gradient(to right,var(--lane) 0 10px,transparent 10px 16px);opacity:.35}
.pt{position:relative;width:22px;height:22px;border-radius:50%;border:3px solid var(--card);box-shadow:0 0 0 2px var(--line)}.pt.g{background:var(--g)}.pt.a{background:var(--a)}.pt.r{background:var(--r)}.pt.n{background:var(--card)}
.lhr{display:flex;justify-content:space-between}
footer{margin-top:28px}
@media(max-width:560px){.stats b{font-size:1.5rem}}
@media(prefers-reduced-motion:reduce){.rl *{animation:none!important;transition:none!important}.baton{left:calc(100% - 12px)}}
`;
