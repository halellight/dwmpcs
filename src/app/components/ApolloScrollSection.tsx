import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Volume2,
  Play,
  Pause,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  CheckCheck
} from "lucide-react";
import SwiftLogo from "./SwiftLogo";
import WaveformMotion from "./WaveformMotion";

interface Pillar {
  id: string;
  number: string;
  badge: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
}

const PILLARS: Pillar[] = [
  {
    id: "outbound",
    number: "01",
    badge: "Customer Outreach",
    tag: "Smart WhatsApp Broadcasts",
    title: "Wake up past buyers without sounding like spam",
    subtitle: "Turn status viewers into repeat orders before you open shop",
    description:
      "When fresh goods land in Lagos or Abuja, don't just post on WhatsApp status and pray. SweeftMerce automatically notifies past buyers who bought that exact size or category, generating instant repeat sales.",
    stats: [
      { label: "Open Rate", value: "98.4%" },
      { label: "Repeat Sales", value: "+38%" },
      { label: "Account Safety", value: "100%" },
    ],
  },
  {
    id: "inbound",
    number: "02",
    badge: "24/7 Sales Assistant",
    tag: "Pidgin & Voice Note AI",
    title: "Reply in 2 seconds before buyers go to another vendor",
    subtitle: "Transcribes 30s Pidgin voice notes and locks deals at 1:30 AM",
    description:
      "A customer asking 'How much last?' or sending a fast Pidgin voice note late at night won't wait until 9:00 AM. SweeftMerce replies in under 2 seconds, confirms available colors and sizes, and collects payment while you sleep.",
    stats: [
      { label: "Reply Speed", value: "1.2s" },
      { label: "Pidgin Accuracy", value: "99.2%" },
      { label: "Late Night Sales", value: "+45%" },
    ],
  },
  {
    id: "enrichment",
    number: "03",
    badge: "Live Inventory Sync",
    tag: "Real-Time Stock & Size Lock",
    title: "Never collect money for goods that just finished in store",
    subtitle: "Automatic size reservation prevents refund embarrassments",
    description:
      "Nothing damages customer trust like telling a buyer 'sorry, someone just bought the last pair in the shop'. SweeftMerce tracks your real-time stock and automatically reserves items the second a customer starts checkout.",
    stats: [
      { label: "Stock Accuracy", value: "Real-Time" },
      { label: "Refund Headaches", value: "Zero" },
      { label: "Inventory Sync", value: "Instant" },
    ],
  },
  {
    id: "deals",
    number: "04",
    badge: "Instant Bank Payments",
    tag: "Paystack & Moniepoint Paylinks",
    title: "End the era of fake transfer screenshots",
    subtitle: "Instant bank credit straight into your Moniepoint or bank account",
    description:
      "No more squinting at edited transfer screenshots or waiting 45 minutes for bank SMS while the dispatch rider is waiting outside. SweeftMerce sends 1-click Paylinks that credit your account and dispatch orders immediately.",
    stats: [
      { label: "Fake Alerts", value: "Eliminated" },
      { label: "Checkout Drop-off", value: "-58%" },
      { label: "Dispatch Ready", value: "Instant" },
    ],
  },
];

