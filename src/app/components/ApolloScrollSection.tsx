import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import {
  Send,
  Bot,
  Database,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Layers,
  TrendingUp,
  Volume2,
  Clock,
  ShieldCheck,
  CreditCard,
  Check
} from "lucide-react";
import SwiftLogo from "./SwiftLogo";

interface Pillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  stats: { label: string; value: string }[];
}

const PILLARS: Pillar[] = [
  {
    id: "outbound",
    number: "01",
    title: "Outbound",
    subtitle: "Wake up past customers without sounding like spam",
    description:
      "When new stock lands in Lagos or Abuja, do not just post on WhatsApp status and hope for the best. SweeftMerce automatically pings past buyers who bought that exact size or category, bringing in fresh orders before your day even starts.",
    badge: "Smart WhatsApp Broadcasts",
    stats: [
      { label: "Open Rate", value: "98.4%" },
      { label: "Repeat Sales", value: "+38%" },
      { label: "Account Safety", value: "100%" },
    ],
  },
  {
    id: "inbound",
    number: "02",
    title: "Inbound",
    subtitle: "Reply before they go buy from another vendor",
    description:
      "A customer asking 'How much last?' or sending a 20-second Pidgin voice note at 1:30 AM will not wait till you wake up at 8:00 AM. SweeftMerce answers in under 2 seconds, confirms stock, and locks down the deal while you sleep.",
    badge: "24/7 Pidgin and Voice AI",
    stats: [
      { label: "Reply Speed", value: "1.2s" },
      { label: "Pidgin Accuracy", value: "99.2%" },
      { label: "Late Night Sales", value: "+45%" },
    ],
  },
  {
    id: "enrichment",
    number: "03",
    title: "Data Enrichment",
    subtitle: "Never collect money for goods that just finished in store",
    description:
      "Nothing hurts your brand like telling a paying customer 'sorry, someone just bought the last pair in the shop'. SweeftMerce tracks your actual inventory in real time and automatically reserves sizes the moment a checkout link is generated.",
    badge: "Live Stock and Size Sync",
    stats: [
      { label: "Stock Accuracy", value: "Real-Time" },
      { label: "Refund Headaches", value: "Zero" },
      { label: "Inventory Sync", value: "Instant" },
    ],
  },
  {
    id: "deals",
    number: "04",
    title: "Deal Execution",
    subtitle: "End the era of fake transfer screenshots",
    description:
      "No more squinting at edited bank screenshots or waiting 45 minutes for alert before handing goods to the dispatch rider. SweeftMerce sends a secure Moniepoint or Paystack paylink that confirms credit directly to your bank account in seconds.",
    badge: "Direct Bank Settlement",
    stats: [
      { label: "Fake Alerts", value: "Eliminated" },
      { label: "Checkout Drop-off", value: "-58%" },
      { label: "Dispatch Ready", value: "Instant" },
    ],
  },
];

