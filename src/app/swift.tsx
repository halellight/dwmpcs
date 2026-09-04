import React, { useState } from "react";
import {
  Search,
  ArrowRight,
  CreditCard,
  Bot,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Zap,
  Layers,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Users,
  Check,
  Flame,
  CheckCheck,
  Smartphone,
  BarChart3,
  Globe2,
  Mail,
  Shield,
  FileText,
  Clock,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  Building,
  Radio,
  CheckCircle2,
  Volume2,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import SwiftLogo from "./components/SwiftLogo";
import WaveformMotion from "./components/WaveformMotion";
import ApolloScrollSection from "./components/ApolloScrollSection";

// --- LEAD / CONVERSATION DATA TYPES ---
interface LeadRecord {
  id: string;
  buyerName: string;
  buyerHandle: string;
  avatar: string;
  location: string;
  phone: string;
  channel: "WhatsApp" | "Instagram DM";
  lastMessage: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  intentScore: number;
  catalogSku: string;
  orderValue: number;
  paymentStatus: "Payment Confirmed" | "Awaiting Paylink" | "Discount Sent" | "Price Quoted";
  updatedAt: string;
  conversation: {
    sender: "buyer" | "ai";
    text: string;
    time: string;
    isAudio?: boolean;
    audioLength?: string;
  }[];
}

const INITIAL_LEADS: LeadRecord[] = [
  {
    id: "lead-101",
    buyerName: "Chinedu Okonkwo",
    buyerHandle: "@chinedu_kicks",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    location: "Lekki Phase 1, Lagos",
    phone: "+234 803 291 8821",
    channel: "WhatsApp",
    lastMessage: "Package am for me size 43. Drop account number make I sharp pay now now.",
    intentScore: 98,
    catalogSku: "Nike Air Force 1 '07 (Triple White - Size 43)",
    orderValue: 44500,
    paymentStatus: "Awaiting Paylink",
    updatedAt: "1 min ago",
    conversation: [
      { sender: "buyer", text: "Boss, I need Nike Air Force 1 triple white in size 43. You still get am and how much with delivery to Lekki Phase 1?", time: "1:14 AM" },
      { sender: "ai", text: "Good morning Chinedu. Yes, original Nike Air Force 1 '07 in size 43 is available in shop. Price is ₦42,000. Express delivery to Lekki Phase 1 is ₦2,500 by 10:00 AM.", time: "1:14 AM" },
      { sender: "buyer", text: "Package am for me size 43. Drop account number make I sharp pay now now.", time: "1:15 AM" },
      { sender: "ai", text: "No problem. Tap the secure Moniepoint paylink below to pay ₦44,500. Your size 43 is held for 20 minutes so another buyer does not pick it.", time: "1:15 AM" }
    ]
  },
  {
    id: "lead-102",
    buyerName: "Alhaja Ronke Adeleke",
    buyerHandle: "@ronke_fabrics",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    location: "Ikeja GRA, Lagos",
    phone: "+234 812 774 9012",
    channel: "WhatsApp",
    lastMessage: "Voice Note: How many yards of that purple lace remain? Send link make I pay...",
    isVoiceNote: true,
    voiceDuration: "0:18",
    intentScore: 96,
    catalogSku: "Imperial Purple Hand-Beaded Lace (10 Yards)",
    orderValue: 53200,
    paymentStatus: "Payment Confirmed",
    updatedAt: "4 mins ago",
    conversation: [
      { sender: "buyer", text: "Voice Note (0:18) - \"Hello dear, I dey look for that deep purple raw silk and bridal lace with gold stones wey you post on status. How many yards remain?\"", time: "2:40 PM", isAudio: true, audioLength: "0:18" },
      { sender: "ai", text: "Good afternoon Alhaja Ronke. The Imperial Purple Hand-Beaded Bridal Lace is available. We have 15 yards left at ₦28,000 per 5 yards bundle.", time: "2:40 PM" },
      { sender: "buyer", text: "AI get sense o! Send link for 10 yards make I transfer with Moniepoint sharp.", time: "2:41 PM" },
      { sender: "ai", text: "Generated your 10-yard bundle link with 5% VIP discount (₦53,200). Payment received directly via Moniepoint. Goods packaged for driver pickup.", time: "2:41 PM" }
    ]
  },
  {
    id: "lead-103",
    buyerName: "Engr. Farouk Danladi",
    buyerHandle: "@farouk_tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    location: "Maitama, Abuja",
    phone: "+234 909 330 1184",
    channel: "WhatsApp",
    lastMessage: "Can I pay via direct corporate transfer and get same-day invoice?",
    intentScore: 92,
    catalogSku: "iPhone 16 Pro Max 256GB Titanium",
    orderValue: 2180000,
    paymentStatus: "Awaiting Paylink",
    updatedAt: "12 mins ago",
    conversation: [
      { sender: "buyer", text: "Good day. Do you have iPhone 16 Pro Max 256GB Natural Titanium brand new sealed with warranty for Maitama delivery today?", time: "11:02 AM" },
      { sender: "ai", text: "Good day Engr. Farouk. Yes, we have 4 units of iPhone 16 Pro Max 256GB (Natural Titanium - Factory Unlocked, 1-Yr Apple Warranty) available for ₦2,180,000.", time: "11:02 AM" },
      { sender: "buyer", text: "Can I pay via direct corporate transfer and get same-day invoice?", time: "11:03 AM" },
      { sender: "ai", text: "Yes, verified corporate transfer is supported with immediate digital stamp duty invoice. Secure checkout link generated below.", time: "11:03 AM" }
    ]
  },
  {
    id: "lead-104",
    buyerName: "Blessing Amadi",
    buyerHandle: "@blessing_glow",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    location: "Port Harcourt, Rivers",
    phone: "+234 701 445 9090",
    channel: "WhatsApp",
    lastMessage: "How much last for the Korean glass skin bundle with waybill to PH?",
    intentScore: 78,
    catalogSku: "Korean Glow Glass Skin 5-in-1 Kit",
    orderValue: 32000,
    paymentStatus: "Price Quoted",
    updatedAt: "28 mins ago",
    conversation: [
      { sender: "buyer", text: "How much last for the Korean glass skin bundle with waybill to Port Harcourt?", time: "9:15 AM" },
      { sender: "ai", text: "Good morning Blessing. The 5-piece kit is ₦32,000 promo price today with free SPF 50 sunscreen. Interstate park waybill to Port Harcourt is ₦3,000. Would you like me to hold a pack for you?", time: "9:15 AM" }
    ]
  },
  {
    id: "lead-105",
    buyerName: "Tunde Bakare",
    buyerHandle: "@tunde_b",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    location: "Yaba, Lagos",
    phone: "+234 802 889 1234",
    channel: "WhatsApp",
    lastMessage: "Customer ghosted after asking for account number. AI sent ₦3,000 flash discount.",
    intentScore: 68,
    catalogSku: "Handcrafted Leather Loafers (Brown - Size 44)",
    orderValue: 48000,
    paymentStatus: "Discount Sent",
    updatedAt: "1 hour ago",
    conversation: [
      { sender: "buyer", text: "How much for the brown loafers size 44? Send account number.", time: "8:00 AM" },
      { sender: "ai", text: "They are ₦48,000 genuine Italian leather. Only 2 pairs left in size 44.", time: "8:01 AM" },
      { sender: "ai", text: "Hello Tunde, we noticed you did not finish your order. Here is a ₦3,000 discount voucher: FLASH3 valid until 4:00 PM before the other pair is taken.", time: "9:00 AM" }
    ]
  }
];

export default function SwiftApp() {
  const [leads, setLeads] = useState<LeadRecord[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadRecord>(INITIAL_LEADS[0]);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 2-slider ROI Calculator
  const [monthlyChats, setMonthlyChats] = useState(1200);
  const [avgTicket, setAvgTicket] = useState(35000);

  const [annualBilling, setAnnualBilling] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTriggerPayment = () => {
    setIsSimulatingPayment(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#64EE84", "#090d16", "#16a34a", "#e2e8f0"]
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLead.id
            ? {
              ...l,
              paymentStatus: "Payment Confirmed",
              intentScore: 100,
              conversation: [
                ...l.conversation,
                {
                  sender: "ai",
                  text: `Bank Alert Confirmed: ₦${l.orderValue.toLocaleString()} deposited directly via Moniepoint Gateway. Waybill receipt and warehouse dispatch ticket generated.`,
                  time: "Just now"
                }
              ]
            }
            : l
        )
      );

      setSelectedLead((prev) => ({
        ...prev,
        paymentStatus: "Payment Confirmed",
        intentScore: 100,
        conversation: [
          ...prev.conversation,
          {
            sender: "ai",
            text: `Bank Alert Confirmed: ₦${prev.orderValue.toLocaleString()} deposited directly via Moniepoint Gateway. Waybill receipt and warehouse dispatch ticket generated.`,
            time: "Just now"
          }
        ]
      }));
      setIsSimulatingPayment(false);
    }, 600);
  };

  const lostChats = Math.round(monthlyChats * 0.35);
  const recoveredSales = Math.round(lostChats * 0.45);
  const monthlyExtraRevenue = recoveredSales * avgTicket;
  const hoursSavedPerMonth = Math.round((monthlyChats * 4) / 60);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#090D16] font-sans antialiased selection:bg-[#64EE84] selection:text-[#090D16] relative">

      {/* --- TOP BANNER --- */}
      <aside aria-label="Announcement" className="bg-[#051B2E] text-white py-2.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-2.5 border-b border-[#0D2D49]">
        <span className="bg-[#64EE84] text-[#090D16] font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider inline-flex items-center gap-1">
          NEW
        </span>
        <span className="text-gray-300 hidden sm:inline">
          Register your WhatsApp business number and start closing sales on autopilot
        </span>
        <a
          href="#how-it-works"
          className="text-[#64EE84] hover:underline font-semibold inline-flex items-center gap-1 ml-1"
        >
          See How It Works <ArrowRight className="w-3 h-3" />
        </a>
      </aside>

      {/* --- HEADER: CLEAN WHITE NAVBAR, BORDERLESS LOGO ICON, MOBILE RESPONSIVE --- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <SwiftLogo size={26} color="#64EE84" />
              </motion.div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#090D16]">
                SweeftMerce
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-1 ml-10">
              <a
                href="#solutions"
                className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-[#090D16] rounded-lg hover:bg-gray-100/80 transition-all"
              >
                Solutions
              </a>
              <a
                href="#how-it-works"
                className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-[#090D16] rounded-lg hover:bg-gray-100/80 transition-all"
              >
                How it works
              </a>
              <a
                href="#roi-calculator"
                className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-[#090D16] rounded-lg hover:bg-gray-100/80 transition-all"
              >
                Calculator
              </a>
              <a
                href="#pricing"
                className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-[#090D16] rounded-lg hover:bg-gray-100/80 transition-all"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-[#090D16] rounded-lg hover:bg-gray-100/80 transition-all"
              >
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="https://app.sweeftmerce.tech/auth/login"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-gray-700 hover:text-black px-3 py-2 transition-all hidden sm:block"
            >
              Login
            </a>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://app.sweeftmerce.tech/auth/phone"
              target="_blank"
              rel="noreferrer"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0"
            >
              <span>Create free account</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 lg:hidden cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="lg:hidden border-t border-[#E2E8F0] bg-white px-5 pt-3 pb-6 space-y-3 overflow-hidden shadow-xl"
            >
              <div className="flex flex-col space-y-1">
                <a
                  href="#solutions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Solutions
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  How it works
                </a>
                <a
                  href="#roi-calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Calculator
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  FAQ
                </a>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="https://app.sweeftmerce.tech/auth/login"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 text-center text-sm font-bold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  Login
                </a>
                <a
                  href="https://app.sweeftmerce.tech/auth/phone"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 text-center text-sm font-bold text-white bg-[#16a34a] hover:bg-[#15803d] rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Create free account</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO SECTION: PAYSTACK CARD (NO SHADOW, RESPONSIVE) --- */}
      <section className="pt-4 pb-12 px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1400px] mx-auto rounded-[24px] sm:rounded-[36px] overflow-hidden bg-gradient-to-r from-[#1762A7] via-[#1E74C6] to-[#348FE6] text-white relative"
        >
          {/* Subtle Ambient Lighting Inside Card */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/10 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[540px] lg:min-h-[620px]">

            {/* Left Column: Bold Typography & CTAs (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 z-10 space-y-6">



              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]"
              >
                Get paid.
                <br />
                Grow your business
                <br />
                across WhatsApp.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-white/90 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal pt-1"
              >
                SweeftMerce gives Nigerian vendors the AI tools to answer customer inquiries 24/7, check available sizes, understand Pidgin voice notes, and receive verified bank payments online and in chat.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://app.sweeftmerce.tech/auth/phone"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-xl bg-[#64EE84] hover:bg-[#52F075] text-[#090D16] font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Create free account</span>
                </motion.a>

                <a
                  href="#how-it-works"
                  className="px-4 py-3 sm:py-4 text-white hover:text-white/80 font-bold text-base flex items-center justify-center sm:justify-start gap-2 transition-colors"
                >
                  <span>See how it works</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Social Proof Strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="pt-6 sm:pt-8 border-t border-white/20"
              >
                <p className="text-xs font-semibold text-white/70 tracking-wide mb-3">
                  Trusted by businesses across Nigeria
                </p>
                <div className="flex flex-wrap items-center gap-4 sm:gap-7 text-[11px] sm:text-xs font-bold tracking-wider text-white/90">
                  <span className="opacity-90">No tech skills needed</span>
                  <span className="opacity-90">Quick & easy to use</span>
                  <span className="opacity-90">Set up in under 20 minutes</span>

                </div>
              </motion.div>

            </div>

            {/* Right Column: Portrait of Nigerian Merchant with Floating Badges (5 Cols) */}
            <div className="lg:col-span-5 relative h-full flex items-end justify-center lg:justify-end overflow-hidden pt-4 lg:pt-0 pr-0 lg:pr-8">

              <div className="relative w-full max-w-[420px] lg:max-w-none">
                <img
                  src="/hero-merchant.jpg"
                  alt="Happy Nigerian merchant checking confirmed WhatsApp payments"
                  className="w-full h-auto object-cover object-bottom rounded-2xl lg:rounded-none"
                />

                {/* Curved Dashed Orbit Arc */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 500 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 120 400 C 60 250, 200 80, 420 120"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                  <path
                    d="M 220 380 C 350 350, 440 280, 460 180"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                </svg>

                {/* Floating Glassmorphism Chip 1: Top Right */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-2 sm:right-6 bg-white/20 backdrop-blur-xl border border-white/35 text-white p-2.5 sm:p-3 rounded-2xl flex items-center gap-2.5 sm:gap-3 z-20"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64EE84]" />
                    <div>
                      <div className="text-[11px] sm:text-xs font-bold leading-tight">Payment received</div>
                      <div className="text-[9px] sm:text-[10px] text-white/80">Today, 10:42 AM</div>
                    </div>
                  </div>
                  <div className="bg-[#051B2E]/90 text-[#64EE84] font-black text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg border border-white/20 font-mono">
                    +₦125,000
                  </div>
                </motion.div>

                {/* Floating Glassmorphism Chip 2: Bottom Right */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="absolute bottom-12 right-2 sm:right-6 bg-white/20 backdrop-blur-xl border border-white/35 text-white px-3.5 sm:px-4 py-2 rounded-2xl z-20"
                >
                  <div className="text-xs sm:text-sm font-black flex items-center gap-1 font-mono">
                    <span>98.4%</span>
                    <span className="text-[#64EE84] text-xs">↑</span>
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-white/85 font-medium">
                    Payment success rate
                  </div>
                </motion.div>

              </div>

            </div>

          </div>

        </motion.div>
      </section>

      {/* --- APOLLO.IO SCROLL-DRIVEN STICKY SECTION --- */}
      <div id="solutions" className="relative">
        <ApolloScrollSection />
      </div>

      {/* --- LIVE IN UNDER 20 MINUTES (ORIGINAL SITE SECTION) --- */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-20 sm:py-24 bg-white border-t border-[#E2E8F0] scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-black text-[#090D16] tracking-tight">
              Live in under 20 minutes.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mt-3 font-normal">
              If you can use WhatsApp, you can use SweeftMerce.
            </p>
          </div>

          {/* 4 Step Cards with Staggered Framer Motion & Giant Low-Opacity Artpiece Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                artNumber: "01",
                title: "Create your account",
                desc: "Sign up with your phone number."
              },
              {
                step: "2",
                artNumber: "02",
                title: "Add your products",
                desc: "Upload your catalogue. Bulk upload supported."
              },
              {
                step: "3",
                artNumber: "03",
                title: "Connect WhatsApp",
                desc: "Link your WhatsApp Business number with a simple pairing code."
              },
              {
                step: "4",
                artNumber: "04",
                title: "Start selling",
                desc: "Share your link. Your AI handles enquiries and you get paid."
              }
            ].map((card, idx) => (
              <motion.div
                key={card.step}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                className="relative overflow-hidden bg-white rounded-3xl border border-[#E2E8F0] p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-gray-300 transition-all group cursor-default"
              >
                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-extrabold text-sm shadow-xs group-hover:scale-110 transition-transform">
                    {card.step}
                  </div>
                  <h3 className="text-lg font-extrabold text-[#090D16] mt-5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                {/* Giant low-opacity artpiece number in the bottom right corner */}
                <span 
                  aria-hidden="true"
                  className="absolute -bottom-4 -right-1 font-black font-mono text-7xl sm:text-8xl select-none pointer-events-none text-[#090D16]/[0.05] group-hover:text-[#16a34a]/[0.12] transition-colors leading-none tracking-tighter"
                >
                  {card.artNumber}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://app.sweeftmerce.tech/auth/phone"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              Get started free
            </motion.a>
          </div>

          {/* WHERE WE'RE HEADING Callout Card */}
          <div className="mt-14 max-w-3xl mx-auto bg-[#F0FDF4] border border-[#BBF7D0] rounded-3xl p-6 sm:p-8 text-center">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#15803d] mb-2.5">
              WHERE WE&apos;RE HEADING
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              SweeftMerce is starting where Nigerian sellers already sell, which is WhatsApp. Storefronts, more sales channels, and deeper integrations are on the way, so as your business grows, SweeftMerce grows with you.
            </p>
          </div>

        </div>
      </motion.section>

      {/* 
      ============================================================
      PREVIOUS INTERACTIVE PIPELINE DEMO (COMMENTED OUT AS REQUESTED)
      ============================================================
      <motion.section 
        id="interactive-platform" 
        className="py-20 bg-white border-y border-[#E2E8F0] scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#090D16] tracking-tight">
              See How SweeftMerce Attends to Buyers
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Pick an active inquiry to test how the AI handles sizes, voice notes, and collects payments in seconds.
            </p>
          </div>
          ... (interactive demo preserved in code)
        </div>
      </motion.section>
      */}

      {/* --- SIMPLIFIED REVENUE CALCULATOR (CLEAN TITLE WITHOUT PILL) --- */}
      <motion.section
        id="roi-calculator"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Clean title without pill on top */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#090D16] tracking-tight">
              See How Much Money Leaves Your Pocket Every Month
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Every hour you delay replying DMs, a customer buys from another vendor.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* 2 Primary Sliders */}
            <div className="lg:col-span-7 space-y-7">
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-800 mb-2">
                  <span>Monthly WhatsApp Inquiries:</span>
                  <span className="text-lg font-black text-black font-mono">{monthlyChats.toLocaleString()} chats</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={monthlyChats}
                  onChange={(e) => setMonthlyChats(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-800 mb-2">
                  <span>Average Item / Order Price:</span>
                  <span className="text-lg font-black text-black font-mono">₦{avgTicket.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                Calculated assuming 35% of buyers ask questions and ghost before paying.
              </div>
            </div>

            {/* Output Box */}
            <div className="lg:col-span-5 bg-[#090D16] text-white p-6 sm:p-8 rounded-2xl text-center space-y-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64EE84] flex items-center justify-center gap-1">
                <SwiftLogo size={12} color="#64EE84" />
                Extra Money In Your Bank Account
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                +₦{monthlyExtraRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">
                Recovered through 2-second replies and automated 1-click Paylinks.
              </p>

              <div className="pt-4 border-t border-gray-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Hours saved typing:</span>
                  <span className="font-bold text-white">{hoursSavedPerMonth} hours / month</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Recovered orders:</span>
                  <span className="font-bold text-[#64EE84]">{recoveredSales} orders</span>
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://app.sweeftmerce.tech/auth/phone"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-[#64EE84] hover:bg-[#52F075] text-[#090D16] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-3 cursor-pointer"
              >
                <span>Recover This Money Today</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>

          </div>

        </div>
      </motion.section>

      {/* --- PRICING SECTION (CLEAN TITLE WITHOUT PILL, STAGGERED ENTRANCE) --- */}
      <motion.section
        id="pricing"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        {/* Clean title without pill on top */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#090D16] tracking-tight">
            Start free. Upgrade as your orders grow.
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Transparent pricing designed for growing businesses
          </p>

          <div className="mt-6 inline-flex items-center gap-3 p-1 bg-[#E2E8F0] rounded-full">
            <button
              type="button"
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${!annualBilling ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${annualBilling ? "bg-black text-white shadow-sm" : "text-gray-600 hover:text-black"
                }`}
            >
              <span>Annual Billing</span>
              <span className="bg-[#64EE84] text-[#090D16] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Free Tier */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-[#CBD5E1] p-8 flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold uppercase text-gray-500 tracking-wider">Starter</div>
              <h3 className="text-2xl font-black text-gray-900 mt-1">Free Forever</h3>
              <p className="text-xs text-gray-500 mt-2">For solo sellers and Instagram shops.</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-black">₦0</span>
                <span className="text-xs text-gray-500"> / forever</span>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] font-bold" />
                  <span>Up to 150 AI sales conversations/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] font-bold" />
                  <span>1 WhatsApp Business Number</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] font-bold" />
                  <span>25 Products in Catalogue</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] font-bold" />
                  <span>Instant Moniepoint & Paystack Paylinks</span>
                </div>
              </div>
            </div>

            <a
              href="https://app.sweeftmerce.tech/auth/phone"
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full py-3 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-black font-bold text-xs uppercase tracking-wider text-center transition-all"
            >
              Get Started Free
            </a>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border-2 border-black p-8 flex flex-col justify-between relative"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#64EE84] text-[#090D16] font-black text-[11px] uppercase tracking-wider border border-black flex items-center gap-1">
              <SwiftLogo size={12} color="#090D16" />
              MOST POPULAR
            </div>

            <div>
              <div className="text-xs font-bold uppercase text-gray-500 tracking-wider mt-1">Growing Vendors</div>
              <h3 className="text-2xl font-black text-gray-900 mt-1">Pro Merchant</h3>
              <p className="text-xs text-gray-500 mt-2">Unlimited 24/7 sales, voice notes, and cart recovery.</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-black">
                  {annualBilling ? "₦15,600" : "₦19,500"}
                </span>
                <span className="text-xs text-gray-500"> / month</span>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-center gap-2 font-bold text-black">
                  <Check className="w-4 h-4 text-[#16a34a]" />
                  <span>Unlimited AI Sales Chats</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-black">
                  <Check className="w-4 h-4 text-[#16a34a]" />
                  <span>Pidgin Voice Note Comprehension</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a]" />
                  <span>Unlimited Products & CSV Upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a]" />
                  <span>Automated Cart Ghosting Recovery</span>
                </div>
              </div>
            </div>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://app.sweeftmerce.tech/auth/phone"
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full py-3.5 rounded-full bg-[#090D16] hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider text-center transition-all cursor-pointer"
            >
              Start 14-Day Free Trial
            </motion.a>
          </motion.div>

          {/* Enterprise Tier */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-[#CBD5E1] p-8 flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold uppercase text-gray-500 tracking-wider">Multi-Branch</div>
              <h3 className="text-2xl font-black text-gray-900 mt-1">Wholesale Store</h3>
              <p className="text-xs text-gray-500 mt-2">For warehouse teams and multi-line retailers.</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-black">
                  {annualBilling ? "₦52,000" : "₦65,000"}
                </span>
                <span className="text-xs text-gray-500"> / month</span>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] font-bold" />
                  <span>Multiple WhatsApp Lines</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] font-bold" />
                  <span>Custom WooCommerce & Shopify Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] font-bold" />
                  <span>Dedicated Technical Account Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16a34a] font-bold" />
                  <span>Custom AI Tone & Slang Setup</span>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/2349161249382?text=Enterprise%20Plan%20Inquiry"
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full py-3 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-black font-bold text-xs uppercase tracking-wider text-center transition-all"
            >
              Talk to Our Team
            </a>
          </motion.div>

        </div>

      </motion.section>

      {/* --- FAQ SECTION (CLEAN TITLE WITHOUT PILL) --- */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Clean title without pill on top */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#090D16] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Everything you need to know about setting up and selling with SweeftMerce
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Will WhatsApp ban my business phone number?",
                a: "No. SweeftMerce connects directly to your existing WhatsApp Business number through standard QR pairing. You are in full control, and your number operates normally."
              },
              {
                q: "Does it really understand Nigerian accents and Pidgin voice notes?",
                a: "Yes. Our speech engine is specially trained on how Nigerians actually talk on WhatsApp. Whether a customer speaks Pidgin, broken English, or fast voice notes, SweeftMerce understands and replies in clean, friendly English."
              },
              {
                q: "How does the money get into my bank account?",
                a: "When a customer pays via the instant link, the money is processed through licensed gateways (Moniepoint and Paystack) and drops straight into your existing bank account. You get notified immediately."
              },
              {
                q: "What if a customer is difficult and I want to reply myself?",
                a: "You can jump in at any second. The moment you or your staff type a message from your normal WhatsApp or the dashboard, the AI pauses automatically and hands over the chat to you."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#CBD5E1] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left font-bold text-gray-900 flex justify-between items-center hover:text-black cursor-pointer"
                >
                  <span className="text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-gray-600 border-t border-gray-100 pt-3 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* --- BOTTOM CTA (WITH FRAMER MOTION) --- */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-20 bg-[#090D16] text-white"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">

          <div className="w-12 h-12 mx-auto flex items-center justify-center">
            <SwiftLogo size={36} color="#64EE84" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Stop letting late-night inquiries buy from your competitors.
          </h2>

          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of smart Nigerian merchants who save 30+ hours weekly and never miss a midnight sale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://app.sweeftmerce.tech/auth/phone"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#64EE84] hover:bg-[#52F075] text-[#090D16] font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <SwiftLogo size={14} color="#090D16" />
              <span>Connect Your WhatsApp Free</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <a
              href="https://wa.me/2349161249382?text=Hi%20Demo"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm border border-gray-700 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#64EE84]" />
              <span>Chat with Live Demo Bot</span>
            </a>
          </div>

        </div>
      </motion.section>

      {/* --- FOOTER: PURE WHITE BACKGROUND, CRISP LIGHT BORDER, CLEAN TEXT --- */}
      <footer className="bg-white border-t border-[#E2E8F0] py-14 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-[#E2E8F0]">

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <SwiftLogo size={22} color="#64EE84" />
                <span className="font-black text-[#090D16] text-base tracking-tight">SweeftMerce</span>
              </div>
              <p className="text-gray-500 text-xs max-w-sm">
                The AI sales assistant for Nigerian WhatsApp sellers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-700">
              <a
                href="https://sweeftmerce.tech/#faq"
                className="hover:text-[#090D16] transition-colors flex items-center gap-1"
              >
                FAQ
              </a>
              <a
                href="https://sweeftmerce.tech/privacy-policy"
                className="hover:text-[#090D16] transition-colors flex items-center gap-1"
              >
                Privacy Policy
              </a>
              <a
                href="https://sweeftmerce.tech/privacy-policy"
                className="hover:text-[#090D16] transition-colors flex items-center gap-1"
              >
                Terms of Service
              </a>
              <a
                href="mailto:sweeftmerce@gmail.com"
                className="hover:text-[#090D16] transition-colors flex items-center gap-1.5 text-gray-800"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                sweeftmerce@gmail.com
              </a>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500">
            <div>
              © {new Date().getFullYear()} SweeftMerce Inc. All rights reserved.
            </div>


          </div>

        </div>
      </footer>

    </div>
  );
}