export default function ApolloScrollSection() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <section
      id="solutions"
      className="relative py-16 sm:py-24 bg-[#FAFAFA] border-t border-[#E2E8F0] scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header: Clean title without pill clutter */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#090D16]">
            From first DM to confirmed bank alert
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3 max-w-xl mx-auto">
            Automating every step of your WhatsApp sales journey so you never lose a paying customer.
          </p>
        </div>

        {/* Stacking Cards Deck: All 4 cards are clean white and stack on scroll */}
        <div className="relative pb-12 sm:pb-20">
          {PILLARS.map((pillar, idx) => {
            // Desktop and mobile top offsets for stacked card deck
            const topOffsetDesktop = 88 + idx * 22;
            const topOffsetMobile = 76 + idx * 14;

            return (
              <div
                key={pillar.id}
                className="sticky mb-10 sm:mb-14 last:mb-0 transition-all duration-300"
                style={{
                  top: `clamp(${topOffsetMobile}px, 10vw, ${topOffsetDesktop}px)`,
                  zIndex: 10 + idx,
                }}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 lg:p-10 transition-all shadow-xl bg-white text-[#090D16] relative overflow-hidden group"
                >

                  {/* Card Header Row */}
                  <div className="flex items-center justify-between pb-5 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 bg-[#090D16] text-[#64EE84]">
                        {pillar.number}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-900">
                        {pillar.badge}
                      </span>
                      <span className="hidden sm:inline text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {pillar.tag}
                      </span>
                    </div>


                  </div>

                  {/* Main 2-Column Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center mt-6">

                    {/* Left Column: Description & Value Props (6 Cols) */}
                    <div className="lg:col-span-6 space-y-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug text-[#090D16]">
                          {pillar.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold mt-1.5 text-gray-500">
                          {pillar.subtitle}
                        </p>
                      </div>

                      <p className="text-sm leading-relaxed text-gray-600">
                        {pillar.description}
                      </p>

                      {/* 3 Metric Stats Footer */}
                      <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
                        {pillar.stats.map((stat, i) => (
                          <div key={i}>
                            <div className="text-base sm:text-lg font-black font-mono text-[#090D16]">
                              {stat.value}
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-medium text-gray-500">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Visual Interactive Scenario Mockup (6 Cols) */}
                    <div className="lg:col-span-6">

                      {pillar.id === "outbound" && (
                        <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                            <span>TARGET CUSTOMER</span>
                            <span className="text-[#090D16] font-mono font-bold">Chinedu (Lekki Phase 1)</span>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] text-xs space-y-2 shadow-xs">
                            <div className="text-gray-400 font-mono text-[10px]">Automated Restock Ping:</div>
                            <div className="text-gray-900 leading-relaxed font-medium">
                              &quot;Good day Chinedu, the original Nike Air Force 1 size 43 you asked for last week is back in stock. 2 pairs left in the shop. Can I hold one for you before status buyers take it?&quot;
                            </div>
                            <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-700 border-t border-gray-100">
                              <span>Customer replied in 4 mins</span>
                              <span className="bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 border border-emerald-200">
                                Order Locked
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {pillar.id === "inbound" && (
                        <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                            <span>VOICE NOTE TRANSCRIBED</span>
                            <span className="text-emerald-700 font-bold font-mono">1.2s Response</span>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] text-xs space-y-2.5 shadow-xs">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                className="w-7 h-7 rounded-full bg-[#16a34a] text-white flex items-center justify-center hover:bg-[#15803d] transition-colors cursor-pointer shrink-0"
                              >
                                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                              </button>
                              <WaveformMotion isPlaying={isPlayingAudio} color="#16a34a" />
                              <span className="text-[10px] font-mono text-gray-400">0:18</span>
                            </div>
                            <div className="text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-200 italic text-[11px]">
                              &quot;Hello dear, how many yards of that royal purple lace remain? Send link make I pay Moniepoint sharp before dispatch driver leaves...&quot;
                            </div>
                            <div className="text-emerald-900 bg-[#E6FCEB] p-2.5 rounded-lg border border-emerald-200 font-medium text-[11px]">
                              AI Reply: &quot;Good afternoon Alhaja Ronke, 15 yards left. Generated your 10-yard bundle link with 5% VIP discount (₦53,200). Tap below to pay.&quot;
                            </div>
                          </div>
                        </div>
                      )}

                      {pillar.id === "enrichment" && (
                        <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                            <span>SHOP INVENTORY SYNC</span>
                            <span className="text-emerald-700 font-mono font-bold">Auto-Stock Lock</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            <div className="bg-white p-3.5 rounded-xl border border-[#CBD5E1] shadow-xs">
                              <div className="text-gray-400 text-[10px]">SKU-104 (Beauty Hub)</div>
                              <div className="font-bold text-gray-900 mt-0.5">Korean Glow Skin Kit</div>
                              <div className="text-emerald-600 font-mono text-[11px] font-bold mt-1">
                                14 units available
                              </div>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-[#CBD5E1] shadow-xs">
                              <div className="text-gray-400 text-[10px]">SKU-101 (Shoe Plug)</div>
                              <div className="font-bold text-gray-900 mt-0.5">Air Force 1 Triple White 43</div>
                              <div className="text-amber-600 font-mono text-[11px] font-bold mt-1">
                                1 held in cart (15 mins)
                              </div>
                            </div>
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-500 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Zero chance of taking money for out-of-stock items</span>
                          </div>
                        </div>
                      )}

                      {pillar.id === "deals" && (
                        <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] space-y-3 text-gray-900">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                            <span>DIRECT MONIEPOINT SETTLEMENT</span>
                            <span className="text-emerald-700 font-bold font-mono">Real Bank Credit</span>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] text-xs space-y-2 shadow-xs">
                            <div className="flex items-center justify-between text-[11px] text-gray-500">
                              <span className="font-bold text-emerald-700 uppercase">BANK ALERT CONFIRMED</span>
                              <span className="text-[#090D16] font-mono font-black text-sm">₦44,500 deposited</span>
                            </div>
                            <p className="text-gray-700 text-[11px] leading-relaxed">
                              Verified digital receipt delivered to buyer on WhatsApp. Dispatch ticket sent directly to packing team. Zero screenshot checking needed.
                            </p>
                            <div className="pt-2 flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-100">
                              <span>Settled to: Moniepoint MFB</span>
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCheck className="w-3.5 h-3.5" />
                                100% Genuine Instant Credit
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Giant Faint Artpiece Watermark Number */}
                  <span 
                    aria-hidden="true"
                    className="absolute -bottom-8 -right-2 font-black font-mono text-8xl sm:text-9xl select-none pointer-events-none text-[#090D16]/[0.03] group-hover:text-[#16a34a]/[0.08] transition-colors leading-none tracking-tighter"
                  >
                    {pillar.number}
                  </span>

                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
