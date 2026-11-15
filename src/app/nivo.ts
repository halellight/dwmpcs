/* nivo – Nigeria elections. One-file app: injects its own styles and markup, then renders into <main id="v">.
   Map geometry (outline, states, 774 LGAs) comes from ./map-data. Vote numbers are seeded placeholders. */
import { OUTLINE, BORDERS, MASK, KEYS, BB, LG } from './map-data';

const FONTS = "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&family=Archivo+Narrow:wght@700&display=swap";
const STYLE = `
:root{color-scheme:light;--white:#fff;--g50:#f2f2f2;--g100:#e4e4e4;--g200:#c8c8c8;--g300:#adadad;--g400:#919191;--g500:#767676;--g600:#5e5e5e;--g800:#2f2f2f;--g900:#181818;--red50:#ffeeeb;--red500:#ff5838;--red600:#cc472d;--grn50:#eafaee;--grn500:#2fd058;--grn600:#26a646;--grn800:#135323;--blu50:#e6f4ff;--blu500:#008bfe;--blu600:#006fcb;--pur400:#865cff;--pur500:#6833ff;--org500:#ff9845;--lb50:#eaf7ff;--lb600:#218ac8;--s2:2px;--s4:4px;--s6:6px;--s8:8px;--s10:10px;--s12:12px;--s14:14px;--s16:16px;--s20:20px;--s24:24px;--s32:32px;--s40:40px;--s44:44px;--s48:48px;--full:999px;--ease:cubic-bezier(.22,1,.36,1);--font:Geist,system-ui,sans-serif;--mono:'Geist Mono',ui-monospace,monospace;--chev:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%23919191' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6.5 8 10 4.5 13.5 8M6.5 12l3.5 3.5 3.5-3.5'/%3E%3C/svg%3E")}
*{box-sizing:border-box;margin:0}
html,body{background:var(--white)}
body{font:400 14px/20px var(--font);color:var(--g900);padding-top:env(safe-area-inset-top,0);padding-bottom:env(safe-area-inset-bottom,0)}
.sm{font:500 14px/20px var(--font);letter-spacing:-.28px}.md{font:500 16px/24px var(--font);letter-spacing:-.32px}.mdb{font:600 16px/20px var(--font);letter-spacing:-.16px}.xs{font:400 12px/14px var(--font);letter-spacing:-.12px}.xsb{font:500 12px/16px var(--font);letter-spacing:-.12px}.h5{font:500 24px/32px var(--font)}
.ttl{font:500 24px/28px var(--font);letter-spacing:-.96px}.t20{font:500 20px/24px var(--font);letter-spacing:-.8px}.t18{font:500 18px/20px var(--font);letter-spacing:-.18px}.card-t{font:600 14px/20px var(--font);letter-spacing:-.42px}.r14{font:400 14px/20px var(--font);letter-spacing:-.14px}
.sub{color:var(--g500)}.ell{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hd{border-bottom:1px solid var(--g100)}.wrap{max-width:1100px;margin:auto;padding:0 var(--s20) var(--s12)}
.brand{display:flex;gap:var(--s8);align-items:center;padding:16px 0 8px;font:700 26px/32px 'Archivo Narrow',sans-serif;letter-spacing:-1.3px}
.bar{display:flex;justify-content:space-between;align-items:center;gap:var(--s12);flex-wrap:wrap}
.tabs{display:flex;background:var(--g50);padding:var(--s2);border-radius:var(--s12);overflow-x:auto;max-width:100%}
.tabs a{padding:var(--s6) var(--s12);border-radius:var(--s10);color:var(--g500);white-space:nowrap;cursor:pointer;text-decoration:none;font:500 14px/20px var(--font);letter-spacing:-.28px}
.tabs a[aria-current=page]{background:var(--g900);color:var(--g100)}
.sel{appearance:none;-webkit-appearance:none;font:500 14px/20px var(--font);letter-spacing:-.42px;color:var(--g900);background:var(--white) var(--chev) no-repeat right 10px center;border:1px solid var(--g100);border-radius:var(--s12);padding:var(--s6) 36px var(--s6) var(--s12);cursor:pointer;max-width:100%}
.sel.s{padding:var(--s4) 32px var(--s4) var(--s10);border-radius:var(--s10);background-position:right 8px center}
:focus-visible{outline:2px solid var(--blu500);outline-offset:2px}
.page{max-width:1100px;margin:auto;padding:var(--s16) 0 var(--s32)}
.pad{padding:0 var(--s20)}
.row{display:flex;align-items:center}
.dot{display:inline-block;width:8px;height:8px;border-radius:var(--full);flex:none}
.grow{transition:height .9s var(--ease),width .9s var(--ease)}
/* map */
.mapv{display:grid;grid-template-columns:1fr 513px;min-height:734px}
.mp{position:relative;background:#fafafa;border-bottom:1px solid var(--g50);border-left:1px solid var(--g50);overflow:hidden;display:flex;align-items:center;justify-content:center;padding:40px 96px;min-height:734px}
.zw{width:100%;max-width:736px;transition:transform .5s var(--ease);transform-origin:0 0}.mb{position:relative;width:100%;aspect-ratio:736/654}
.mb canvas,.mb svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.mb canvas{cursor:pointer}
.mb .bd,#lgasvg{pointer-events:none}
.mb .bd path{fill:none;stroke-linejoin:round;stroke-width:calc(2.5px*var(--k,1))}
.mb .b1{stroke:var(--g300)}.mb .b0{stroke:var(--g600)}
.lp{pointer-events:all;fill:var(--g100);stroke:var(--g300);stroke-width:calc(1px*var(--k,1));stroke-linejoin:round;cursor:pointer}
.lp:hover{fill:var(--g200)}.lp.on{stroke:var(--g900);stroke-width:calc(1.5px*var(--k,1))}
.tip{position:absolute;width:342px;max-width:calc(100% - 24px);background:var(--white);border-radius:var(--s12);padding:var(--s8) 0;filter:drop-shadow(0 4px 6px rgba(0,0,0,.08));pointer-events:none;transition:left .12s ease-out,top .12s ease-out}
.tip h4{padding:0 var(--s16)}.tip .tt{display:flex;padding:0 var(--s8)}.tip .tt>*{padding:var(--s4) var(--s8)}.tip .c1{flex:1}.tip .c2{width:80px}.tip .c3{width:100px}
.tip hr,.hr{border:0;border-top:1px solid var(--g100);margin:0}
.zoom{position:absolute;right:12px;bottom:11px;background:var(--white);border:1px solid var(--g100);border-radius:var(--s14);width:34px;overflow:hidden}
.zoom button{display:flex;padding:var(--s6);background:none;border:0;width:100%;cursor:pointer}.zoom hr{border-top:1px solid var(--g100)}
.rp{border-left:1px solid var(--g100);padding:var(--s32) var(--s44) var(--s24) var(--s20)}
.rp .in{padding:var(--s12)}
.leg{display:flex;gap:var(--s12);flex-wrap:wrap;margin-top:var(--s12)}.leg span{display:flex;gap:var(--s4);align-items:center;color:var(--g500)}
.leg i{width:14px;height:10px;border-radius:var(--s4);border:1px solid}
.ctl{justify-content:space-between;gap:var(--s8);margin:var(--s24) 0}
.seg{display:flex;background:var(--g100);padding:var(--s2);border-radius:var(--s14);min-width:0}
.seg .sel,.bk{border:1px solid transparent;background-color:transparent;color:var(--g500);max-width:260px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;transition:max-width .2s ease,opacity .2s ease,padding .2s ease,border-width .2s ease,background-color .2s ease}
.seg .sel.act{background-color:var(--white);border-color:var(--g100);color:var(--g900)}
.seg #lga{max-width:0;opacity:0;padding-left:0;padding-right:0;border-width:0}
.seg.has #lga{max-width:260px;opacity:1;padding-left:var(--s10);padding-right:32px;border-width:1px}
.bk{display:flex;align-items:center;max-width:0;opacity:0;padding:var(--s6) 0;border-width:0;border-color:var(--g100);background:var(--white);border-radius:var(--s12);cursor:pointer}
.seg.srch .bk{max-width:34px;opacity:1;padding:var(--s6);border-width:1px}
.seg.srch .sel,.seg.srch.has #lga{max-width:0;opacity:0;padding-left:0;padding-right:0;border-width:0}
.sbx{display:flex;align-items:center;gap:var(--s8);flex:0 0 38px;min-width:38px;height:38px;padding:var(--s8);background:var(--white);border:1px solid var(--g100);border-radius:var(--s14);overflow:hidden;transition:flex-grow .2s ease,background-color .2s ease}
.sbx.srch{flex-grow:1;background:var(--g100)}
.sb1,.qx{display:flex;background:none;border:0;padding:0;cursor:pointer;flex:none}.qx{display:none}.sbx.srch .qx{display:flex}
.sbx input{flex:1 1 0;width:0;min-width:0;opacity:0;border:0;background:none;outline:0;padding:0;font:500 14px/20px var(--font);letter-spacing:-.42px;color:var(--g900)}
.sbx.srch input{opacity:1}.sbx input::placeholder{color:var(--g400)}
.res{width:100%;background:none;border:0;border-top:1px solid var(--g100);text-align:left;font:inherit;cursor:pointer;color:inherit}
.lr{cursor:pointer}.lr.on{background:var(--g50)}
.ib{background:var(--white);border:1px solid var(--g100);border-radius:var(--s14);padding:var(--s8);display:flex;cursor:pointer}
.cell{display:flex;gap:var(--s12);align-items:center;padding:var(--s12);border-top:1px solid var(--g100)}.cell:first-child{border-top:0}
.av{width:36px;height:36px;border-radius:var(--full);background:var(--g100);flex:none}
.fl{flex:1;min-width:0}.rt{text-align:right;white-space:nowrap}
.more{display:flex;gap:var(--s12);justify-content:center;align-items:center;width:100%;background:var(--g50);border:0;border-radius:var(--s12);padding:var(--s8) var(--s24);color:var(--g500);cursor:pointer}
.back{display:flex;gap:var(--s6);align-items:center;color:var(--g300);background:none;border:0;cursor:pointer;padding:0}
.stk{display:flex;gap:2px;height:16px;border-radius:var(--s6);overflow:hidden}.stk div{height:100%}
.tbl{display:flex;padding:0 var(--s4)}.tbl>*{padding:var(--s8)}.th{color:var(--g500);font:500 12px/16px var(--font);letter-spacing:-.12px;padding-top:4px;padding-bottom:4px}
/* dashboard */
.cols{display:flex;gap:var(--s16);height:408px;padding:var(--s40) 0}
.col{flex:1;display:flex;border-left:1px solid var(--g100);min-width:0}.col>div{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
.col .hd2{flex:1;padding:0 var(--s16)}.col .pc{font:500 40px/40px var(--mono);letter-spacing:-2.4px;padding:0 var(--s8)}
.card{border:1px solid var(--g100);border-radius:var(--s20);padding:var(--s20);display:flex;flex-direction:column;gap:var(--s12);flex:1;min-width:0;overflow:hidden}
.cards{display:flex;gap:var(--s12);padding:0 var(--s20);flex-wrap:wrap}.cards>.card{min-width:300px}
.cl{display:flex;gap:var(--s12);align-items:center;padding:var(--s8) 0;border-top:1px solid var(--g100)}.cl:first-child{border-top:0}
.cl:before{content:"";align-self:stretch;width:2px;border-radius:var(--full);background:var(--c)}
.cl.b0{border:0}
.note{display:flex;gap:var(--s16);align-items:center;padding:var(--s8) var(--s12);border-radius:var(--s12);background:var(--lb50);color:var(--lb600)}.note svg{flex:none}
.stat{display:flex;gap:var(--s16);flex:1}.stat:before{content:"";width:4px;background:var(--c)}
.trk{position:relative;height:95px;margin-top:var(--s4)}.trk i{position:absolute;top:0;bottom:0;border-left:1px dashed var(--g100)}
.fill{position:absolute;left:0;top:24px;height:45px;width:100%;background:var(--g100)}
.fill b{display:block;height:100%;background:var(--org500) repeating-linear-gradient(135deg,transparent 0 4px,rgba(255,255,255,.25) 4px 6px)}
/* compare + insights */
.ph{display:flex;justify-content:space-between;align-items:center;gap:var(--s16);padding:var(--s8) var(--s20);margin:var(--s16) 0;flex-wrap:wrap}
.pair{display:flex;border:1px solid var(--g100);border-radius:var(--s12)}.pair .sel{border:0;border-radius:var(--s12) 0 0 var(--s12);padding:var(--s8) 36px var(--s8) var(--s16);width:150px}.pair .sel+.sel{border-left:1px solid var(--g100);border-radius:0 var(--s12) var(--s12) 0;color:var(--g800)}
.empty{display:flex;flex-direction:column;align-items:center;gap:var(--s8);padding:120px var(--s20);text-align:center}
.tr{display:flex;border-bottom:1px solid var(--g100)}.tr>div{padding:var(--s12) var(--s20);width:250px;color:var(--g600);font:500 14px/20px var(--font);letter-spacing:-.42px;flex:none}.tr>div:first-child{flex:1;width:auto;display:flex;gap:10px;align-items:center;color:var(--g800)}
.tr.h>div{color:var(--g400);font-weight:600}.tr.h{border-bottom-color:var(--g100)}.tr .hl{background:var(--g50)}.tr.sep{border-top:2px solid var(--g200)}.gap{height:var(--s48)}
.tw{overflow-x:auto}.tw>div{min-width:720px}
.cc{display:flex;align-items:center;gap:var(--s12);padding:var(--s8) 0}.pk{display:flex;gap:var(--s12);align-items:center;padding:0 var(--s12);position:relative;height:36px}.pk>*{position:relative}.pk:before{content:"";position:absolute;inset:0;background:var(--bg,transparent)}
.pk.r{flex-direction:row-reverse}.pk .bar2{width:2px;align-self:stretch;border-radius:var(--full);background:var(--c)}
.pts{width:100px;height:24px;background:var(--g50) repeating-linear-gradient(135deg,transparent 0 4px,rgba(0,0,0,.04) 4px 6px);color:var(--g500);text-align:center}
@media(min-width:1441px){.mapv{min-height:996px}.mp{min-height:996px;padding:63px 120px}.zw{max-width:980px}}
.navm,.allst{display:none}.mrow{display:none!important}
@media(max-width:900px){.mapv{grid-template-columns:1fr}.mp{padding:24px;min-height:480px}.rp{border-left:0;border-top:1px solid var(--g100);padding:var(--s24) var(--s16)}.tip{display:none}}
@media(max-width:600px){
.tabs{display:none}.navm{display:flex;align-items:center;position:relative;background:var(--g50);border-radius:var(--s12);padding:var(--s2) var(--s4) var(--s2) var(--s2);gap:var(--s4)}
.navm .chip{background:var(--g900);color:var(--g100);padding:var(--s6) var(--s12);border-radius:var(--s10)}
.navm select{position:absolute;inset:0;width:100%;height:100%;opacity:0;font-size:16px;cursor:pointer}
.wrap{padding:0 14px 12px}.bar{flex-wrap:nowrap}
.mp{position:relative;margin:12px;border:1px solid var(--g50);border-radius:var(--s16);min-height:0;padding:40px 23px}
.rp{padding:var(--s24) 12px;border-top:0}
.allst.on{display:flex;position:absolute;left:12px;top:12px;gap:8px;align-items:center;background:var(--white);border:1px solid var(--g100);border-radius:var(--s12);padding:7px 12px 7px 7px;cursor:pointer;font:500 14px/20px var(--font);letter-spacing:-.28px;color:var(--g900)}
.cols{gap:var(--s8);padding:var(--s40) 12px}.col .pc{font-size:24px;line-height:24px;letter-spacing:-1.4px;padding:0 var(--s8)}.col .hd2{padding:0 var(--s16)}
.cards{padding:0 12px}.cards>.card{min-width:0;flex-basis:100%}.stat{flex:1 1 40%}
.ph{padding:0 12px}.pair{width:100%}.pair .sel{flex:1;width:50%;min-width:0}
.tr>div{width:100px;padding:var(--s12)}.tr>div:first-child{width:auto}.tw>div{min-width:0!important}.tr.mrow{display:flex!important}.pad{padding:0 12px}
.cc{flex-wrap:wrap}.cc>.fl{flex:1 1 100%}.note{margin-left:12px!important;margin-right:12px!important}.empty{padding:100px 12px}.page{padding-top:var(--s8)}
}
@media(prefers-reduced-motion:reduce){.grow,.zw,.tip,.seg *,.sbx{transition:none!important}}
`;
const SHELL = `
<header class="hd"><div class="wrap">
<div class="brand"><svg width="30" height="32" viewBox="0 0 30 32" aria-hidden="true"><g fill="#181818"><circle cx="15" cy="16" r="3"/><circle cx="8" cy="10" r="2"/><circle cx="22" cy="10" r="2"/><circle cx="8" cy="22" r="2"/><circle cx="22" cy="22" r="2"/></g><g fill="#c8c8c8"><circle cx="15" cy="4" r="2"/><circle cx="15" cy="28" r="2"/><circle cx="3" cy="16" r="2"/><circle cx="27" cy="16" r="2"/></g></svg>nivo</div>
<div class="bar"><nav class="tabs" id="tabs" aria-label="Views"></nav><label class="navm sm" id="navm"></label><select class="sel" id="year" aria-label="Election year"></select></div>
</div></header>
<main id="v"></main>
`;

