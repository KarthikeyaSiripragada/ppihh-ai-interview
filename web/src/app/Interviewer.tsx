import { useState } from "react";

// Per your request, this is a React component.
// NOTE: The 'zustand' library would need to be installed in a real project environment.
// For this single-file example, we'll simulate the Zustand store hook.
const mockStoreState = {
  user: { email: 'session-user@example.com' }, // Mock user for demonstration
};
const useAppStore = (selector: (state: typeof mockStoreState) => any) => selector(mockStoreState);

const LS_KEY = "ppihh-email";

// Component to inject all the necessary CSS for styling the dashboard
const DashboardStyles = () => (
  <style>{`
    /* ========= Custom Scrollbar ========= */
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, .05);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, .15);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, .25);
    }

    /* ========= Page & Topbar ========= */
    body { margin: 0; }
    .page {
        min-height: 100vh;
        background: radial-gradient(1200px 600px at 20% -10%, #0e1a26 0%, #0b0f14 55%, #090b0f 100%);
        color: #eef1f5;
        font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
        overflow: hidden; /* Prevents the main page body from scrolling */
    }

/* topbar: allow flexible height instead of forcing a tiny fixed height */
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;            /* slightly reduced padding */
  min-height: 48px;             /* use min-height instead of fixed height */
  border-bottom: 1px solid rgba(255,255,255,.06);
  background: rgba(10,12,16,.7);
  backdrop-filter: blur(10px);
}

/* actions: ensure vertical centering and spacing */
.actions {
  display: flex;
  gap: 10px;
  align-items: center;          /* make sure chips and button align center */
}

/* keep chip style */
.chip {
  padding: 6px 10px;
  border-radius: 999px;
  background: #121722;
  border: 1px solid rgba(255,255,255,.08);
  font-size: .85rem;
  color: #b7c0cc;
  display: inline-flex;
  align-items: center;
  height: 30px;                 /* fix chip height for consistent alignment */
}
/* Make logout button exactly match .chip sizing */
.logout-chip {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1;
  height: 44px;                /* match chip height */
  min-width: 100px;            /* match chip width if needed */
  background: #ef4444;
  border: 1px solid #ef4444;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.12s ease;
}
.logout-chip:hover {
  background: #dc2626;
  transform: translateY(-1px);
}


/* keep .btn generic rules but don't let them override logout-chip height */
.btn { min-height: 30px; }

    .brand { display:flex; gap:10px; align-items:center; font-weight: 700; letter-spacing:.2px; }

    /* ========= Canvas (SCROLLABLE & STACKED) ========= */
    .canvas {
        max-width: 1000px;
        margin: 0 auto;
        padding: 28px 24px;
        display: flex;
        flex-direction: column; /* This stacks the cards vertically */
        gap: 24px;
        align-items: stretch;
        height: calc(100vh - 75px); /* Full viewport height minus the topbar */
        overflow-y: auto; /* This enables vertical scrolling for the canvas */
    }

    /* ========= Card (BIGGER) ========= */
    .card {
        width: 100%;
        box-sizing: border-box;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04));
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 8px 30px rgba(0,0,0,.35);
        backdrop-filter: blur(12px);
        transition: transform .18s ease, box-shadow .18s ease;
        flex-shrink: 0;
    }
    .card:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,.45); }

    .card h2 {
        font-size: 1.1rem;
        font-weight: 700;
        color:#e8eef6;
        margin: 0 0 14px;
        display:flex; align-items:center; gap:8px;
    }
    .card h2 .dot { width:8px; height:8px; background:#60a5fa; border-radius:50%; box-shadow:0 0 10px #3b82f6; }

    .card.live {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    /* ========= Inputs & Textareas ========= */
    .input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 14px;
        margin-top: 6px;
        border-radius: 8px;
        background: rgba(0,0,0,0.45);
        border: 1px solid rgba(255,255,255,0.12);
        color: #f2f2f2;
        font-family: Inter, sans-serif;
        font-size: 0.95rem;
    }

    .textarea {
        width: 100%;
        box-sizing: border-box;
        min-height: 180px;
        margin: 0;
        padding: 14px;
        border-radius: 10px;
        background: rgba(0,0,0,0.45);
        border: 1px solid rgba(255,255,255,0.12);
        color: #f2f2f2;
        font-family: monospace;
        font-size: 0.95rem;
        resize: vertical;
    }

    /* action row: left/right buttons */
    .btn-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }
    .btn-left, .btn-right { display: flex; gap: 10px; }

    /* ========= Buttons ========= */
    .btn {
        border:0;
        padding:10px 16px;
        border-radius:10px;
        font-weight:700;
        cursor:pointer;
        transition: .18s ease;
        background:#1b2330; color:#e8eef6;
        border:1px solid rgba(255,255,255,.10);
    }
    .btn:hover { transform: translateY(-1px); }
    .btn.primary { background:#3b82f6; border-color:#3b82f6; color:white; }
    .btn.primary:hover { filter:brightness(1.05); }
    .btn.danger  { background:#ef4444; border-color:#ef4444; color:white; }
    .btn.ghost   { background:transparent; }
      /* Make danger button in topbar look like a chip */
        .topbar .btn.danger {
          padding: 6px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1;
          height: 30px;
          background: #ef4444;
          border: 1px solid #ef4444;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.18s ease, transform 0.12s ease;
        }

            .topbar .btn.danger:hover {
              background: #dc2626;            /* slightly darker red */
              transform: translateY(-1px);
            }

    /* ========= Live Question ========= */
    .question {
        background:#0d1420;
        border:1px solid rgba(99,102,241,.25);
        color:#dbe6ff;
        padding:14px 16px;
        border-radius:10px;
        font-weight:600;
        box-shadow: inset 0 0 0 1px rgba(99,102,241,.08);
    }

    /* ========= Evaluation (progress bars) ========= */
    .metric { margin:10px 0 14px; }
    .metric .row {
        display:flex; justify-content:space-between;
        font-size:.9rem; color:#c6d0dd; margin-bottom:6px;
    }
    .bar { height:10px; border-radius:999px; background:rgba(255,255,255,.08); overflow:hidden; }
    .fill { height:100%; border-radius:999px; background:linear-gradient(90deg,#5eead4,#22d3ee); }
    .fill.yellow { background:linear-gradient(90deg,#fde047,#f59e0b); }
    .fill.blue   { background:linear-gradient(90deg,#93c5fd,#3b82f6); }
    .fill.purple { background:linear-gradient(90deg,#c084fc,#a855f7); }

    /* ========= Utility ========= */
    .row { display:flex; gap:10px; align-items:center; }
  `}
  </style>
);

