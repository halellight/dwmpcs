import React, { useState } from 'react';

type PricingMode = 'retail' | 'wholesale';

interface PriceItem {
    unit: string;
    col: string;
    price: string;
}

const PRICING_DATA: Record<PricingMode, { stockfish: PriceItem; garri: PriceItem; palmoil: PriceItem }> = {
    retail: {
        stockfish: { unit: 'Per piece', col: 'Piece', price: 'Call for rate' },
        garri: { unit: 'Per rubber', col: 'Rubber', price: 'Call for rate' },
        palmoil: { unit: 'Per litre bottle', col: 'Litre', price: 'Call for rate' }
    },
    wholesale: {
        stockfish: { unit: 'Per carton', col: 'Carton', price: 'Call for rate' },
        garri: { unit: 'Per bag (50kg)', col: 'Bag', price: 'Call for rate' },
        palmoil: { unit: 'Per drum (25L)', col: 'Drum', price: 'Call for rate' }
    }
};

export default function GoldFoods() {
    const [mode, setMode] = useState<PricingMode>('retail');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const activePrices = PRICING_DATA[mode];
    const boardNote = mode === 'retail'
        ? 'Retail rates shown — perfect for home use. Prices may vary slightly with market supply.'
        : 'Wholesale rates shown — ideal for shops, caterers and resellers. Bulk discounts available on standing orders.';

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="gold-foods-page">
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .gold-foods-page {
          --ink: #1C1410;
          --gold: #C89A3C;
          --gold-light: #E0BC6B;
          --rust: #A8431F;
          --cream: #EFE6D8;
          --green: #4B5320;
          --paper: #F7F2E8;

          background: var(--paper);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .gold-foods-page h1,
        .gold-foods-page h2,
        .gold-foods-page h3,
        .gold-foods-page .display {
          font-family: 'Anton', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 0.95;
        }

        .gold-foods-page .mono {
          font-family: 'Space Mono', monospace;
        }

        .gold-foods-page a {
          text-decoration: none;
          color: inherit;
        }

        .gold-foods-page img,
        .gold-foods-page svg {
          display: block;
        }

        .gold-foods-page .wrap {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .gold-foods-page .visually-hidden {
          position: absolute;
          left: -9999px;
        }

        /* ===== NAV ===== */
        .gold-foods-page header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--ink);
          border-bottom: 3px solid var(--gold);
        }

        .gold-foods-page nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          max-width: 1140px;
          margin: 0 auto;
        }

        .gold-foods-page .logo {
          color: var(--cream);
          font-size: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Anton', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .gold-foods-page .logo svg {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
        }

        .gold-foods-page .nav-links {
          display: flex;
          gap: 28px;
          align-items: center;
        }

        .gold-foods-page .nav-links a {
          color: var(--cream);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          position: relative;
          padding: 4px 0;
          transition: color 0.2s ease;
        }

        .gold-foods-page .nav-links a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0;
          background: var(--gold);
          transition: width .25s ease;
        }

        .gold-foods-page .nav-links a:hover::after {
          width: 100%;
        }

        .gold-foods-page .nav-cta {
          background: var(--gold);
          color: var(--ink);
          padding: 13px 28px;
          border-radius: 3px;
          font-weight: 800;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .gold-foods-page .nav-cta:hover {
          background: var(--gold-light);
          transform: translateY(-1px);
        }

        .gold-foods-page .menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--cream);
          font-size: 26px;
          cursor: pointer;
          padding: 4px;
        }

        @media (max-width: 760px) {
          .gold-foods-page .nav-links {
            position: absolute;
            top: 62px;
            left: 0;
            right: 0;
            background: var(--ink);
            flex-direction: column;
            padding: 24px 24px;
            gap: 20px;
            border-bottom: 3px solid var(--gold);
            transform: translateY(-150%);
            transition: transform .3s ease-in-out;
            z-index: 49;
          }

          .gold-foods-page .nav-links.open {
            transform: translateY(0);
          }

          .gold-foods-page .menu-btn {
            display: block;
          }

          .gold-foods-page .nav-cta {
            display: inline-block;
            text-align: center;
            width: 100%;
          }
        }

        /* ===== HERO ===== */
        .gold-foods-page .hero {
          position: relative;
          background: var(--ink);
          color: var(--cream);
          padding: 90px 24px 70px;
          overflow: hidden;
        }

        .gold-foods-page .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(135deg, rgba(200,154,60,0.06) 0 2px, transparent 2px 26px);
          pointer-events: none;
        }

        .gold-foods-page .hero-inner {
          max-width: 1140px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: center;
        }

        @media (max-width: 880px) {
          .gold-foods-page .hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .gold-foods-page .eyebrow {
          color: var(--gold);
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        @media (max-width: 880px) {
          .gold-foods-page .eyebrow {
            justify-content: center;
          }
        }

        .gold-foods-page .eyebrow::before {
          content: "";
          width: 24px;
          height: 2px;
          background: var(--gold);
        }

        .gold-foods-page .hero h1 {
          font-size: clamp(48px, 8vw, 84px);
          color: var(--cream);
          margin-bottom: 8px;
        }

        .gold-foods-page .hero h1 span {
          color: var(--gold);
        }

        .gold-foods-page .hero-sub {
          font-size: 18px;
          line-height: 1.6;
          color: #D8CDBD;
          max-width: 480px;
          margin: 18px 0 30px;
        }

        @media (max-width: 880px) {
          .gold-foods-page .hero-sub {
            margin: 18px auto 30px;
          }
        }

        .gold-foods-page .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        @media (max-width: 880px) {
          .gold-foods-page .hero-actions {
            justify-content: center;
          }
        }

        .gold-foods-page .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          border-radius: 3px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-size: 14px;
          transition: transform .2s ease, box-shadow .2s ease, background-color 0.2s ease;
          border: 2px solid transparent;
          cursor: pointer;
        }

        .gold-foods-page .btn-primary {
          background: var(--gold);
          color: var(--ink);
        }

        .gold-foods-page .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 var(--rust);
          background: var(--gold-light);
        }

        .gold-foods-page .btn-outline {
          border-color: var(--cream);
          color: var(--cream);
        }

        .gold-foods-page .btn-outline:hover {
          background: var(--cream);
          color: var(--ink);
        }

        .gold-foods-page .stamp {
          border: 3px solid var(--gold);
          border-radius: 50%;
          width: 170px;
          height: 170px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          transform: rotate(-8deg);
          color: var(--gold);
          position: relative;
          animation: stampFloat 4s ease-in-out infinite alternate;
        }

        @keyframes stampFloat {
          0% { transform: rotate(-8deg) translateY(0px); }
          100% { transform: rotate(-5deg) translateY(-8px); }
        }

        .gold-foods-page .stamp::before {
          content: "";
          position: absolute;
          inset: 8px;
          border: 1px dashed var(--gold);
          border-radius: 50%;
        }

        .gold-foods-page .stamp .big {
          font-family: 'Anton', sans-serif;
          font-size: 30px;
          line-height: 1;
        }

        .gold-foods-page .stamp .small {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: .1em;
          margin-top: 6px;
        }

        /* ===== MARQUEE ===== */
        .gold-foods-page .marquee {
          background: var(--gold);
          color: var(--ink);
          overflow: hidden;
          white-space: nowrap;
          border-bottom: 3px solid var(--ink);
          padding: 10px 0;
        }

        .gold-foods-page .marquee-track {
          display: inline-block;
          animation: scroll 22s linear infinite;
        }

        .gold-foods-page .marquee span {
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-right: 40px;
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .gold-foods-page .marquee-track {
            animation: none;
          }
        }

        /* ===== SECTION GENERIC ===== */
        .gold-foods-page section {
          padding: 80px 24px;
        }

        .gold-foods-page .section-head {
          margin-bottom: 46px;
          max-width: 640px;
        }

        .gold-foods-page .section-head .eyebrow {
          color: var(--rust);
        }

        .gold-foods-page .section-head h2 {
          font-size: clamp(34px, 5vw, 52px);
        }

        .gold-foods-page .section-head p {
          color: #5b5048;
          font-size: 16px;
          margin-top: 14px;
          line-height: 1.6;
        }

        /* ===== PRODUCTS ===== */
        .gold-foods-page .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        @media (max-width: 880px) {
          .gold-foods-page .products-grid {
            grid-template-columns: 1fr;
          }
        }

        .gold-foods-page .product-card {
          background: var(--ink);
          color: var(--cream);
          border-radius: 6px;
          padding: 30px;
          position: relative;
          border: 1px solid #322820;
          transition: transform .25s ease, border-color .25s ease;
        }

        .gold-foods-page .product-card:hover {
          transform: translateY(-6px);
          border-color: var(--gold);
        }

        .gold-foods-page .product-card .swatch {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        .gold-foods-page .swatch.stockfish {
          background: #8A7457;
        }

        .gold-foods-page .swatch.garri {
          background: var(--cream);
        }

        .gold-foods-page .swatch.palmoil {
          background: var(--rust);
        }

        .gold-foods-page .product-card h3 {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .gold-foods-page .product-card p {
          color: #C9BEAD;
          font-size: 14.5px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .gold-foods-page .tag-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .gold-foods-page .tag {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: .05em;
          border: 1px solid var(--gold);
          color: var(--gold);
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        /* ===== PRICE BOARD ===== */
        .gold-foods-page .board-section {
          background: var(--ink);
          color: var(--cream);
        }

        .gold-foods-page .toggle-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .gold-foods-page .toggle {
          display: flex;
          background: #2A2118;
          border-radius: 30px;
          padding: 5px;
          border: 1px solid #423626;
        }

        .gold-foods-page .toggle button {
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .08em;
          padding: 10px 26px;
          border-radius: 24px;
          border: none;
          background: transparent;
          color: #9C8F7C;
          cursor: pointer;
          transition: all .25s ease;
        }

        .gold-foods-page .toggle button.active {
          background: var(--gold);
          color: var(--ink);
        }

        .gold-foods-page .board {
          background: repeating-linear-gradient(0deg, #241B14 0 2px, #1f1610 2px 38px);
          border: 3px solid var(--gold);
          border-radius: 4px;
          padding: 30px;
          box-shadow: inset 0 0 60px rgba(0,0,0,.5);
        }

        .gold-foods-page .board-row {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          align-items: center;
          padding: 16px 6px;
          border-bottom: 1px dashed #4a3d2c;
          font-family: 'Space Mono', monospace;
          transition: background-color 0.2s ease;
        }

        .gold-foods-page .board-row:hover:not(.head) {
          background: rgba(200, 154, 60, 0.03);
        }

        .gold-foods-page .board-row:last-child {
          border-bottom: none;
        }

        .gold-foods-page .board-row.head {
          color: var(--gold);
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: .1em;
          border-bottom: 2px solid var(--gold);
          font-weight: 700;
        }

        .gold-foods-page .board-row .item {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: var(--cream);
        }

        .gold-foods-page .board-row .item small {
          display: block;
          font-family: 'Space Mono', monospace;
          font-weight: 400;
          font-size: 12px;
          color: #9C8F7C;
          margin-top: 3px;
        }

        .gold-foods-page .board-row .price {
          font-size: 18px;
          color: var(--gold-light);
          font-weight: 700;
        }

        .gold-foods-page .board-row .price.muted {
          color: #5c5142;
          text-decoration: line-through;
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .gold-foods-page .board-row {
            grid-template-columns: 1.2fr 1fr;
            font-size: 14px;
          }
          .gold-foods-page .board-row .unit-col {
            display: none;
          }
        }

        .gold-foods-page .board-note {
          margin-top: 24px;
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 12.5px;
          color: #9C8F7C;
          min-height: 38px;
        }

        /* ===== WHY / TRUST STRIP ===== */
        .gold-foods-page .trust-strip {
          background: var(--cream);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          text-align: center;
        }

        @media (max-width: 760px) {
          .gold-foods-page .trust-strip {
            grid-template-columns: 1fr 1fr;
          }
        }

        .gold-foods-page .trust-item {
          padding: 34px 18px;
          border-right: 1px solid #DBCDAE;
        }

        .gold-foods-page .trust-item:last-child {
          border-right: none;
        }

        @media (max-width: 760px) {
          .gold-foods-page .trust-item:nth-child(2) {
            border-right: none;
          }
          .gold-foods-page .trust-item:nth-child(3) {
            border-right: 1px solid #DBCDAE;
          }
        }

        .gold-foods-page .trust-item .num {
          font-family: 'Anton', sans-serif;
          font-size: 30px;
          color: var(--rust);
        }

        .gold-foods-page .trust-item .label {
          font-family: 'Space Mono', monospace;
          font-size: 11.5px;
          letter-spacing: .05em;
          text-transform: uppercase;
          color: #6b5f4d;
          margin-top: 6px;
        }

        /* ===== HOW TO ORDER ===== */
        .gold-foods-page .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
        }

        @media (max-width: 880px) {
          .gold-foods-page .steps {
            grid-template-columns: 1fr;
          }
        }

        .gold-foods-page .step {
          border-left: 3px solid var(--rust);
          padding-left: 20px;
        }

        .gold-foods-page .step .step-num {
          font-family: 'Anton', sans-serif;
          font-size: 40px;
          color: var(--rust);
          opacity: .5;
        }

        .gold-foods-page .step h3 {
          font-size: 20px;
          margin: 10px 0 8px;
          text-transform: none;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
        }

        .gold-foods-page .step p {
          font-size: 14.5px;
          color: #5b5048;
          line-height: 1.6;
        }

        /* ===== PACKAGING TEASER ===== */
        .gold-foods-page .pack-section {
          background: linear-gradient(135deg, var(--rust), #7c2e13);
          color: var(--cream);
        }

        .gold-foods-page .pack-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }

        @media (max-width: 880px) {
          .gold-foods-page .pack-inner {
            grid-template-columns: 1fr;
          }
        }

        .gold-foods-page .pack-visual {
          background: var(--ink);
          border-radius: 8px;
          padding: 34px;
          border: 2px solid var(--gold);
          text-align: center;
        }

        .gold-foods-page .pack-visual .bag {
          width: 140px;
          height: 170px;
          margin: 0 auto 16px;
          background: var(--cream);
          border-radius: 4px 4px 16px 16px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,.4);
        }

        .gold-foods-page .pack-visual .bag::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 18px;
          background: var(--gold);
          border-radius: 4px;
        }

        .gold-foods-page .pack-visual .bag .mark {
          font-family: 'Anton', sans-serif;
          color: var(--ink);
          font-size: 15px;
          text-align: center;
          line-height: 1.1;
        }

        .gold-foods-page .pack-visual .mark .dot {
          color: var(--gold);
        }

        .gold-foods-page .pack-visual p {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #9C8F7C;
          margin-top: 14px;
        }

        /* ===== CONTACT ===== */
        .gold-foods-page .contact-section {
          background: var(--ink);
          color: var(--cream);
        }

        .gold-foods-page .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        }

        @media (max-width: 880px) {
          .gold-foods-page .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        .gold-foods-page .contact-card {
          background: #241B14;
          border: 1px solid #3a2f22;
          border-radius: 6px;
          padding: 30px;
        }

        .gold-foods-page .contact-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 22px;
        }

        .gold-foods-page .contact-row:last-child {
          margin-bottom: 0;
        }

        .gold-foods-page .icon-box {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 18px;
          color: var(--ink);
        }

        .gold-foods-page .contact-row h4 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #9C8F7C;
          font-family: 'Space Mono', monospace;
          margin-bottom: 4px;
        }

        .gold-foods-page .contact-row p {
          font-size: 17px;
          font-weight: 600;
        }

        .gold-foods-page .contact-row a {
          color: var(--gold-light);
          transition: color 0.2s ease;
        }

        .gold-foods-page .contact-row a:hover {
          color: var(--gold);
        }

        .gold-foods-page .hours-table {
          width: 100%;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .gold-foods-page .hours-table tr {
          border-bottom: 1px solid #3a2f22;
        }

        .gold-foods-page .hours-table tr:last-child {
          border-bottom: none;
        }

        .gold-foods-page .hours-table td {
          padding: 12px 0;
          color: #C9BEAD;
        }

        .gold-foods-page .hours-table td:last-child {
          text-align: right;
          color: var(--gold-light);
        }

        /* footer */
        .gold-foods-page footer {
          background: #120D09;
          color: #8C8071;
          text-align: center;
          padding: 30px 24px;
          font-family: 'Space Mono', monospace;
          font-size: 12.5px;
          border-top: 3px solid var(--gold);
        }

        .gold-foods-page footer span {
          color: var(--gold);
        }
      `}} />

            <header>
                <nav>
                    <div className="logo">
                        <svg viewBox="0 0 400 360" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 138 222 C 138 130 262 130 262 222" fill="none" stroke="#C89A3C" strokeWidth={14} strokeLinecap="round" />
                            <ellipse cx="160" cy="218" rx="42" ry="30" fill="#EFE6D8" stroke="#1C1410" strokeWidth={4} />
                            <circle cx="146" cy="210" r="3.5" fill="#8A7457" />
                            <circle cx="160" cy="204" r="3.5" fill="#8A7457" />
                            <circle cx="174" cy="212" r="3.5" fill="#8A7457" />
                            <circle cx="155" cy="222" r="3.5" fill="#8A7457" />
                            <circle cx="170" cy="224" r="3.5" fill="#8A7457" />
                            <path d="M 195 230 C 190 190 205 150 222 130 C 226 150 224 175 232 195 C 224 205 210 220 195 230 Z" fill="#8A7457" stroke="#1C1410" strokeWidth={4} />
                            <path d="M 245 230 L 245 170 C 245 162 252 158 252 150 L 252 138 L 266 138 L 266 150 C 266 158 273 162 273 170 L 273 230 Z" fill="#A8431F" stroke="#1C1410" strokeWidth={4} />
                            <rect x="251" y="132" width="16" height="10" rx="2" fill="#1C1410" />
                            <path d="M 95 222 L 130 350 L 270 350 L 305 222 Z" fill="#1C1410" stroke="#C89A3C" strokeWidth={5} />
                            <path d="M 101 240 L 299 240" stroke="#C89A3C" strokeWidth={3.5} opacity="0.85" />
                            <path d="M 107 262 L 293 262" stroke="#C89A3C" strokeWidth={3.5} opacity="0.85" />
                            <path d="M 113 284 L 287 284" stroke="#C89A3C" strokeWidth={3.5} opacity="0.85" />
                            <path d="M 95 222 L 305 222" stroke="#C89A3C" strokeWidth={7} strokeLinecap="round" />
                        </svg>
                        GOLD FOODS
                    </div>
                    <button className="menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                    <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        <a href="#products" onClick={closeMenu}>Products</a>
                        <a href="#prices" onClick={closeMenu}>Prices</a>
                        <a href="#order" onClick={closeMenu}>How to Order</a>
                        <a href="#contact" onClick={closeMenu}>Contact</a>
                        <a className="nav-cta" href="https://wa.me/2348036659186" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                            Order Now
                        </a>
                    </div>
                </nav>
            </header>

            <section className="hero">
                <div className="hero-inner">
                    <div>

                        <h1>GOLD<br />FOOD<span>S</span></h1>
                        <p className="hero-sub">Stockfish, garri and palm oil, sold the way you need them. One wrap for the house, or a full carton for your shop. Same quality, every time.</p>
                        <div className="hero-actions">
                            <a className="btn btn-primary" href="https://wa.me/2348036659186" target="_blank" rel="noopener noreferrer">Order on WhatsApp →</a>
                            <a className="btn btn-outline" href="tel:08036659186">Call 0803 665 9186</a>
                        </div>
                    </div>
                    <div>
                        <div className="stamp">
                            <div className="big">RETAIL</div>
                            <div className="small">& WHOLESALE</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="marquee">
                <div className="marquee-track">
                    <span>★ STOCKFISH (OKPOROKO)</span><span>★ YELLOW & WHITE GARRI</span><span>★ PURE RED PALM OIL</span><span>★ RETAIL FOR THE HOME</span><span>★ WHOLESALE FOR SHOPS</span>
                    <span>★ STOCKFISH (OKPOROKO)</span><span>★ YELLOW & WHITE GARRI</span><span>★ PURE RED PALM OIL</span><span>★ RETAIL FOR THE HOME</span><span>★ WHOLESALE FOR SHOPS</span>
                </div>
            </div>

            <section id="products">
                <div className="wrap">
                    <div className="section-head">
                        <div className="eyebrow">What we sell</div>
                        <h2>Three staples, sourced right</h2>
                        <p>Every product is hand-checked before it leaves our store. Fresh and ready for your kitchen.</p>
                    </div>
                    <div className="products-grid">
                        <div className="product-card">
                            <div className="swatch stockfish">🐟</div>
                            <h3>Stockfish</h3>
                            <p>Well-dried okporoko, sorted by size. Sold by kilogram for the home, or by carton for shops and caterers.</p>
                            <div className="tag-row">
                                <span className="tag">By piece</span>
                                <span className="tag">By carton</span>
                            </div>
                        </div>
                        <div className="product-card">
                            <div className="swatch garri" style={{ color: '#1C1410' }}>🌾</div>
                            <h3>Garri</h3>
                            <p>Yellow and white garri, clean and well-fried. Sold by rubber for daily use, or by bag for resale.</p>
                            <div className="tag-row">
                                <span className="tag">By rubber</span>
                                <span className="tag">By bag (50kg)</span>
                            </div>
                        </div>
                        <div className="product-card">
                            <div className="swatch palmoil">🛢️</div>
                            <h3>Palm Oil</h3>
                            <p>Pure, unbleached red palm oil. Sold by the litre for the kitchen, or by drum for restaurants and shops.</p>
                            <div className="tag-row">
                                <span className="tag">By litre</span>
                                <span className="tag">By drum (25L)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="prices" className="board-section">
                <div className="wrap">
                    <div className="section-head">
                        <div className="eyebrow" style={{ color: 'var(--gold)' }}>Pricing</div>
                        <h2>Buying small or buying big?</h2>
                        <p style={{ color: '#C9BEAD' }}>Switch the board below. Prices change with quantity, not with who's asking — every customer gets the same fair rate.</p>
                    </div>

                    <div className="toggle-wrap">
                        <div className="toggle">
                            <button
                                type="button"
                                className={mode === 'retail' ? 'active' : ''}
                                onClick={() => setMode('retail')}
                            >
                                Retail
                            </button>
                            <button
                                type="button"
                                className={mode === 'wholesale' ? 'active' : ''}
                                onClick={() => setMode('wholesale')}
                            >
                                Wholesale
                            </button>
                        </div>
                    </div>

                    <div className="board">
                        <div className="board-row head">
                            <div>Product</div>
                            <div className="unit-col">Unit</div>
                            <div>Price</div>
                        </div>
                        <div className="board-row" data-product="Stockfish">
                            <div className="item">
                                Stockfish
                                <small>{activePrices.stockfish.unit}</small>
                            </div>
                            <div className="unit-col mono">{activePrices.stockfish.col}</div>
                            <div className="price">{activePrices.stockfish.price}</div>
                        </div>
                        <div className="board-row" data-product="Garri">
                            <div className="item">
                                Garri (Yellow/White)
                                <small>{activePrices.garri.unit}</small>
                            </div>
                            <div className="unit-col mono">{activePrices.garri.col}</div>
                            <div className="price">{activePrices.garri.price}</div>
                        </div>
                        <div className="board-row" data-product="Palm Oil">
                            <div className="item">
                                Palm Oil
                                <small>{activePrices.palmoil.unit}</small>
                            </div>
                            <div className="unit-col mono">{activePrices.palmoil.col}</div>
                            <div className="price">{activePrices.palmoil.price}</div>
                        </div>
                    </div>
                    <div className="board-note">{boardNote}</div>
                </div>
            </section>

            <div className="trust-strip">
                <div className="trust-item">
                    <div className="num">100%</div>
                    <div className="label">Hand-checked stock</div>
                </div>
                <div className="trust-item">
                    <div className="num">2</div>
                    <div className="label">Ways to buy: retail & wholesale</div>
                </div>
                <div className="trust-item">
                    <div className="num">3</div>
                    <div className="label">Core products, no shortcuts</div>
                </div>
                <div className="trust-item">
                    <div className="num">A</div>
                    <div className="label">Based in Lifecamp, Abuja</div>
                </div>
            </div>

            <section id="order">
                <div className="wrap">
                    <div className="section-head">
                        <div className="eyebrow">How to order</div>
                        <h2>Three steps. That's it.</h2>
                    </div>
                    <div className="steps">
                        <div className="step">
                            <div className="step-num">01</div>
                            <h3>Tell us what you need</h3>
                            <p>Message or call us with the product and quantity — even one wrap of garri is fine.</p>
                        </div>
                        <div className="step">
                            <div className="step-num">02</div>
                            <h3>We confirm price & pickup</h3>
                            <p>We'll confirm the rate for your quantity and arrange pickup at Lifecamp or delivery within Abuja.</p>
                        </div>
                        <div className="step">
                            <div className="step-num">03</div>
                            <h3>Pay & collect</h3>
                            <p>Pay on pickup or via transfer, and your order is packed and ready in Gold Foods branding.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pack-section">
                <div className="wrap pack-inner">
                    <div>
                        <div className="eyebrow" style={{ color: 'var(--cream)' }}>Coming soon</div>
                        <h2>Branded packaging, on every order</h2>
                        <p style={{ marginTop: '16px', lineHeight: 1.7, color: '#F4DCC9' }}>
                            Every bag and bottle will carry the Gold Foods mark, so your neighbours know exactly who to call next time. We're also printing flyers to drop across estates around Abuja.
                        </p>
                    </div>
                    <div className="pack-visual">
                        <div className="bag">
                            <div className="mark">GOLD<br /><span className="dot">●</span> FOODS</div>
                        </div>
                        <p>PACKAGING PREVIEW — V1</p>
                    </div>
                </div>
            </section>

            <section id="contact" className="contact-section">
                <div className="wrap contact-grid">
                    <div>
                        <div className="eyebrow" style={{ color: 'var(--gold)' }}>Get in touch</div>
                        <h2>Order or visit us</h2>
                        <p style={{ color: '#C9BEAD', marginTop: '14px', lineHeight: 1.6 }}>
                            Open every day for retail and wholesale orders. Shops and caterers welcome — ask about standing weekly orders.
                        </p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-row">
                            <div className="icon-box">📞</div>
                            <div>
                                <h4>Call or WhatsApp</h4>
                                <p><a href="tel:08036659186">0803 665 9186</a></p>
                            </div>
                        </div>
                        <div className="contact-row">
                            <div className="icon-box">📍</div>
                            <div>
                                <h4>Location</h4>
                                <p>Lifecamp, Abuja</p>
                            </div>
                        </div>
                        <div className="contact-row" style={{ marginBottom: '24px' }}>
                            <div className="icon-box">🛒</div>
                            <div>
                                <h4>Buying</h4>
                                <p>Individuals & wholesale</p>
                            </div>
                        </div>
                        <table className="hours-table">
                            <tbody>
                                <tr>
                                    <td>Mon — Sat</td>
                                    <td>8:00 AM – 7:00 PM</td>
                                </tr>
                                <tr>
                                    <td>Sunday</td>
                                    <td>12:00 PM – 6:00 PM</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <footer>
                <span>GOLD FOODS</span> — Lifecamp, Abuja · 0803 665 9186 · © 2026
            </footer>
        </div>
    );
}