function main(): void {
const P=[{k:'APC',n:'All Progressives Congress',c:'red',w:'Bola Ahmed Tinubu'},{k:'PDP',n:'Peoples Democratic Party',c:'blu',w:'Abubakar Atiku'},{k:'LP',n:'Labour Party',c:'grn',w:'Peter Gregory Obi'},{k:'NNPP',n:'New Nigeria People’s Party',c:'pur',w:'Musa Mohammed Rabiu Kwankwaso'}];
const col=(i,t='500')=>`var(--${P[i].c}${t==='500'&&i===3?'400':t})`;
const TINT=['--red50','--blu50','--grn50','--g50'],INK=['--red600','--blu600','--grn800','--g800'];
const GEO:Record<string,string[]>=Object.fromEntries(Object.keys(LG).sort().map(k=>[k,LG[k].map(x=>x[0])]));
const LGAS:{n:string;s:string}[]=Object.entries(GEO).flatMap(([s,l])=>l.map(n=>({n,s})));
const NAT23=[[8794726,36.61],[6984520,29.07],[6101533,25.4],[1496687,6.23]];
const S={y:'2023',st:'',lga:'',srch:0,view:'nat',all:0,z:1,c1:'',c2:''};
const mob=matchMedia('(max-width:600px)');
const $=(s:string):any=>document.querySelector(s),fmt=n=>Math.round(n).toLocaleString('en-US'),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(s){let a=7;for(const c of s)a=Math.imul(a^c.charCodeAt(0),2654435761);return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function votes(n:string,big?:boolean|number):number[]{const r=rng(n+S.y),v=P.map(()=>.08+r()),T=(big?4e6:15e3)+r()*(big?3e6:6e5),s=v.reduce((a,b)=>a+b,0);return v.map(x=>Math.round(x/s*T))}
const lvt=(n:string,s:string,x=''):number[]=>votes(n+'|'+s+x);
const sum=a=>a.reduce((x,y)=>x+y,0),rank=v=>v.map((x,i)=>[x,i]).sort((a,b)=>b[0]-a[0]);
const sel=(id:string,o:(string|string[])[],val:string,cls='',ph?:string)=>`<select class="sel ${cls}" id="${id}" aria-label="${ph||id}">${ph?`<option value="" disabled ${val?'':'selected'}>${ph}</option>`:''}${o.map(x=>{const[v,l]=Array.isArray(x)?x:[x,x];return`<option value="${v}"${v===val?' selected':''}>${l}</option>`}).join('')}</select>`;
const I={left:'<path d="m12 5-5 5 5 5"/>',x:'<circle cx="10" cy="10" r="8" fill="#919191" stroke="none"/><path d="m7.5 7.5 5 5m0-5-5 5" stroke="#e4e4e4"/>',sel:'<path d="M6.5 8 10 4.5 13.5 8M6.5 12l3.5 3.5 3.5-3.5"/>',right:'<path d="m8 5 5 5-5 5"/>',add:'<path d="M10 4v12M4 10h12"/>',rem:'<path d="M4 10h12"/>',search:'<circle cx="9" cy="9" r="5"/><path d="m13 13 4 4"/>',back:'<path d="M16 10H4m5-5-5 5 5 5"/>',down:'<path d="m5 8 5 5 5-5"/>'};
const ic=(k,s=20,c='#767676')=>`<svg width="${s}" height="${s}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;
const layers=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" aria-hidden="true"><path d="m8 2 6 3-6 3-6-3zM2 8l6 3 6-3M2 11l6 3 6-3"/></svg>`;
const candRow=(i:number,v:number,t:number,pp?:number)=>`<div class="cell"><i class="dot" style="width:10px;height:10px;background:${col(i)}"></i><span class="av"></span><div class="fl"><p class="md ell">${P[i].w}</p><p class="xs sub">${P[i].n}</p></div><div class="rt"><p class="md">${(pp??v/t*100).toFixed(2)}%</p><p class="xs sub">${fmt(v)} votes</p></div></div>`;
const legend=`<div class="leg">${P.map((p,i)=>`<span class="xs"><i style="background:${col(i)};border-color:var(--${p.c}${i===3?'500':'600'})"></i>${p.k}</span>`).join('')}</div>`;
/* animation */
function run(root){root.querySelectorAll('[data-h],[data-w]').forEach(e=>{const h=e.dataset.h,w=e.dataset.w;if(RM){h&&(e.style.height=h);w&&(e.style.width=w);return}requestAnimationFrame(()=>requestAnimationFrame(()=>{h&&(e.style.height=h);w&&(e.style.width=w)}))});
root.querySelectorAll('[data-n]').forEach(e=>{const to=+e.dataset.n,d=+(e.dataset.d||0),sf=e.dataset.s||'',cm=e.dataset.c,f=x=>(cm?fmt(x):x.toFixed(d))+sf;if(RM){e.textContent=f(to);return}const t0=performance.now();(function s(t){const k=Math.min(1,(t-t0)/900),x=to*(1-Math.pow(1-k,3));e.textContent=f(x);k<1&&requestAnimationFrame(s)})(t0)})}
const g0='style="height:0"',w0='style="width:0"';
/* views */
const V:Record<string,()=>string>={};
V.map=()=>`<section class="mapv"><div class="mp" id="mp"><div class="zw" id="zw"><div class="mb" id="mb" role="img" aria-label="Map of Nigeria"><canvas id="mcv" width="736" height="654"></canvas><svg class="bd" viewBox="0 0 736 654" aria-hidden="true"><path class="b1" d="${BORDERS}"/><path class="b0" d="${OUTLINE}"/></svg><svg id="lgasvg" viewBox="0 0 736 654"></svg></div></div><button class="allst" id="allst">${ic('rem',20,'#181818')}All states</button><div class="tip" id="tip"></div><div class="zoom"><button data-z="1" aria-label="Zoom in">${ic('add')}</button><hr><button data-z="-1" aria-label="Zoom out">${ic('rem')}</button></div></div><aside class="rp"><div id="ph"></div><div class="row ctl" id="ctl"><div class="seg" id="seg"><button class="bk" id="bk" aria-label="Exit search">${ic('left')}</button><select class="sel s" id="st" aria-label="State"></select><select class="sel s" id="lga" aria-label="Local Government Area"></select></div><label class="sbx" id="sbx"><button class="sb1" id="sbtn" aria-label="Search for a Local Government Area">${ic('search')}</button><input id="q" placeholder="Search for a Local Government Area" autocomplete="off" aria-label="Search for a Local Government Area"><button class="qx" id="qx" aria-label="Clear search">${ic('x',16)}</button></label></div><div id="pb"></div></aside></section>`;
function tip(x?:number,y?:number){const t=$('#tip');if(!t)return;if(x==null)sync();const h:Hov=HOV||(S.lga?{k:S.lga,st:false,s:S.st}:null);if(!h){t.style.display='none';return}t.style.display='';const nm=h.st?h.k.replace(' State',''):h.k,v=h.st?votes(h.k,true):lvt(h.k,h.s),[a,b]=rank(v),tot=a[0]+b[0];t.innerHTML=`<h4 class="md ell">${nm}</h4><p class="xs sub" style="padding:4px 16px 8px">${P[a[1]].k} <span style="color:var(--grn500)">+${((a[0]-b[0])/tot*100).toFixed(1)} pp</span> ahead of ${P[b[1]].k}</p><div class="tt xsb sub"><span class="c1">Party</span><span class="c2">Margin</span><span class="c3">Votes</span></div><hr>${[a,b].map((r,k)=>`<div class="tt sm" style="${k?'':`background:${col(r[1])};color:#fff;`}"><span class="c1 row" style="gap:6px"><i class="dot" style="background:${k?col(r[1]):'#fff'}"></i>${P[r[1]].k}</span><span class="c2">${(r[0]/tot*100).toFixed(2)}%</span><span class="c3">${fmt(r[0])}</span></div>`).join('')}`;
if(x!=null&&y!=null){const m=$('#mp').getBoundingClientRect();t.style.left=Math.max(12,Math.min(m.width-354,x-m.left+16))+'px';t.style.top=Math.max(12,Math.min(m.height-170,y-m.top+16))+'px'}else{t.style.left='47%';t.style.top='39%'}}
function hdr(){$('#ph').innerHTML=S.view==='nat'?`<div class="in"><h2 class="t20">${S.y} General Elections</h2>${legend}</div>`:`<div class="in"><button class="back sm" id="back">${ic('back',20,'#adadad')}Go back</button><h2 class="ttl" style="margin-top:12px">${S.st.replace(' State','')}</h2><p class="r14 sub" style="margin-top:12px">${fmt(sum(votes(S.st,1)))} total votes</p></div><div class="in">${legend}</div>`;$('#back')?.addEventListener('click',reset)}
function ctl(){const g=$('#seg'),st=$('#st'),lg=$('#lga');g.classList.toggle('has',!!S.st);g.classList.toggle('srch',!!S.srch);$('#sbx').classList.toggle('srch',!!S.srch);
st.innerHTML=`<option value="" disabled ${S.st?'':'selected'}>Choose a state</option>`+Object.keys(GEO).map(x=>`<option${x===S.st?' selected':''}>${x}</option>`).join('');
lg.innerHTML=`<option value="" disabled ${S.lga?'':'selected'}>Choose LGA</option>`+(GEO[S.st]||[]).map(x=>`<option${x===S.lga?' selected':''}>${x}</option>`).join('');
st.classList.toggle('act',!S.st);lg.classList.toggle('act',!!S.st);$('#allst').classList.toggle('on',S.view==='state')}
function body(){const r=$('#pb');
if(S.srch){const q=$('#q').value.trim().toLowerCase(),m=LGAS.filter(x=>(x.n+' '+x.s).toLowerCase().includes(q));
r.innerHTML=`<div class="in" style="margin-top:12px"><p class="xs sub">${m.length} Local Government Areas</p></div>`+(m.slice(0,150).map(x=>`<button class="cell res" data-s="${x.s}" data-l="${x.n}"><div class="fl"><p class="md">${x.n}</p><p class="xs sub">${x.s}</p></div>${ic('right')}</button>`).join('')||`<p class="in r14 sub">No LGA matches “${$('#q').value}”</p>`);
r.querySelectorAll('.res').forEach(b=>b.onclick=()=>pick(b.dataset.s,b.dataset.l));return}
if(S.view==='nat'){const nat=S.y==='2023'?NAT23:(()=>{const v=votes('nat',1),t=sum(v);return v.map(x=>[x,x/t*100])})(),t=sum(nat.map(n=>n[0]));
r.innerHTML=`<hr class="hr"><div style="margin-top:var(--s24)"><div class="in"><h3 class="t18">Presidency</h3><p class="r14 sub" style="margin-top:4px">${S.y==='2023'?'21,880,779':fmt(t)} total votes</p></div>${rank(nat.map(n=>n[0])).map(([v,i])=>candRow(i,v,t,S.y==='2023'?nat[i][1]:undefined)).join('')}</div><hr class="hr">`}
else{const L=GEO[S.st],v=votes(S.st,1),t=sum(v),o=rank(v),vis=S.all?o:o.slice(0,2);
r.innerHTML=`<div class="in" style="padding-top:0"><div class="stk">${o.map(([x,i])=>`<div class="grow" data-w="${x/t*100}%" style="width:0;background:${col(i)}"></div>`).join('')}</div></div><div style="margin-top:16px">${vis.map(([x,i])=>candRow(i,x,t)).join('')}<div class="in"><button class="more sm" id="more">${S.all?'Fewer results':'More results'}${ic('down')}</button></div></div><hr class="hr" style="margin:16px 0"><div class="row md" style="padding:8px 12px;gap:4px">Local Governments<span class="sub">(${L.length})</span></div><div class="tbl th"><span style="flex:1">LGA</span><span style="width:140px">Ruling Party</span><span style="width:100px">Vote %</span><span style="width:20px"></span></div><hr class="hr">${L.map(n=>{const lv=lvt(n,S.st),lt=sum(lv),[w,i]=rank(lv)[0];return`<div class="tbl sm lr${n===S.lga?' on':''}" data-l="${n}" style="padding:0 4px;border-bottom:1px solid var(--g100)"><span style="flex:1;align-self:center">${n}</span><span class="row" style="width:140px;gap:12px"><i class="dot" style="background:${col(i)}"></i><span><span style="display:block">${P[i].k}</span><span class="xs sub">${P[i].w.split(' ').slice(-1)[0]}</span></span></span><span style="width:100px;background:var(${TINT[i]});color:var(${INK[i]})">${(w/lt*100).toFixed(2)}%<span class="xs" style="display:block">${fmt(w)} votes</span></span><span style="width:20px;align-self:center">${ic('right')}</span></div>`}).join('')}`;
r.querySelectorAll('.lr').forEach(e=>e.onclick=()=>{S.lga=e.dataset.l;ctl();body();tip()});$('#more').onclick=()=>{S.all=S.all?0:1;body()}}
run(r)}
const all=()=>{hdr();ctl();body();tip()};
const reset=()=>{S.st='';S.lga='';S.view='nat';S.srch=0;S.all=0;$('#q').value='';all()};
const pick=(st,l)=>{S.st=st;S.lga=l;S.view='state';S.all=0;S.srch=0;$('#q').value='';all()};
function mapInit(){all();
$('#st').onchange=e=>{S.st=e.target.value;S.lga='';S.view='state';S.all=0;all()};$('#lga').onchange=e=>{S.lga=e.target.value;body();tip()};
$('#sbtn').onclick=()=>{S.srch=1;ctl();body();$('#q').focus()};$('#bk').onclick=()=>{S.srch=0;$('#q').value='';ctl();body()};
$('#q').oninput=body;$('#q').onkeydown=e=>{if(e.key==='Escape')$('#bk').click();if(e.key==='Enter')$('#pb .res')?.click()};
$('#qx').onclick=()=>{$('#q').value='';body();$('#q').focus()};$('#allst').onclick=reset}
V.dashboard=()=>{const nat=S.y==='2023'?[8805120,6984523,6101333,1496715]:votes('nat',1),t=sum(nat),lg=[334,208,196,36],tn=S.y==='2023'?26.72:+(15+rng('t'+S.y)()*20).toFixed(2);
return`<div class="page"><div class="cols pad" style="padding-left:20px;padding-right:20px">${nat.map((v,i)=>{const p=v/t*100;return`<div class="col"><div><div class="hd2"><p class="mdb">${P[i].k}</p><p class="sm sub">${mob.matches?+(v/1e6).toFixed(2)+'M':fmt(v)}</p></div><p class="pc" data-n="${p}" data-d="1" data-s="%">0%</p><div class="grow" data-h="${(p*6.28).toFixed(1)}px" style="height:0;background:${col(i)}"></div></div></div>`}).join('')}</div>
<div class="cards"><div class="card"><p class="card-t">Party by Local Government</p><div><p class="h5" data-n="774" data-c="1">0</p><p class="sm sub">Local Government Areas</p></div><div class="stk" style="margin:8px 0">${lg.map((n,i)=>`<div class="grow" data-w="${n/7.74}%" style="width:0;background:${col(i)}"></div>`).join('')}</div>${lg.map((n,i)=>`<div class="cl" style="--c:${col(i)}"><div class="fl"><p class="md">${P[i].k}</p><p class="xs sub">${P[i].n}</p></div><p class="md" data-n="${n}" data-c="1">0</p></div>`).join('')}</div>
<div class="card"><p class="card-t">Voting Turnout</p><div class="row" style="gap:12px;flex-wrap:wrap"><div class="stat" style="--c:var(--g100)"><div><p class="h5" data-n="93469008" data-c="1">0</p><p class="sm sub">registered voters</p></div></div><div class="stat" style="--c:var(--org500)"><div><p class="h5" data-n="23377466" data-c="1">0</p><p class="sm sub">voted</p></div></div></div><div class="trk">${[0,25,50,75,100].map(x=>`<i style="left:${x===100?'calc(100% - 1px)':x+'%'}"></i>`).join('')}<div class="fill"><b class="grow" ${w0} data-w="${tn}%"></b></div></div>${[['Most voter turnout','Jigawa State',40.61,'red'],['Least voter turnout','Rivers State',15.66,'blu']].map(r=>`<div class="cl b0" style="--c:var(--${r[3]}500);padding:4px 0"><div class="fl"><p class="xs sub">${r[0]}</p><p class="md">${r[1]}</p></div><p class="md">${r[2]}%</p></div>`).join('')}<div class="note sm">${layers}<p>${tn}% of registered voters casted a ballot in the ${S.y} General Elections with Jigawa having the most turnout, and Rivers the least.</p></div></div></div></div>`};
const ph=(t,r='')=>`<div class="ph"><h1 class="ttl">${t}</h1>${r}</div>`;
V.compare=()=>{const ks=(k:string)=>k.split('::') as [string,string],o=LGAS.map(x=>[x.n+'::'+x.s,mob.matches?`${x.n} (${x.s.replace(' State','')})`:`${x.n} · ${x.s.replace(' State','')}`]),stt=(k:string)=>ks(k)[1].replace(' State',''),nm2=(k:string)=>ks(k)[0],ok=S.c1&&S.c2;let body=`<div class="empty"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#adadad" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6v28h28M12 26l7-8 6 5 9-11"/></svg><p class="sm" style="color:var(--g800)">No comparisons made... yet</p><p class="xs sub">Select two local government areas to compare voting statistics</p></div>`;
if(ok){const A=lvt(...ks(S.c1)),B=lvt(...ks(S.c2)),f=(a,b,fm=fmt)=>[a,b].map((x,k)=>`<div class="${(k?b>a:a>=b)?'hl':''}">${typeof x==='number'?fm(x):x}</div>`).join(''),rw=(l:string,a:number,b:number,dot?:string|number,fm?:(n:number)=>string)=>`<div class="tr"><div>${dot?`<i class="dot" style="background:${dot}"></i>`:''}${l}</div>${f(a,b,fm)}</div>`,ta=sum(A),tb=sum(B),mg=v=>{const s=rank(v);return(s[0][0]-s[1][0])/sum(v)*100},ra=Math.round(ta*(2.2+rng(S.c1)())),rb=Math.round(tb*(2.2+rng(S.c2)())),ma=Math.round(ta*.55),mb=Math.round(tb*.55);
body=`<div class="tw pad" style="padding:0"><div style="min-width:720px"><div class="tr h"><div>Metric</div><div>${nm2(S.c1)}</div><div>${nm2(S.c2)}</div></div><div class="tr mrow"><div>State</div><div>${stt(S.c1)}</div><div>${stt(S.c2)}</div></div>${P.map((p,i)=>rw(p.k+' votes',A[i],B[i],col(i))).join('')}<div class="tr sep"><div>Total votes</div>${f(ta,tb)}</div>${rw('Winning margin',+mg(A).toFixed(1),+mg(B).toFixed(1),0,x=>x.toFixed(1))}<div class="gap"></div>${rw('Registered voters',ra,rb)}${rw('Male voters',ma,mb)}${rw('Female voters',ta-ma,tb-mb)}</div></div><div class="note sm pad" style="margin:16px 20px 0">${layers}<p>${nm2(ta>tb?S.c1:S.c2)} recorded ${fmt(Math.max(ta,tb))} votes against ${fmt(Math.min(ta,tb))} in ${nm2(ta>tb?S.c2:S.c1)}, with ${P[rank(ta>tb?A:B)[0][1]].k} leading.</p></div>`}
return`<div class="page">${ph('LGA Comparison',`<div class="pair">${sel('c1',o,S.c1,'',mob.matches?'Select LGA 1':'Choose LGA 1')}${sel('c2',o,S.c2,'',mob.matches?'Select LGA 2':'Choose LGA 2')}</div>`)}${body}</div>`};
V.insights=()=>{const rows=LGAS.map(x=>{const v=lvt(x.n,x.s,'i'),[a,b]=rank(v),tot=a[0]+b[0];return{...x,a,b,d:(a[0]-b[0])/tot*100}}).sort((p,q)=>p.d-q.d),card=(t,l)=>`<div class="card"><div class="row" style="justify-content:space-between"><p class="card-t">${t}</p></div>${l.map(r=>`<div class="cc"><div class="fl"><p class="md ell">${r.n}</p><p class="xs sub">${r.s}</p></div><div class="row"><div class="pk" style="--bg:var(${TINT[r.a[1]]});--c:${col(r.a[1])}"><div><p class="sm">${P[r.a[1]].k}</p><p class="xs sub">${fmt(r.a[0])}</p></div><i class="bar2"></i></div><div class="pts sm row" style="justify-content:center">${r.d.toFixed(1)} pts</div><div class="pk r" style="--c:${col(r.b[1])}"><div><p class="sm">${P[r.b[1]].k}</p><p class="xs sub">${fmt(r.b[0])}</p></div><i class="bar2"></i></div></div></div>`).join('')}</div>`;
return`<div class="page">${ph(S.y+' Insights')}<div class="cards">${card('Closest LGA contests',rows.slice(0,4))}${card('Widest LGA contests',rows.slice(-4).reverse())}</div></div>`};
V.method=()=>`<div class="page">${ph('Methodology')}<p class="pad r14 sub">Placeholder – no Methodology screen exists in the Figma section yet.</p></div>`;

/* ---- interactive map: state hit-mask (canvas) + state/outline borders + per-state LGA shapes ---- */
type Hov={k:string;st:boolean;s:string}|null;
let HOV:Hov=null,LAB:Uint8Array|null=null,drawn='';
const maskImg=new Image();
maskImg.onload=()=>{const c=document.createElement('canvas');c.width=736;c.height=654;const x=c.getContext('2d')!;x.drawImage(maskImg,0,0);const d=x.getImageData(0,0,736,654).data;LAB=new Uint8Array(736*654);for(let k=0;k<LAB.length;k++)LAB[k]=d[k*4];drawMap()};
maskImg.src=MASK;
const labelAt=(e:MouseEvent):number=>{const r=$('#mcv').getBoundingClientRect(),px=Math.floor((e.clientX-r.left)/r.width*736),py=Math.floor((e.clientY-r.top)/r.height*654);return!LAB||px<0||py<0||px>735||py>653?0:LAB[py*736+px]};
function drawMap(){const cv=$('#mcv') as HTMLCanvasElement|null;if(!cv||!LAB)return;const x=cv.getContext('2d')!,im=x.createImageData(736,654),o=im.data,hv=HOV&&HOV.st?KEYS.indexOf(HOV.k)+1:0;for(let k=0;k<LAB.length;k++){if(!LAB[k])continue;const c=LAB[k]===hv?200:228;o[k*4]=o[k*4+1]=o[k*4+2]=c;o[k*4+3]=255}x.putImageData(im,0,0)}
function sync(){const sv=$('#lgasvg') as SVGElement|null,zw=$('#zw') as HTMLElement|null;if(!sv||!zw)return;const key=S.view==='state'&&LG[S.st]?S.st:'';
if(drawn!==key){sv.innerHTML=key?LG[key].map(([n,d])=>`<path class="lp" data-n="${n}" d="${d}"/>`).join(''):'';drawn=key}
sv.querySelectorAll<SVGPathElement>('.lp').forEach(p=>{const on=p.dataset.n===S.lga;p.classList.toggle('on',on);p.style.fill=on?col(rank(lvt(p.dataset.n!,S.st))[0][1]):''});
let sc=1,cx=368,cy=327;const bb=key?BB[key]:null;if(bb){sc=Math.min(8,Math.min(736/(bb[2]-bb[0]),654/(bb[3]-bb[1]))*.75);cx=(bb[0]+bb[2])/2;cy=(bb[1]+bb[3])/2}
sc*=S.z;zw.style.transform=`translate(${(368-cx*sc)/7.36}%,${(327-cy*sc)/6.54}%) scale(${sc})`;zw.style.setProperty('--k',String(1/sc))}
function bindMap(){const mp=$('#mp') as HTMLElement;
mp.onpointermove=(e:PointerEvent)=>{const t=e.target as HTMLElement;let h:Hov=null;if(t.classList.contains('lp'))h={k:t.dataset.n!,st:false,s:S.st};else if(t.id==='mcv'){const l=labelAt(e);if(l)h={k:KEYS[l-1],st:true,s:''}}
if(h?.k!==HOV?.k||h?.st!==HOV?.st){HOV=h;drawMap()}tip(e.clientX,e.clientY)};
mp.onpointerleave=()=>{HOV=null;drawMap();tip()};
mp.onclick=(e:MouseEvent)=>{const t=e.target as HTMLElement;if(t.classList.contains('lp')){S.lga=t.dataset.n!;ctl();body();tip()}else if(t.id==='mcv'){const l=labelAt(e);if(l)pick(KEYS[l-1],'')}};
mp.querySelectorAll<HTMLElement>('[data-z]').forEach(b=>b.onclick=()=>{S.z=Math.max(.8,Math.min(2,S.z+.25*+b.dataset.z!));sync()});
HOV=null;sync();drawMap()}
/* shell */
const TABS=[['map','Map'],['dashboard','National Dashboard'],['compare','LGA Comparison'],['insights','Political Insights'],['method','Methodology']];
function render(){const id=V[location.hash.slice(1)]?location.hash.slice(1):'map';$('#tabs').innerHTML=TABS.map(([k,l])=>`<a href="#${k}"${k===id?' aria-current="page"':''}>${l}</a>`).join('');$('#navm').innerHTML=`<span class="chip">${TABS.find(t=>t[0]===id)![1]}</span>${ic('sel',20,'#919191')}<select id="navsel" aria-label="View">${TABS.map(([k,l])=>`<option value="${k}"${k===id?' selected':''}>${l}</option>`).join('')}</select>`;$('#navsel').onchange=e=>{location.hash=e.target.value};const v=$('#v');v.innerHTML=V[id]();
if(id==='map'){S.srch=0;mapInit();bindMap()}
else run(v);
if(id==='compare'){const re=()=>{S.c1=$('#c1').value;S.c2=$('#c2').value;render()};$('#c1').onchange=re;$('#c2').onchange=re}
if(id==='insights'||id==='dashboard')0}
$('#year').innerHTML=['2023','2019','2015'].map(y=>`<option>${y}</option>`).join('');$('#year').onchange=e=>{S.y=e.target.value;render()};
addEventListener('hashchange',render);mob.addEventListener?.('change',render);render();
}

function boot(): void {
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTS; document.head.append(l);
  const s = document.createElement('style'); s.textContent = STYLE; document.head.append(s);
  document.title = 'nivo – Nigeria elections';
  document.body.insertAdjacentHTML('afterbegin', SHELL);
  main();
}
if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot); else boot();