export default function InterviewerDashboard() {
  const user = useAppStore((s: typeof mockStoreState) => s.user);
  const [email, setEmail] = useState(() => user?.email ?? localStorage.getItem(LS_KEY) ?? "");
  const saveEmail = (v: string) => { setEmail(v); try { localStorage.setItem(LS_KEY, v); } catch {} };

  const evals = [
    { label: "Correctness", pct: 80, cls: "" },
    { label: "Efficiency", pct: 70, cls: "yellow" },
    { label: "Clarity", pct: 85, cls: "blue" },
    { label: "Problem-Solving", pct: 90, cls: "purple" },
  ];

  return (
    <div className="page">
      <DashboardStyles />
<div className="topbar">
  <div className="brand">
    <span className="dot" /> PPIH — Interviewer Dashboard
  </div>
  <div className="actions">
    <span className="chip">Session: LIVE</span>

    {/* 🚀 Logout styled like a chip */}
    <button
      className="chip logout-chip"
      onClick={() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login"; // change to your login route
      }}
    >
      Logout
    </button>

    <span className="chip">6 Qs • 200's</span>
  </div>
</div>

      <main className="canvas">
        {/* Card 1: Live Question */}
        <section className="card live">
            <h2>💬 Live Question</h2>
            <div className="question">👉 Implement a function to reverse a linked list.</div>
            <textarea
                className="textarea"
                placeholder="Candidate’s answer will stream here or paste notes..."
            />
            <div className="btn-row">
                <div className="btn-left">
                    <button className="btn">Pause</button>
                    <button className="btn danger">End Interview</button>
                </div>
                <div className="btn-right">
                    <button className="btn">Prev</button>
                    <button className="btn primary">Next</button>
                </div>
            </div>
        </section>

        {/* Card 2: Candidate */}
        <section className="card">
            <h2><span className="dot" /> Candidate</h2>
            <label style={{fontSize:".85rem", color:"#aab4c2"}}>Email</label>
            <input
                className="input"
                type="email"
                placeholder="candidate@company.com"
                value={email}
                onChange={(e)=>saveEmail(e.target.value)}
            />
            <div style={{display:"flex", gap:10, marginTop:12}}>
                <button className="btn primary">Save</button>
                <button className="btn danger" onClick={()=>{ localStorage.removeItem(LS_KEY); setEmail(""); }}>Clear</button>
                <button className="btn ghost">View Resume</button>
            </div>
            <div style={{marginTop:12, fontSize:".85rem", color:"#8fa0b3"}}>Prefilled from {user?.email ? "session" : "local storage"}.</div>
        </section>

        {/* Card 3: AI Evaluation */}
        <aside className="card">
            <h2><span className="dot" /> AI Evaluation</h2>
            {evals.map(m => (
                <div key={m.label} className="metric">
                    <div className="row"><span>{m.label}</span><span>{m.pct}%</span></div>
                    <div className="bar"><div className={`fill ${m.cls}`} style={{width: `${m.pct}%`}}/></div>
                </div>
            ))}
            <div style={{marginTop:14, display:"flex", gap:10}}>
                <button className="btn ghost">Transcript</button>
                <button className="btn ghost">Summary</button>
                <button className="btn primary" style={{marginLeft:"auto"}}>Export</button>
            </div>
        </aside>
      </main>
    </div>
  );
}

