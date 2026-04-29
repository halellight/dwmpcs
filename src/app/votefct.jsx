import { useState, useRef } from "react";

const transactions = [
  { id: 1, date: "01/12/2025", description: "YIAGA AFRICA INITIATIVE PROJECT 2 – 70% Grant (First Tranche)", beneficiary: "YIAGA AFRICA INITIATIVE", category: "Grant Inflow", amount: 2800000, type: "deposit" },
  { id: 2, date: "26/03/2026", description: "Last Tranche – Project Funding (PP_NIP_1089145389)", beneficiary: "TUD / YIAGA AFRICA", category: "Grant Inflow", amount: 1200000, type: "deposit" },
  { id: 3, date: "31/12/2025", description: "UBA Interest", beneficiary: "BELLO-IBE", category: "Grant Inflow", amount: 19259.18, type: "deposit" },
  { id: 4, date: "31/12/2025", description: "Transportation to the venue", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Transportation", amount: 5010.75, type: "withdrawal" },
  { id: 5, date: "31/12/2025", description: "Data Bundle for Social Media", beneficiary: "MFREKEMFON BASSEY BASS", category: "Digital/Comms", amount: 10026.88, type: "withdrawal" },
  { id: 6, date: "02/01/2026", description: "Payment of December Stipend", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Team Stipend", amount: 250053.75, type: "withdrawal" },
  { id: 7, date: "02/01/2026", description: "Payment – Printables", beneficiary: "ODOGUN KAYODE PROMISE", category: "Branding/Merch", amount: 230053.75, type: "withdrawal" },
  { id: 8, date: "15/01/2026", description: "Payment for Video Content Production", beneficiary: "V:72 MEDIA – ELIZABETH", category: "Media/Production", amount: 135053.75, type: "withdrawal" },
  { id: 8, date: "15/01/2026", description: "Payment for Campaign Shirts", beneficiary: "BABALOLA, MICHAEL SAMSO", category: "Branding/Merch", amount: 100053.75, type: "withdrawal" },
  { id: 9, date: "20/01/2026", description: "Campaign Event Services", beneficiary: "BABALOLA, MICHAEL SAMSO", category: "Event", amount: 300053.75, type: "withdrawal" },
  { id: 10, date: "21/01/2026", description: "Transportation to INEC", beneficiary: "MONDAY PETER", category: "Transportation", amount: 24700.00, type: "withdrawal" },
  { id: 11, date: "21/01/2026", description: "Transportation for Street Campaign", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Transportation", amount: 10326.88, type: "withdrawal" },
  { id: 12, date: "23/01/2026", description: "Transport Allowance", beneficiary: "MUHAMMED ROFIAT OYINE", category: "Transportation", amount: 20026.88, type: "withdrawal" },
  { id: 13, date: "23/01/2026", description: "Transport Allowance", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 20026.88, type: "withdrawal" },
  { id: 14, date: "25/01/2026", description: "Transport Street Interview Allowance", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 9726.88, type: "withdrawal" },
  { id: 15, date: "25/01/2026", description: "Transportation to Yiaga Office", beneficiary: "MONDAY PETER", category: "Transportation", amount: 20000.00, type: "withdrawal" },
  { id: 16, date: "25/01/2026", description: "Transport Allowance", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Transportation", amount: 10026.88, type: "withdrawal" },
  { id: 17, date: "25/01/2026", description: "Transport Allowance", beneficiary: "BALA ILIYA", category: "Transportation", amount: 10026.88, type: "withdrawal" },
  { id: 18, date: "25/01/2026", description: "Studio Rental", beneficiary: "MYKE VISUALS", category: "Media/Production", amount: 35026.88, type: "withdrawal" },
  { id: 19, date: "25/01/2026", description: "Transport Allowance", beneficiary: "AISHA MUHAMMADAUWAL", category: "Transportation", amount: 10026.88, type: "withdrawal" },
  { id: 20, date: "26/01/2026", description: "Transport Refund", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 4910.75, type: "withdrawal" },
  { id: 21, date: "26/01/2026", description: "Transportation Fee", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 7026.88, type: "withdrawal" },
  { id: 22, date: "28/01/2026", description: "Graphic Design Payment", beneficiary: "HABIB ADAJI", category: "Design", amount: 5010.75, type: "withdrawal" },
  { id: 23, date: "28/01/2026", description: "Balance Transport", beneficiary: "MONDAY PETER", category: "Transportation", amount: 5000.00, type: "withdrawal" },
  { id: 24, date: "28/01/2026", description: "Balance Payment", beneficiary: "MUHAMMED ROFIAT OYINE", category: "Transportation", amount: 5010.75, type: "withdrawal" },
  { id: 25, date: "29/01/2026", description: "Content Creator Payment", beneficiary: "OSELUMENOSE UNDERSTAND", category: "Digital/Comms", amount: 15026.88, type: "withdrawal" },
  { id: 26, date: "29/01/2026", description: "Cards for Distribution", beneficiary: "ODOGUN KAYODE PROMISE", category: "Branding/Merch", amount: 110053.75, type: "withdrawal" },
  { id: 27, date: "29/01/2026", description: "Videographer and Photographer", beneficiary: "BABALOLA, MICHAEL SAMSO", category: "Media/Production", amount: 100053.75, type: "withdrawal" },
  { id: 28, date: "29/01/2026", description: "Transport Balance", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 10026.88, type: "withdrawal" },
  { id: 29, date: "30/01/2026", description: "January Stipend", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Team Stipend", amount: 50026.88, type: "withdrawal" },
  { id: 30, date: "30/01/2026", description: "January Stipend", beneficiary: "MUHAMMED ROFIAT OYINE", category: "Team Stipend", amount: 50026.88, type: "withdrawal" },
  { id: 31, date: "30/01/2026", description: "January Stipend", beneficiary: "MONDAY PETER", category: "Team Stipend", amount: 50000.00, type: "withdrawal" },
  { id: 32, date: "30/01/2026", description: "January Stipend", beneficiary: "MFREKEMFON BASSEY BASS", category: "Team Stipend", amount: 50026.88, type: "withdrawal" },
  { id: 33, date: "30/01/2026", description: "January Stipend", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Team Stipend", amount: 50026.88, type: "withdrawal" },
  { id: 34, date: "30/01/2026", description: "Delivery of Letters to Electorates", beneficiary: "SHEDRACH OCHOLECHE IDO", category: "Logistics", amount: 17026.88, type: "withdrawal" },
  { id: 35, date: "30/01/2026", description: "Banner and Card Design", beneficiary: "TAIWO TEMILOLUWA ARIYO", category: "Design", amount: 10026.88, type: "withdrawal" },
  { id: 36, date: "01/02/2026", description: "Food for Team", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Logistics", amount: 40026.88, type: "withdrawal" },
  { id: 37, date: "01/02/2026", description: "Volunteer Rally", beneficiary: "LEO EJEH AMANAH", category: "Volunteer", amount: 10026.88, type: "withdrawal" },
  { id: 38, date: "01/02/2026", description: "Volunteer Rally", beneficiary: "OBI SAMUEL OBINNA", category: "Volunteer", amount: 10026.88, type: "withdrawal" },
  { id: 39, date: "01/02/2026", description: "Volunteer Rally", beneficiary: "AISHA MUHAMMADAUWAL", category: "Volunteer", amount: 10026.88, type: "withdrawal" },
  { id: 40, date: "01/02/2026", description: "Volunteer Payment", beneficiary: "OBASHEFUNMI OTHNIEL M", category: "Volunteer", amount: 10026.88, type: "withdrawal" },
  { id: 41, date: "01/02/2026", description: "Content Creator", beneficiary: "OSELUMENOSE UNDERSTAND", category: "Digital/Comms", amount: 20026.88, type: "withdrawal" },
  { id: 42, date: "01/02/2026", description: "Transportation Core Campaign", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Transportation", amount: 15026.88, type: "withdrawal" },
  { id: 43, date: "01/02/2026", description: "Transportation Core Campaign", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 15026.88, type: "withdrawal" },
  { id: 44, date: "01/02/2026", description: "Payment for Drinks (Event)", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Event", amount: 14426.88, type: "withdrawal" },
  { id: 45, date: "01/02/2026", description: "Web Developer Payment", beneficiary: "TOYEEBAHT ODUNAYO AREM", category: "Digital/Comms", amount: 70053.75, type: "withdrawal" },
  { id: 46, date: "01/02/2026", description: "Transportation", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 22026.88, type: "withdrawal" },
  { id: 47, date: "01/02/2026", description: "Transportation", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Transportation", amount: 7026.88, type: "withdrawal" },
  { id: 48, date: "01/02/2026", description: "Transportation", beneficiary: "BLESSING KILE SAMUEL", category: "Transportation", amount: 10026.88, type: "withdrawal" },
  { id: 49, date: "01/02/2026", description: "Driver Balance", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 3010.75, type: "withdrawal" },
  { id: 50, date: "10/02/2026", description: "Payment for Drug Supplies", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Logistics", amount: 50026.88, type: "withdrawal" },
  { id: 51, date: "10/02/2026", description: "Payment for Graphic Design", beneficiary: "TAIWO TEMILOLUWA ARIYO", category: "Design", amount: 10026.88, type: "withdrawal" },
  { id: 52, date: "15/02/2026", description: "TikTok Advertising", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Digital/Comms", amount: 30026.88, type: "withdrawal" },
  { id: 53, date: "15/02/2026", description: "Transportation", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 7026.88, type: "withdrawal" },
  { id: 54, date: "15/02/2026", description: "Data Bundle for Social Media", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Digital/Comms", amount: 10026.88, type: "withdrawal" },
  { id: 55, date: "17/02/2026", description: "Transportation and Printing", beneficiary: "MONDAY PETER", category: "Transportation", amount: 25000.00, type: "withdrawal" },
  { id: 56, date: "17/02/2026", description: "Giveaway for Corp Members", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Event", amount: 12526.88, type: "withdrawal" },
  { id: 57, date: "17/02/2026", description: "NYSC CDS Anchor Fee", beneficiary: "BABALOLA, MICHAEL SAMSO", category: "Event", amount: 100053.75, type: "withdrawal" },
  { id: 58, date: "17/02/2026", description: "Transportation to NYSC", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 22026.88, type: "withdrawal" },
  { id: 59, date: "17/02/2026", description: "Transportation to INEC", beneficiary: "MONDAY PETER", category: "Transportation", amount: 25000.00, type: "withdrawal" },
  { id: 60, date: "18/02/2026", description: "INEC Official Stipend", beneficiary: "MONDAY SARKI", category: "INEC Liaison", amount: 20026.88, type: "withdrawal" },
  { id: 61, date: "18/02/2026", description: "Payment for Advertisement", beneficiary: "IGONOR, DORCAS MWUESE", category: "Media/Production", amount: 500053.75, type: "withdrawal" },
  { id: 62, date: "26/03/2026", description: "Logistics for Situation Room", beneficiary: "CHIKA SAMSON NWACHUKWU", category: "Logistics", amount: 50000.00, type: "withdrawal" },
  { id: 63, date: "26/03/2026", description: "Printing of Banners and T-Shirts", beneficiary: "DEOPTIC BRAND NIGERIA", category: "Branding/Merch", amount: 62618.75, type: "withdrawal" },
  { id: 64, date: "26/03/2026", description: "Content Creation", beneficiary: "OSELUMENOSE UNDERSTAND", category: "Digital/Comms", amount: 65053.75, type: "withdrawal" },
  { id: 65, date: "26/03/2026", description: "Facility Rental – Situation Room", beneficiary: "YULONIX LTD", category: "Event", amount: 139803.75, type: "withdrawal" },
  { id: 66, date: "27/03/2026", description: "Newspaper Publication", beneficiary: "PRECIOUS UMEANAETO", category: "Media/Production", amount: 50026.88, type: "withdrawal" },
  { id: 67, date: "27/03/2026", description: "Payment for Newspaper Publication", beneficiary: "ADETINUYO JULIAN CHINY", category: "Media/Production", amount: 50026.88, type: "withdrawal" },
  { id: 68, date: "27/03/2026", description: "Graphic Designer – Situation Room", beneficiary: "EBIEMA REGINA ABILE", category: "Design", amount: 30026.88, type: "withdrawal" },
  { id: 69, date: "27/03/2026", description: "Transportation Stipend", beneficiary: "MONDAY PETER", category: "Transportation", amount: 45000.00, type: "withdrawal" },
  { id: 70, date: "27/03/2026", description: "Transportation Stipend", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Transportation", amount: 30026.88, type: "withdrawal" },
  { id: 71, date: "27/03/2026", description: "INEC Official Stipend", beneficiary: "MONDAY SARKI", category: "INEC Liaison", amount: 20026.88, type: "withdrawal" },
  { id: 72, date: "27/03/2026", description: "Bulk Payment – Volunteers", beneficiary: "PRAISE CHIDUMEBI IBE", category: "Volunteer", amount: 330053.75, type: "withdrawal" },
  { id: 73, date: "29/03/2026", description: "Transportation to Yiaga", beneficiary: "MONDAY PETER", category: "Transportation", amount: 15000.00, type: "withdrawal" },
  { id: 74, date: "29/03/2026", description: "Part Payment for Website", beneficiary: "TOYEEBAHT ODUNAYO AREM", category: "Digital/Comms", amount: 30026.88, type: "withdrawal" },
  { id: 75, date: "29/03/2026", description: "February Team Stipend", beneficiary: "ORITSEMATOSANGBONE BEL", category: "Team Stipend", amount: 50026.88, type: "withdrawal" },
  { id: 76, date: "29/03/2026", description: "February Team Stipend", beneficiary: "MFREKEMFON BASSEY BASS", category: "Team Stipend", amount: 50026.88, type: "withdrawal" },
  { id: 77, date: "29/03/2026", description: "February Team Stipend", beneficiary: "MUHAMMED ROFIAT OYINE", category: "Team Stipend", amount: 50026.88, type: "withdrawal" },
  { id: 78, date: "29/03/2026", description: "February Team Stipend", beneficiary: "IBE, CHIDUMEBI PRAISE", category: "Team Stipend", amount: 50026.88, type: "withdrawal" },
  { id: 79, date: "29/03/2026", description: "February Team Stipend", beneficiary: "MONDAY PETER", category: "Team Stipend", amount: 50000.00, type: "withdrawal" },
  { id: 80, date: "31/03/2026", description: "Transportation Stipend", beneficiary: "RUKAYAT AKANKE AYINLA", category: "Transportation", amount: 15026.88, type: "withdrawal" },
  { id: 81, date: "31/03/2026", description: "Transportation Stipend", beneficiary: "MONDAY PETER", category: "Transportation", amount: 15000.00, type: "withdrawal" },
  { id: 82, date: "31/03/2026", description: "Printing of NYSC Posting Letter", beneficiary: "MONDAY PETER", category: "Logistics", amount: 7000.00, type: "withdrawal" },
];

const categories = ["All", "Grant Inflow", "Team Stipend", "Transportation", "Media/Production", "Digital/Comms", "Branding/Merch", "Design", "Event", "Volunteer", "Logistics", "INEC Liaison"];

const fmt = (n) => "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const receiptNum = (id) => `IVFC-2025/26-${String(id).padStart(3, "0")}`;

const categoryColor = {
  "Grant Inflow": "#1D9E75",
  "Team Stipend": "#7F77DD",
  "Transportation": "#BA7517",
  "Media/Production": "#185FA5",
  "Digital/Comms": "#0F6E56",
  "Branding/Merch": "#D85A30",
  "Design": "#993556",
  "Event": "#3B6D11",
  "Volunteer": "#5F5E5A",
  "Logistics": "#888780",
  "INEC Liaison": "#993C1D",
};

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const printRef = useRef();

  const filtered = transactions.filter(t => {
    const matchCat = category === "All" || t.category === category;
    const q = search.toLowerCase();
    const matchQ = !q || t.description.toLowerCase().includes(q) || t.beneficiary.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Receipt – ${receiptNum(selected.id)}</title>
    <style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:auto}
    .header{border-bottom:2px solid #1D9E75;padding-bottom:16px;margin-bottom:24px}
    .logo{font-size:22px;font-weight:700;color:#1D9E75}
    .sub{font-size:12px;color:#888;margin-top:2px}
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#E1F5EE;color:#0F6E56;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}
    tr td{padding:10px 0;border-bottom:1px solid #eee;font-size:14px}
    tr td:last-child{text-align:right;font-weight:500}
    .amount{font-size:26px;font-weight:700;color:#1D9E75;text-align:right;margin:16px 0}
    .footer{margin-top:32px;font-size:11px;color:#aaa;border-top:1px solid #eee;padding-top:16px}
    @media print{button{display:none}}</style></head><body>
    <div class="header">
      <div class="logo">#ivoteFCT Campaign</div>
      <div class="sub">LockeinGenz / Yiaga Africa Initiative Project 2</div>
      <div class="sub">Account: BELLO-MOMODU MONIQUE AND IBE PRAISE | UBA – 2386032460</div>
    </div>
    <div class="badge">${selected.category}</div>
    <h2 style="margin:0 0 4px;font-size:16px">${selected.description}</h2>
    <div style="font-size:12px;color:#888;margin-bottom:20px">Receipt No: ${receiptNum(selected.id)}</div>
    <table>
      <tr><td style="color:#888">Beneficiary</td><td>${selected.beneficiary}</td></tr>
      <tr><td style="color:#888">Transaction Date</td><td>${selected.date}</td></tr>
      <tr><td style="color:#888">Transaction Type</td><td>${selected.type === "deposit" ? "Inflow / Deposit" : "Outflow / Withdrawal"}</td></tr>
      <tr><td style="color:#888">Category</td><td>${selected.category}</td></tr>
      <tr><td style="color:#888">Campaign</td><td>#ivoteFCT – FCT Election Monitoring</td></tr>
      <tr><td style="color:#888">Funder</td><td>Yiaga Africa Initiative Project 2</td></tr>
    </table>
    <div class="amount">${fmt(selected.amount)}</div>
    <div class="footer">
      Generated on ${new Date().toLocaleDateString("en-NG", { dateStyle: "long" })} · 
      This receipt is for internal accountability purposes only · 
      LockeinGenz – #ivoteFCT Campaign 2025/26
    </div>
    </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div style={{ padding: "1rem 0", fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>
      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            ← Back to transactions
          </button>
          <div ref={printRef} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.5rem", maxWidth: 560 }}>
            <div style={{ borderBottom: "2px solid #1D9E75", paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#1D9E75" }}>#ivoteFCT Campaign</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>LockeinGenz / Yiaga Africa Initiative Project 2</div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>UBA Acct: BELLO-MOMODU MONIQUE AND IBE PRAISE · 2386032460</div>
            </div>
            <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#E1F5EE", color: "#0F6E56", marginBottom: 14 }}>
              {selected.category}
            </div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{selected.description}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 20 }}>Receipt No: {receiptNum(selected.id)}</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              {[
                ["Beneficiary", selected.beneficiary],
                ["Transaction Date", selected.date],
                ["Type", selected.type === "deposit" ? "Inflow / Deposit" : "Outflow / Withdrawal"],
                ["Category", selected.category],
                ["Campaign", "#ivoteFCT – FCT Election Monitoring"],
                ["Funder", "Yiaga Africa Initiative Project 2"],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td style={{ color: "var(--color-text-secondary)", padding: "9px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{label}</td>
                  <td style={{ textAlign: "right", fontWeight: 500, padding: "9px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{val}</td>
                </tr>
              ))}
            </table>
            <div style={{ fontSize: 26, fontWeight: 500, color: selected.type === "deposit" ? "#1D9E75" : "var(--color-text-primary)", textAlign: "right", margin: "16px 0 4px" }}>
              {selected.type === "deposit" ? "+" : "−"}{fmt(selected.amount)}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 14, marginTop: 14 }}>
              Generated {new Date().toLocaleDateString("en-NG", { dateStyle: "long" })} · Internal accountability receipt · LockeinGenz #ivoteFCT 2025/26
            </div>
          </div>
          <button onClick={handlePrint} style={{ marginTop: 16, padding: "10px 20px", fontSize: 13, fontWeight: 500, background: "#1D9E75", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>
            Print / Save as PDF
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 500 }}>#ivoteFCT Receipt Generator</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>LockeinGenz · Yiaga Africa Initiative Project 2 · Dec 2025 – Apr 2026</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginBottom: 20 }}>
            {[
              ["Total Inflow", "₦4,000,000.00", "#1D9E75"],
              ["Total Outflow", "₦" + transactions.filter(t => t.type === "withdrawal").reduce((a, t) => a + t.amount, 0).toLocaleString("en-NG", { minimumFractionDigits: 2 }), "var(--color-text-primary)"],
              ["Transactions", transactions.length, "var(--color-text-primary)"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 500, color }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <input
              placeholder="Search description or beneficiary..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 180, fontSize: 13 }}
            />
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ fontSize: 13 }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10 }}>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filtered.map(t => (
              <div
                key={t.id}
                onClick={() => setSelected(t)}
                style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: categoryColor[t.category] || "#888", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{t.date} · {t.beneficiary} · <span style={{ color: categoryColor[t.category] }}>{t.category}</span></div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, flexShrink: 0, color: t.type === "deposit" ? "#1D9E75" : "var(--color-text-primary)" }}>
                  {t.type === "deposit" ? "+" : "−"}{fmt(t.amount)}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0 }}>View →</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

