import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// --- CONFIGURATION ---
const ACCOUNTS = ["Main Account", "Kuda Bank", "Cash", "Cowrywise", "Bamboo"];
const SAVINGS_ACCOUNTS = ["Cowrywise", "Bamboo"];

const CATEGORIES = {
  in: ["Salary", "Gift / Support Received", "Refund", "Investment Returns / Interest", "Other Income"],
  out: ["Family / Gifts", "Airtime & Data", "Transport", "Feeding", "Rent", "Bills & Utilities", "Bank Charges", "Other Expense"]
};

interface LedgerEntry {
  id: string;
  date: string;
  desc: string;
  category: string;
  account: string;
  flow: 'in' | 'out';
  internal: boolean;
  transferId?: string;
  amount: number;
}

interface BudgetMap {
  [category: string]: number;
}

interface GoalData {
  target: number;
  date: string;
  label: string;
}

interface GoalMap {
  [account: string]: GoalData;
}

// --- UTILS ---
const fmt = (n: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);
const todayISO = () => new Date().toISOString().slice(0, 10);
const monthKey = (d: string) => d.slice(0, 7);
const thisMonth = monthKey(todayISO());

const uid = () => Math.random().toString(36).slice(2, 10);

const monthLabel = (mk: string) => {
  const parts = mk.split('-');
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  return dateObj.toLocaleString('en-NG', { month: 'short', year: '2-digit' });
};

// --- STORAGE WRAPPERS ---
const getStorage = async (key: string): Promise<string | null> => {
  try {
    // @ts-ignore
    if (window.storage && typeof window.storage.get === 'function') {
      // @ts-ignore
      const res = await window.storage.get(key, false);
      return res && res.value ? res.value : null;
    }
  } catch (e) {
    console.warn("window.storage.get failed, falling back to localStorage", e);
  }
  return localStorage.getItem(key);
};

const setStorage = async (key: string, value: string): Promise<void> => {
  try {
    // @ts-ignore
    if (window.storage && typeof window.storage.set === 'function') {
      // @ts-ignore
      await window.storage.set(key, value, false);
      return;
    }
  } catch (e) {
    console.warn("window.storage.set failed, falling back to localStorage", e);
  }
  localStorage.setItem(key, value);
};

// --- SEED DATA ---
const d = "2026-06-25";
const tId1 = "tId-seed-1";
const tId2 = "tId-seed-2";

const SEED_ENTRIES: LedgerEntry[] = [
  { id: "e1", date: d, desc: "Opening balance", category: "Opening Balance", account: "Main Account", flow: "in", internal: false, amount: 2000 },
  { id: "e2", date: d, desc: "Salary received", category: "Salary", account: "Main Account", flow: "in", internal: false, amount: 194370.83 },
  { id: "e3", date: d, desc: "Sent to sister for exams", category: "Family / Gifts", account: "Main Account", flow: "out", internal: false, amount: 10000 },
  { id: "e4", date: d, desc: "Moved to Kuda for spending", category: "Internal Transfer", account: "Main Account", flow: "out", internal: true, transferId: tId1, amount: 30000 },
  { id: "e5", date: d, desc: "Received from Main Account", category: "Internal Transfer", account: "Kuda Bank", flow: "in", internal: true, transferId: tId1, amount: 30000 },
  { id: "e6", date: d, desc: "Airtime", category: "Airtime & Data", account: "Kuda Bank", flow: "out", internal: false, amount: 1000 },
  { id: "e7", date: d, desc: "POS cash withdrawal", category: "Internal Transfer", account: "Kuda Bank", flow: "out", internal: true, transferId: tId2, amount: 2000 },
  { id: "e8", date: d, desc: "Cash received from POS", category: "Internal Transfer", account: "Cash", flow: "in", internal: true, transferId: tId2, amount: 2000 },
  { id: "e9", date: d, desc: "POS withdrawal charge", category: "Bank Charges", account: "Kuda Bank", flow: "out", internal: false, amount: 100 },
  // Newly added entries from the list:
  { id: "e10", date: d, desc: "Food from Chowdeck", category: "Feeding", account: "Main Account", flow: "out", internal: false, amount: 3335 },
  { id: "e11", date: d, desc: "Transport back home from work", category: "Transport", account: "Cash", flow: "out", internal: false, amount: 1700 },
  { id: "e12", date: d, desc: "Tip for the mechanic", category: "Other Expense", account: "Cash", flow: "out", internal: false, amount: 200 }
];