export default function ApolloScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let nextStep = 0;
    if (latest < 0.28) {
      nextStep = 0;
    } else if (latest < 0.55) {
      nextStep = 1;
    } else if (latest < 0.8) {
      nextStep = 2;
    } else {
      nextStep = 3;
    }
    if (nextStep !== activeStep) {
      setActiveStep(nextStep);
    }
  });

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalHeight = rect.height;
    const targetOffset = scrollTop + (index / PILLARS.length) * (totalHeight - window.innerHeight * 0.7);
    window.scrollTo({
      top: targetOffset,
      behavior: "smooth",
    });
  };

  const currentPillar = PILLARS[activeStep];

  return (
    <section ref={containerRef} className="relative min-h-[300vh] lg:min-h-[360vh] bg-[#FAFAFA] border-t border-[#E2E8F0]">
      <div className="sticky top-20 lg:top-24 h-[calc(100vh-80px)] lg:h-[calc(100vh-96px)] flex flex-col justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Section Header: Clean title without pill clutter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E2E8F0] gap-3"
          >
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#090D16]">
                From first DM to confirmed bank alert
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Automating every step of your WhatsApp sales journey
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-500">
                Phase 0{activeStep + 1} of 04
              </span>
              <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] p-1.5 rounded-full">
                {PILLARS.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => handleStepClick(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeStep === idx
                        ? "w-6 bg-[#090D16]"
                        : "w-2 bg-gray-200 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: 4 Vertical Navigation Pillars */}
            <div className="lg:col-span-5 space-y-2 relative">
              <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-[#E2E8F0] -z-10" />

              {PILLARS.map((pillar, idx) => {
                const isActive = activeStep === idx;
                return (
                  <motion.div
                    key={pillar.id}
                    onClick={() => handleStepClick(idx)}
                    whileHover={{ x: 3 }}
                    className={`relative p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                      isActive
                        ? "bg-white border-[#090D16] shadow-sm ring-1 ring-[#090D16]"
                        : "bg-white/50 border-transparent hover:bg-white hover:border-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${
                          isActive
                            ? "bg-[#090D16] text-[#64EE84]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {pillar.number}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`text-base font-bold transition-colors ${
                              isActive ? "text-[#090D16]" : "text-gray-700"
                            }`}
                          >
                            {pillar.title}
                          </h3>
                          {isActive && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              Active
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs mt-1 leading-relaxed transition-colors line-clamp-2 ${
                            isActive ? "text-gray-700" : "text-gray-500"
                          }`}
                        >
                          {pillar.subtitle}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="activePillarIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#64EE84] rounded-l-2xl"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Dynamic Interactive Showcase Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 min-h-[390px] flex flex-col justify-between relative overflow-hidden">
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPillar.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-400">
                          {currentPillar.number}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                          {currentPillar.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live Nigerian Merchant Workflow</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl sm:text-2xl font-black text-[#090D16] tracking-tight">
                        {currentPillar.title}: {currentPillar.subtitle}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {currentPillar.description}
                      </p>
                    </div>

                    {/* Interactive UI Mockups */}
                    {currentPillar.id === "outbound" && (
                      <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                          <span>TARGET AUDIENCE</span>
                          <span className="text-[#090D16] font-mono font-bold">Past Customers (Lekki and Ikeja)</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-[#CBD5E1] text-xs space-y-2">
                          <div className="text-gray-400 font-mono text-[11px]">Automated Restock Alert:</div>
                          <div className="text-gray-800 leading-relaxed font-medium">
                            &quot;Good day Chinedu, the original Nike Air Force 1 size 43 you asked for last week is back in stock. 2 pairs left in the shop. Can I hold one for you before status buyers take it?&quot;
                          </div>
                        </div>
                      </div>
                    )}

                    {currentPillar.id === "inbound" && (
                      <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                          <span>PIDGIN AND VOICE NOTE TRANSLATION</span>
                          <span className="text-emerald-700 font-bold font-mono">1.2s Response</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-[#CBD5E1] text-xs space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Volume2 className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">Alhaja Voice Note Transcribed:</span>
                          </div>
                          <div className="text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-200 italic">
                            &quot;Hello dear, how many yards of that royal purple lace remain? Send link make I pay Moniepoint sharp before dispatch driver leaves...&quot;
                          </div>
                          <div className="text-emerald-800 bg-[#E6FCEB] p-2.5 rounded-lg border border-emerald-200 font-medium">
                            AI Instant Reply: &quot;Good afternoon Alhaja Ronke, we have 15 yards left. Generated your 10-yard bundle link with 5% VIP discount (₦53,200). Tap below to pay.&quot;
                          </div>
                        </div>
                      </div>
                    )}

                    {currentPillar.id === "enrichment" && (
                      <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                          <span>SHOP INVENTORY SYNC</span>
                          <span className="text-emerald-700 font-mono font-bold">Auto-Stock Lock</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-3 rounded-xl border border-[#CBD5E1]">
                            <div className="text-gray-400 text-[10px]">SKU-104 (Beauty Hub)</div>
                            <div className="font-bold text-gray-900">Korean Glass Skin Bundle</div>
                            <div className="text-emerald-600 font-mono text-[11px] font-bold mt-1">14 units in stock</div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-[#CBD5E1]">
                            <div className="text-gray-400 text-[10px]">SKU-101 (Shoe Plug)</div>
                            <div className="font-bold text-gray-900">Air Force 1 Triple White 43</div>
                            <div className="text-amber-600 font-mono text-[11px] font-bold mt-1">1 held in checkout (15 mins)</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentPillar.id === "deals" && (
                      <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                          <span>DIRECT MONIEPOINT SETTLEMENT</span>
                          <span className="text-emerald-700 font-bold font-mono">Real Bank Credit</span>
                        </div>
                        <div className="bg-[#090D16] text-white p-3.5 rounded-xl border border-gray-800 text-xs space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>ALERT CONFIRMED</span>
                            <span className="text-[#64EE84] font-mono font-bold">₦44,500 deposited in vault</span>
                          </div>
                          <div className="text-gray-300 font-mono text-[11px]">
                            Receipt sent to buyer on WhatsApp. Dispatch alert sent to your packing team. Zero screenshot checking needed.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stats Metrics Footer */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0]">
                      {currentPillar.stats.map((stat, i) => (
                        <div key={i}>
                          <div className="text-lg sm:text-xl font-black text-[#090D16] font-mono">
                            {stat.value}
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                </AnimatePresence>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