export default function LedgerApp() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [budgets, setBudgets] = useState<BudgetMap>({});
  const [goals, setGoals] = useState<GoalMap>({});
  
  // UI Panels state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBudgetsOpen, setIsBudgetsOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

  // Form State
  const [formFlow, setFormFlow] = useState<'in' | 'out'>('in');
  const [formDate, setFormDate] = useState(todayISO());
  const [formAmount, setFormAmount] = useState('');
  const [formAccount, setFormAccount] = useState(ACCOUNTS[0]);
  const [formToAccount, setFormToAccount] = useState(ACCOUNTS[1]);
  const [formCategory, setFormCategory] = useState(CATEGORIES.in[0]);
  const [formDesc, setFormDesc] = useState('');
  const [formIsTransfer, setFormIsTransfer] = useState(false);

  // Budgets Edit State
  const [tempBudgets, setTempBudgets] = useState<BudgetMap>({});

  // Goals Edit State
  const [tempGoals, setTempGoals] = useState<GoalMap>({});

  // Edit & Delete confirmation state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTransferId, setEditingTransferId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtering / Search State
  const [activeFilter, setActiveFilter] = useState<'All' | string>('All');
  const [searchText, setSearchText] = useState('');

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const loadAll = async () => {
      let loadedEntries: LedgerEntry[] = [];
      try {
        const raw = await getStorage('entries');
        if (raw) {
          loadedEntries = JSON.parse(raw);
        }
      } catch (e) {
        console.error("Error loading entries", e);
      }
      
      if (!loadedEntries || loadedEntries.length === 0) {
        loadedEntries = SEED_ENTRIES;
        await setStorage('entries', JSON.stringify(SEED_ENTRIES));
      }
      setEntries(loadedEntries);

      try {
        const rawBudgets = await getStorage('budgets');
        if (rawBudgets) {
          setBudgets(JSON.parse(rawBudgets));
        }
      } catch (e) {
        console.error("Error loading budgets", e);
      }

      try {
        const rawGoals = await getStorage('goals');
        if (rawGoals) {
          setGoals(JSON.parse(rawGoals));
        }
      } catch (e) {
        console.error("Error loading goals", e);
      }
    };
    loadAll();
  }, []);

  // Update categories selection when flow changes
  useEffect(() => {
    const list = formFlow === 'in' ? CATEGORIES.in : CATEGORIES.out;
    setFormCategory(list[0]);
  }, [formFlow]);

  // --- PERSISTENCE HELPERS ---
  const saveEntries = async (newEntries: LedgerEntry[]) => {
    setEntries(newEntries);
    await setStorage('entries', JSON.stringify(newEntries));
  };

  const saveBudgets = async (newBudgets: BudgetMap) => {
    setBudgets(newBudgets);
    await setStorage('budgets', JSON.stringify(newBudgets));
  };

  const saveGoals = async (newGoals: GoalMap) => {
    setGoals(newGoals);
    await setStorage('goals', JSON.stringify(newGoals));
  };

  // --- DERIVED METRICS ---
  const accountBalances = useMemo(() => {
    const bal: { [acc: string]: number } = {};
    ACCOUNTS.forEach(a => bal[a] = 0);
    entries.forEach(e => {
      bal[e.account] += (e.flow === 'in' ? 1 : -1) * Number(e.amount);
    });
    return bal;
  }, [entries]);

  const totalBalance = useMemo(() => {
    return Object.values(accountBalances).reduce((sum, val) => sum + val, 0);
  }, [accountBalances]);

  const monthTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    let saved = 0;

    entries.forEach(e => {
      if (monthKey(e.date) !== thisMonth) return;
      if (e.internal) {
        if (SAVINGS_ACCOUNTS.includes(e.account) && e.flow === 'in') {
          saved += Number(e.amount);
        }
        return;
      }
      if (e.category === 'Opening Balance') return;
      if (e.flow === 'in') {
        income += Number(e.amount);
      } else {
        expense += Number(e.amount);
      }
    });

    const rate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
    const isWatch = income > 0 && expense / income > 0.6;

    return { income, expense, saved, rate, isWatch };
  }, [entries]);

  // Category progress calculations
  const categoryProgress = useMemo(() => {
    const totals: { [cat: string]: number } = {};
    entries.forEach(e => {
      if (e.internal || e.flow !== 'out' || e.category === 'Opening Balance') return;
      if (monthKey(e.date) !== thisMonth) return;
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });

    const budgetCats = Object.keys(budgets).filter(c => budgets[c] > 0);
    const allCats = Array.from(new Set([...Object.keys(totals), ...budgetCats]));

    const maxNoBudget = Object.values(totals).length ? Math.max(...Object.values(totals), 1) : 1;

    return allCats.map(cat => {
      const amt = totals[cat] || 0;
      const budget = budgets[cat] || 0;
      let pct = 0;
      let status: 'ok' | 'warn' | 'over' | '' = '';
      let label = fmt(amt);

      if (budget > 0) {
        pct = Math.min(100, (amt / budget) * 100);
        status = amt > budget ? 'over' : (amt / budget > 0.85 ? 'warn' : 'ok');
        label = `${fmt(amt)} / ${fmt(budget)}`;
      } else {
        pct = (amt / maxNoBudget) * 100;
        status = '';
      }

      return {
        category: cat,
        amt,
        budget,
        pct,
        status,
        label
      };
    }).sort((a, b) => b.amt - a.amt);
  }, [entries, budgets]);

  // Recharts: Net Worth Trend
  const netWorthTrendData = useMemo(() => {
    const byDate: { [dt: string]: number } = {};
    entries.forEach(e => {
      byDate[e.date] = (byDate[e.date] || 0) + (e.flow === 'in' ? 1 : -1) * Number(e.amount);
    });

    const dates = Object.keys(byDate).sort();
    let running = 0;
    
    return dates.map(d => {
      running += byDate[d];
      return {
        date: d,
        "Total Balance": Number(running.toFixed(2))
      };
    });
  }, [entries]);

  // Recharts: Monthly Cash Flow Trend
  const monthlyCashFlowData = useMemo(() => {
    const months: { [mk: string]: { income: number; expense: number } } = {};
    entries.forEach(e => {
      if (e.internal || e.category === 'Opening Balance') return;
      const mk = monthKey(e.date);
      if (!months[mk]) {
        months[mk] = { income: 0, expense: 0 };
      }
      if (e.flow === 'in') {
        months[mk].income += Number(e.amount);
      } else {
        months[mk].expense += Number(e.amount);
      }
    });

    return Object.keys(months).sort().map(k => ({
      monthKey: k,
      name: monthLabel(k),
      Income: Number(months[k].income.toFixed(2)),
      Spending: Number(months[k].expense.toFixed(2))
    }));
  }, [entries]);

  // Table Register calculation
  const filteredAndSortedEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => {
      if (a.date === b.date) return 0;
      return a.date < b.date ? 1 : -1;
    });

    return sorted.filter(e => {
      const matchAcc = activeFilter === 'All' || e.account === activeFilter;
      const matchText = !searchText || (
        e.desc.toLowerCase().includes(searchText.toLowerCase()) ||
        e.category.toLowerCase().includes(searchText.toLowerCase()) ||
        e.account.toLowerCase().includes(searchText.toLowerCase())
      );
      return matchAcc && matchText;
    });
  }, [entries, activeFilter, searchText]);

  // --- ACTIONS ---
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) {
      alert("Please enter an amount greater than zero.");
      return;
    }

    const date = formDate || todayISO();
    let desc = formDesc.trim();

    let updatedEntries = [...entries];

    if (editingId) {
      // Editing Mode
      if (editingTransferId) {
        // Transfer update - remove old legs first
        updatedEntries = updatedEntries.filter(x => x.transferId !== editingTransferId);
        
        const finalDesc = desc || "Internal Transfer";
        updatedEntries.push({
          id: editingId,
          date,
          desc: finalDesc,
          category: 'Internal Transfer',
          account: formAccount,
          flow: 'out',
          internal: true,
          transferId: editingTransferId,
          amount
        });
        updatedEntries.push({
          id: uid(),
          date,
          desc: `Received from ${formAccount}`,
          category: 'Internal Transfer',
          account: formToAccount,
          flow: 'in',
          internal: true,
          transferId: editingTransferId,
          amount
        });
      } else {
        // Standard entry update
        const finalDesc = desc || formCategory;
        updatedEntries = updatedEntries.map(x => {
          if (x.id === editingId) {
            return {
              ...x,
              date,
              amount,
              account: formAccount,
              category: formCategory,
              flow: formFlow,
              desc: finalDesc
            };
          }
          return x;
        });
      }
      resetForm();
    } else if (formIsTransfer) {
      // New Transfer Entry
      if (formAccount === formToAccount) {
        alert("Please pick two different accounts for a transfer.");
        return;
      }
      const tId = uid();
      const finalDesc = desc || "Internal Transfer";
      
      updatedEntries.push({
        id: uid(),
        date,
        desc: finalDesc,
        category: 'Internal Transfer',
        account: formAccount,
        flow: 'out',
        internal: true,
        transferId: tId,
        amount
      });
      
      updatedEntries.push({
        id: uid(),
        date,
        desc: `Received from ${formAccount}`,
        category: 'Internal Transfer',
        account: formToAccount,
        flow: 'in',
        internal: true,
        transferId: tId,
        amount
      });
      
      resetForm();
    } else {
      // New Standard Entry
      const finalDesc = desc || formCategory;
      updatedEntries.push({
        id: uid(),
        date,
        desc: finalDesc,
        category: formCategory,
        account: formAccount,
        flow: formFlow,
        internal: false,
        amount
      });
      
      resetForm();
    }

    await saveEntries(updatedEntries);
    setIsAddOpen(false);
  };

  const handleEditStart = (id: string) => {
    const target = entries.find(x => x.id === id);
    if (!target) return;

    setEditingId(target.id);
    setIsAddOpen(true);

    setFormDate(target.date);
    setFormAmount(target.amount.toString());
    setFormDesc(target.desc);

    if (target.transferId) {
      setEditingTransferId(target.transferId);
      const pair = entries.filter(x => x.transferId === target.transferId);
      const fromLeg = pair.find(x => x.flow === 'out');
      const toLeg = pair.find(x => x.flow === 'in');

      setFormIsTransfer(true);
      if (fromLeg) setFormAccount(fromLeg.account);
      if (toLeg) setFormToAccount(toLeg.account);
    } else {
      setEditingTransferId(null);
      setFormIsTransfer(false);
      setFormFlow(target.flow);
      setFormAccount(target.account);
      setFormCategory(target.category);
    }

    // Scroll form into view gently
    setTimeout(() => {
      document.getElementById('add-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleDeleteEntry = async (id: string) => {
    const target = entries.find(x => x.id === id);
    if (!target) return;

    let updated: LedgerEntry[];
    if (target.transferId) {
      updated = entries.filter(x => x.transferId !== target.transferId);
    } else {
      updated = entries.filter(x => x.id !== id);
    }
    
    await saveEntries(updated);
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingTransferId(null);
    setFormDate(todayISO());
    setFormAmount('');
    setFormDesc('');
    setFormIsTransfer(false);
    setFormFlow('in');
    setFormAccount(ACCOUNTS[0]);
    setFormToAccount(ACCOUNTS[1]);
  };

  // Budget saving
  const handleOpenBudgets = () => {
    const init: BudgetMap = {};
    CATEGORIES.out.forEach(c => {
      init[c] = budgets[c] || 0;
    });
    setTempBudgets(init);
    setIsBudgetsOpen(true);
  };

  const handleSaveBudgets = async () => {
    const nextBudgets: BudgetMap = {};
    Object.keys(tempBudgets).forEach(c => {
      if (tempBudgets[c] > 0) {
        nextBudgets[c] = tempBudgets[c];
      }
    });
    await saveBudgets(nextBudgets);
    setIsBudgetsOpen(false);
  };

  // Goals saving
  const handleOpenGoals = () => {
    const init: GoalMap = {};
    SAVINGS_ACCOUNTS.forEach(acc => {
      init[acc] = goals[acc] || { target: 0, date: '', label: '' };
    });
    setTempGoals(init);
    setIsGoalsOpen(true);
  };

  const handleSaveGoals = async () => {
    const nextGoals: GoalMap = {};
    SAVINGS_ACCOUNTS.forEach(acc => {
      const data = tempGoals[acc];
      if (data && data.target > 0) {
        nextGoals[acc] = data;
      }
    });
    await saveGoals(nextGoals);
    setIsGoalsOpen(false);
  };

  return (
    <div className="ledger-page">
      {/* SCOPED CUSTOM STYLES PRESERVING THE ORIGINAL AESTHETIC WITH REFINED POLISH */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .ledger-page {
          --paper: #FAF7EF;
          --paper-line: #DCD2B6;
          --ink: #1B2B23;
          --ink-soft: #51604F;
          --green: #2F6F4E;
          --green-deep: #1F4D35;
          --red: #A8392B;
          --gold: #B9842B;
          --card: #FFFDF7;
          --shadow: 0 4px 12px rgba(27,43,35,0.06), 0 1px 2px rgba(27,43,35,0.04);
          
          margin: 0;
          padding: 36px 22px 80px;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          background: var(--paper);
          background-image: repeating-linear-gradient(transparent, transparent 27px, var(--paper-line) 28px);
        }

        .ledger-wrap {
          max-width: 1040px;
          margin: 0 auto;
          position: relative;
        }

        .ledger-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          padding-bottom: 18px;
          border-bottom: 2px solid var(--ink);
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .brand-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin: 0 0 6px;
        }

        .ledger-h1 {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 42px;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .stamp {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          border: 2px solid var(--green-deep);
          color: var(--green-deep);
          padding: 8px 14px;
          border-radius: 3px;
          transform: rotate(-4deg);
          white-space: nowrap;
          position: relative;
          transition: all 0.3s ease;
        }

        .stamp.alert {
          border-color: var(--red);
          color: var(--red);
          transform: rotate(3deg);
        }

        .stamp::after {
          content: '';
          position: absolute;
          inset: 3px;
          border: 1px solid currentColor;
          border-radius: 2px;
          opacity: .5;
        }

        .balance-block {
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .balance-block .label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }

        .balance-block .amount {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 46px;
          font-weight: 600;
          color: var(--green-deep);
        }

        .accounts-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 14px;
          margin-bottom: 26px;
        }

        .acct-card {
          background: var(--card);
          border: 1px solid var(--paper-line);
          border-left: 4px solid var(--green-deep);
          border-radius: 4px;
          padding: 14px 16px;
          box-shadow: var(--shadow);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
        }

        .acct-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(27,43,35,0.08);
        }

        .acct-card.savings {
          border-left-color: var(--gold);
        }

        .acct-card .name {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: var(--ink-soft);
          margin-bottom: 6px;
          font-weight: 600;
        }

        .acct-card .bal {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 21px;
          font-weight: 600;
        }

        .kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          margin-bottom: 34px;
        }

        .kpi {
          border: 1px dashed var(--paper-line);
          border-radius: 4px;
          padding: 12px 16px;
          background: rgba(255, 253, 247, 0.5);
          transition: all 0.2s ease;
        }

        .kpi:hover {
          background: rgba(255, 253, 247, 0.85);
          border-style: solid;
        }

        .kpi .k-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: var(--ink-soft);
        }

        .kpi .k-val {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 19px;
          font-weight: 600;
          margin-top: 4px;
        }

        .kpi.income .k-val { color: var(--green-deep); }
        .kpi.expense .k-val { color: var(--red); }
        .kpi.saved .k-val { color: var(--gold); }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0 14px;
          flex-wrap: wrap;
        }

        .section-title h2 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 22px;
          margin: 0;
        }

        .section-title .rule {
          flex: 1;
          height: 1px;
          background: var(--paper-line);
        }

        .mini-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: .03em;
          background: transparent;
          color: var(--green-deep);
          border: 1px solid var(--green-deep);
          border-radius: 14px;
          padding: 6px 12px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .mini-btn:hover {
          background: rgba(47,111,78,.1);
          transform: scale(1.02);
        }

        .add-toggle {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: .04em;
          background: var(--green-deep);
          color: #fff;
          border: none;
          border-radius: 3px;
          padding: 10px 16px;
          cursor: pointer;
          margin-bottom: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }

        .add-toggle:hover {
          background: var(--green);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .panel-anim {
          animation: slideDownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideDownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .add-panel, .settings-panel {
          background: var(--card);
          border: 1px solid var(--paper-line);
          border-radius: 6px;
          padding: 18px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(27,43,35,0.08);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-grid .full {
          grid-column: 1 / -1;
        }

        label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--ink-soft);
          margin-bottom: 5px;
          font-weight: 600;
        }

        input, select {
          width: 100%;
          padding: 9px 10px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          border: 1px solid var(--paper-line);
          border-radius: 3px;
          background: #fff;
          color: var(--ink);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(47,111,78,0.15);
        }

        .flow-toggle {
          display: flex;
          gap: 8px;
        }

        .flow-toggle button {
          flex: 1;
          padding: 9px;
          border-radius: 3px;
          border: 1px solid var(--paper-line);
          background: #fff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-soft);
          transition: all 0.2s ease;
        }

        .flow-toggle button.active.in {
          background: rgba(47,111,78,.12);
          border-color: var(--green-deep);
          color: var(--green-deep);
        }

        .flow-toggle button.active.out {
          background: rgba(168,57,43,.1);
          border-color: var(--red);
          color: var(--red);
        }

        .transfer-check {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }

        .transfer-check input {
          width: auto;
          cursor: pointer;
        }

        .transfer-check label {
          margin: 0;
          cursor: pointer;
          user-select: none;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .btn-primary {
          background: var(--ink);
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 3px;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #2a3f34;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: transparent;
          color: var(--ink-soft);
          border: 1px solid var(--paper-line);
          padding: 10px 18px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: rgba(27,43,35,0.03);
          border-color: var(--ink-soft);
        }

        .budget-row, .goal-input-row {
          display: grid;
          grid-template-columns: 1fr 140px;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
        }

        .budget-row label, .goal-input-row label {
          margin: 0;
          font-size: 13px;
          text-transform: none;
          color: var(--ink);
          font-weight: 500;
        }

        .goal-block {
          border: 1px solid var(--paper-line);
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 12px;
          background: rgba(255,255,255,0.3);
        }

        .goal-block .gb-title {
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 8px;
          color: var(--ink);
        }

        .filters {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .filters button {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          border: 1px solid var(--paper-line);
          background: transparent;
          color: var(--ink-soft);
          padding: 6px 12px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filters button.active {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
        }

        .search-box {
          flex: 1;
          min-width: 180px;
        }

        .search-box input {
          padding: 7px 10px;
          font-size: 13px;
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin-top: 14px;
        }

        table {
          width: 100%;
          min-width: 520px;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        thead th {
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--ink-soft);
          border-bottom: 2px solid var(--ink);
          padding: 8px 6px;
          font-weight: 600;
        }

        tbody td {
          padding: 9px 6px;
          border-bottom: 1px solid var(--paper-line);
          vertical-align: top;
          transition: background-color 0.2s ease;
        }

        tr:hover td {
          background-color: rgba(27,43,35,0.015);
        }

        td.num, th.num {
          text-align: right;
          font-family: 'IBM Plex Mono', monospace;
          white-space: nowrap;
        }

        td.debit { color: var(--red); }
        td.credit { color: var(--green-deep); }

        .tag {
          display: inline-block;
          font-size: 10.5px;
          padding: 2px 7px;
          border-radius: 10px;
          background: var(--paper-line);
          color: var(--ink-soft);
          font-weight: 600;
          margin-left: 8px;
        }

        .row-actions {
          display: flex;
          gap: 8px;
          white-space: nowrap;
        }

        .row-actions button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ink-soft);
          font-size: 12px;
          text-decoration: underline;
          padding: 0;
          transition: color 0.15s ease;
        }

        .row-actions button:hover { color: var(--red); }
        .row-actions button.edit-btn:hover { color: var(--green-deep); }

        .empty-row td {
          text-align: center;
          color: var(--ink-soft);
          padding: 30px 0;
          font-style: italic;
        }

        .cat-bars { margin-top: 6px; }

        .cat-row {
          display: grid;
          grid-template-columns: minmax(90px, 140px) 1fr minmax(80px, 130px);
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .cat-row .cname {
          font-size: 13px;
          font-weight: 600;
        }

        .cat-row .track {
          height: 10px;
          background: var(--paper-line);
          border-radius: 5px;
          overflow: hidden;
        }

        .cat-row .fill {
          height: 100%;
          border-radius: 5px;
          background: var(--ink-soft);
          transition: width 0.4s ease;
        }

        .cat-row .fill.ok { background: var(--green-deep); }
        .cat-row .fill.warn { background: var(--gold); }
        .cat-row .fill.over { background: var(--red); }

        .cat-row .camt {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          text-align: right;
          color: var(--ink-soft);
        }

        .goals-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .goal-card {
          background: var(--card);
          border: 1px solid var(--paper-line);
          border-radius: 6px;
          padding: 14px 16px;
          box-shadow: var(--shadow);
          transition: transform 0.2s ease;
        }

        .goal-card:hover {
          transform: translateY(-1px);
        }

        .goal-card .gname {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .goal-card .glabel {
          font-size: 12px;
          color: var(--ink-soft);
          margin-bottom: 10px;
        }

        .goal-card .track {
          height: 10px;
          background: var(--paper-line);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .goal-card .fill {
          height: 100%;
          background: var(--gold);
          border-radius: 5px;
          transition: width 0.4s ease;
        }

        .goal-card .gnums {
          display: flex;
          justify-content: space-between;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--ink-soft);
        }

        .goal-card .gnums b { color: var(--ink); }
        .goal-card .no-goal {
          font-size: 12.5px;
          color: var(--ink-soft);
          font-style: italic;
        }

        .chart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .chart-box {
          background: var(--card);
          border: 1px solid var(--paper-line);
          border-radius: 6px;
          padding: 18px 14px 14px;
          min-width: 0;
          box-shadow: var(--shadow);
        }

        .chart-box h3 {
          font-size: 12px;
          margin: 0 0 14px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: var(--ink-soft);
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
        }

        .chart-canvas-wrap {
          position: relative;
          height: 220px;
          width: 100%;
        }

        footer {
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid var(--paper-line);
          font-size: 11px;
          color: var(--ink-soft);
          font-family: 'IBM Plex Mono', monospace;
          text-align: center;
          letter-spacing: 0.02em;
        }

        @media (max-width: 680px) {
          .ledger-page { padding: 24px 14px 60px; }
          .accounts-row, .kpi-row, .chart-grid { grid-template-columns: 1fr; }
          .form-grid, .budget-row, .goal-input-row { grid-template-columns: 1fr; }
          .ledger-h1 { font-size: 30px; }
          .balance-block .amount { font-size: 32px; }
          .balance-block { gap: 8px; }
          table { font-size: 12px; }
          input, select { font-size: 16px; }
          .section-title { gap: 8px; }
          .section-title h2 { font-size: 18px; }
          .chart-canvas-wrap { height: 190px; }
        }

        @media (max-width: 420px) {
          .ledger-h1 { font-size: 25px; }
          .brand-eyebrow { font-size: 10px; }
          .stamp { font-size: 10.5px; padding: 6px 10px; }
          .balance-block .amount { font-size: 26px; }
          .balance-block .label { font-size: 11px; }
          .acct-card, .goal-card { padding: 11px 12px; }
          .acct-card .bal { font-size: 18px; }
          .kpi { padding: 10px 12px; }
          .kpi .k-val { font-size: 16px; }
          .cat-row { grid-template-columns: 1fr; gap: 4px; }
          .cat-row .camt { text-align: left; }
          .filters { gap: 6px; }
          .filters button { padding: 5px 10px; font-size: 11px; }
          .mini-btn { font-size: 11px; padding: 5px 10px; }
        }
        `
      }} />

      <div className="ledger-wrap">
        {/* HEADER */}
        <header className="ledger-header">
          <div>
            <p className="brand-eyebrow">Personal Cash Book · Started June 2026</p>
            <h1 className="ledger-h1">The Ledger</h1>
          </div>
          <div className={`stamp ${monthTotals.isWatch ? 'alert' : ''}`}>
            {monthTotals.isWatch ? 'WATCH SPENDING' : 'ON TRACK'}
          </div>
        </header>

        {/* BALANCE */}
        <div className="balance-block">
          <span className="label">Total balance</span>
          <span className="amount">{fmt(totalBalance)}</span>
        </div>

        {/* ACCOUNTS LIST */}
        <div className="accounts-row">
          {ACCOUNTS.map(a => (
            <div key={a} className={`acct-card ${SAVINGS_ACCOUNTS.includes(a) ? 'savings' : ''}`}>
              <div className="name">{a}</div>
              <div className="bal">{fmt(accountBalances[a] || 0)}</div>
            </div>
          ))}
        </div>

        {/* KPI METRICS */}
        <div className="kpi-row">
          <div className="kpi income">
            <div className="k-label">Income this month</div>
            <div className="k-val">{fmt(monthTotals.income)}</div>
          </div>
          <div className="kpi expense">
            <div className="k-label">Spent this month</div>
            <div className="k-val">{fmt(monthTotals.expense)}</div>
          </div>
          <div className="kpi saved">
            <div className="k-label">Saved &amp; invested this month</div>
            <div className="k-val">{fmt(monthTotals.saved)}</div>
          </div>
          <div className="kpi">
            <div className="k-label">Savings rate</div>
            <div className="k-val">{monthTotals.rate}%</div>
          </div>
        </div>

        {/* ADD TRANSACTION PANEL */}
        <button
          className="add-toggle"
          onClick={() => {
            if (isAddOpen) resetForm();
            setIsAddOpen(!isAddOpen);
          }}
        >
          {isAddOpen ? '✕ Close Panel' : '+ Record a new entry'}
        </button>

        {isAddOpen && (
          <div className="add-panel panel-anim" id="add-panel">
            <form onSubmit={handleSaveEntry}>
              <div className="form-grid">
                
                {/* Flow Toggle (only show for standard transactions, hide or lock if isTransfer) */}
                <div className="full">
                  <label>Money in or out?</label>
                  <div className="flow-toggle">
                    <button
                      type="button"
                      disabled={formIsTransfer}
                      className={!formIsTransfer && formFlow === 'in' ? 'active in' : ''}
                      onClick={() => setFormFlow('in')}
                    >
                      Money In
                    </button>
                    <button
                      type="button"
                      disabled={formIsTransfer}
                      className={formIsTransfer || formFlow === 'out' ? 'active out' : ''}
                      onClick={() => setFormFlow('out')}
                    >
                      Money Out
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="f-date">Date</label>
                  <input
                    type="date"
                    id="f-date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="f-amount">Amount (₦)</label>
                  <input
                    type="number"
                    id="f-amount"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="f-account">
                    {formIsTransfer ? "From account" : "Account"}
                  </label>
                  <select
                    id="f-account"
                    value={formAccount}
                    onChange={(e) => setFormAccount(e.target.value)}
                  >
                    {ACCOUNTS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                {formIsTransfer && (
                  <div>
                    <label htmlFor="f-to-account">To account</label>
                    <select
                      id="f-to-account"
                      value={formToAccount}
                      onChange={(e) => setFormToAccount(e.target.value)}
                    >
                      {ACCOUNTS.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                )}

                {!formIsTransfer && (
                  <div>
                    <label htmlFor="f-category">Category</label>
                    <select
                      id="f-category"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      {(formFlow === 'in' ? CATEGORIES.in : CATEGORIES.out).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="full">
                  <label htmlFor="f-desc">Description</label>
                  <input
                    type="text"
                    id="f-desc"
                    placeholder={formIsTransfer ? "e.g. Moved savings" : `e.g. ${formCategory}`}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>

                <div className="full transfer-check">
                  <input
                    type="checkbox"
                    id="f-transfer"
                    disabled={editingId !== null} // Lock type on edit to maintain paired logic simply
                    checked={formIsTransfer}
                    onChange={(e) => setFormIsTransfer(e.target.checked)}
                  />
                  <label htmlFor="f-transfer">
                    This is a transfer between my own accounts — won't count as income or spending
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update entry' : 'Save entry'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsAddOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SPENDING BY CATEGORY */}
        <div className="section-title">
          <h2>Spending by category</h2>
          <div className="rule"></div>
          <button className="mini-btn" onClick={handleOpenBudgets}>
            Set budgets
          </button>
        </div>

        {isBudgetsOpen && (
          <div className="settings-panel panel-anim">
            <div className="budget-list">
              {CATEGORIES.out.map(cat => (
                <div className="budget-row" key={cat}>
                  <label>{cat}</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="No limit"
                    value={tempBudgets[cat] || ''}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setTempBudgets({ ...tempBudgets, [cat]: isNaN(v) ? 0 : v });
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSaveBudgets}>
                Save budgets
              </button>
              <button className="btn-secondary" onClick={() => setIsBudgetsOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        <div className="cat-bars">
          {categoryProgress.length === 0 ? (
            <p style={{ color: 'var(--ink-soft)', fontSize: '13px' }}>
              No spending recorded this month yet.
            </p>
          ) : (
            categoryProgress.map(item => (
              <div className="cat-row" key={item.category}>
                <div className="cname">{item.category}</div>
                <div className="track">
                  <div
                    className={`fill ${item.status}`}
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
                <div className="camt">{item.label}</div>
              </div>
            ))
          )}
        </div>

        {/* SAVINGS GOALS */}
        <div className="section-title">
          <h2>Savings goals</h2>
          <div className="rule"></div>
          <button className="mini-btn" onClick={handleOpenGoals}>
            Set goals
          </button>
        </div>

        {isGoalsOpen && (
          <div className="settings-panel panel-anim">
            {SAVINGS_ACCOUNTS.map(acc => {
              const g = tempGoals[acc] || { target: 0, date: '', label: '' };
              return (
                <div className="goal-block" key={acc}>
                  <div className="gb-title">{acc}</div>
                  <div className="form-grid">
                    <div>
                      <label>Target amount (₦)</label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="e.g. 100000"
                        value={g.target || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setTempGoals({
                            ...tempGoals,
                            [acc]: { ...g, target: isNaN(v) ? 0 : v }
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label>Target date (optional)</label>
                      <input
                        type="date"
                        value={g.date || ''}
                        onChange={(e) => {
                          setTempGoals({
                            ...tempGoals,
                            [acc]: { ...g, date: e.target.value }
                          });
                        }}
                      />
                    </div>
                    <div className="full">
                      <label>Label (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Emergency fund"
                        value={g.label || ''}
                        onChange={(e) => {
                          setTempGoals({
                            ...tempGoals,
                            [acc]: { ...g, label: e.target.value }
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSaveGoals}>
                Save goals
              </button>
              <button className="btn-secondary" onClick={() => setIsGoalsOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        <div className="goals-row">
          {SAVINGS_ACCOUNTS.map(acc => {
            const g = goals[acc];
            const current = Math.max(0, accountBalances[acc] || 0);

            if (!g || !g.target) {
              return (
                <div className="goal-card" key={acc}>
                  <div className="gname">{acc}</div>
                  <div className="no-goal">
                    No savings goal set yet. Click "Set goals" to add one.
                  </div>
                </div>
              );
            }

            const pct = Math.min(100, (current / g.target) * 100);
            const labelLine = (g.label ? g.label : 'Savings goal') + (g.date ? ` · by ${g.date}` : '');

            return (
              <div className="goal-card" key={acc}>
                <div className="gname">{acc}</div>
                <div className="glabel">{labelLine}</div>
                <div className="track">
                  <div className="fill" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="gnums">
                  <span><b>{fmt(current)}</b> saved</span>
                  <span>of {fmt(g.target)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* TRENDS SECTION */}
        <div className="section-title">
          <h2>Trends</h2>
          <div className="rule"></div>
        </div>

        <div className="chart-grid">
          {/* Total balance over time */}
          <div className="chart-box">
            <h3>Total balance over time</h3>
            <div className="chart-canvas-wrap">
              {netWorthTrendData.length === 0 ? (
                <div style={{ color: 'var(--ink-soft)', fontStyle: 'italic', fontSize: '13px', paddingTop: '40px', textAlign: 'center' }}>
                  Not enough data to plot.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={netWorthTrendData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCD2B6" opacity={0.5} />
                    <XAxis
                      dataKey="date"
                      stroke="#51604F"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#51604F"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `₦${val.toLocaleString()}`}
                    />
                    <RechartsTooltip
                      formatter={(value: any) => [fmt(Number(value)), 'Balance']}
                      contentStyle={{
                        background: '#FFFDF7',
                        border: '1px solid #DCD2B6',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        color: '#1B2B23',
                        borderRadius: '4px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Total Balance"
                      stroke="#1F4D35"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#1F4D35' }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Income vs spending */}
          <div className="chart-box">
            <h3>Income vs spending by month</h3>
            <div className="chart-canvas-wrap">
              {monthlyCashFlowData.length === 0 ? (
                <div style={{ color: 'var(--ink-soft)', fontStyle: 'italic', fontSize: '13px', paddingTop: '40px', textAlign: 'center' }}>
                  Not enough data to plot.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyCashFlowData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCD2B6" opacity={0.5} />
                    <XAxis
                      dataKey="name"
                      stroke="#51604F"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#51604F"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `₦${val.toLocaleString()}`}
                    />
                    <RechartsTooltip
                      formatter={(value: any) => [fmt(Number(value))]}
                      contentStyle={{
                        background: '#FFFDF7',
                        border: '1px solid #DCD2B6',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        color: '#1B2B23',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: '11px',
                        fontFamily: 'IBM Plex Mono, monospace',
                        paddingTop: '10px'
                      }}
                    />
                    <Bar dataKey="Income" fill="#2F6F4E" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Spending" fill="#A8392B" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* REGISTER SECTION */}
        <div className="section-title">
          <h2>Register</h2>
          <div className="rule"></div>
        </div>

        {/* Account Filters */}
        <div className="filters">
          <button
            className={activeFilter === 'All' ? 'active' : ''}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          {ACCOUNTS.map(a => (
            <button
              key={a}
              className={activeFilter === a ? 'active' : ''}
              onClick={() => setActiveFilter(a)}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Text Search */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search description, category or account..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {/* Ledgers Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Account</th>
                <th className="num">Debit</th>
                <th className="num">Credit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedEntries.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={6}>Nothing matches — try a different search or filter.</td>
                </tr>
              ) : (
                filteredAndSortedEntries.map(e => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td>
                      {e.desc}
                      <span className="tag">{e.category}</span>
                    </td>
                    <td>{e.account}</td>
                    <td className="num debit">
                      {e.flow === 'out' ? fmt(e.amount) : ''}
                    </td>
                    <td className="num credit">
                      {e.flow === 'in' ? fmt(e.amount) : ''}
                    </td>
                    <td>
                      <div className="row-actions">
                        {deletingId === e.id ? (
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace' }}>Sure?</span>
                            <button
                              onClick={() => {
                                handleDeleteEntry(e.id);
                                setDeletingId(null);
                              }}
                              style={{ color: 'var(--red)', textDecoration: 'underline' }}
                            >
                              yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              style={{ color: 'var(--ink-soft)', textDecoration: 'underline' }}
                            >
                              no
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => handleEditStart(e.id)}
                            >
                              edit
                            </button>
                            <button
                              onClick={() => setDeletingId(e.id)}
                            >
                              remove
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer>
          Entries are saved privately to your account and stay synced wherever you open this page.
        </footer>
      </div>
    </div>
  );
}
