import { useState } from "react";
import "./Interviewer.css";
import { useAppStore } from "../store/useAppstore";

const LS_KEY = "ppihh-email";

export default function Interviewer() {
  const user = useAppStore(s => s.user);
  const [email, setEmail] = useState<string>(() => user?.email ?? localStorage.getItem(LS_KEY) ?? "");
  const saveEmail = (v: string) => { setEmail(v); try { localStorage.setItem(LS_KEY, v); } catch {} };

  const evals = [
    { label: "Correctness", pct: 80, cls: "" },
    { label: "Efficiency", pct: 70, cls: "yellow" },
    { label: "Clarity", pct: 85, cls: "blue" },
    { label: "Problem-Solving", pct: 90, cls: "purple" },
  ];

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand"><span className="dot" /> PPIH — Interviewer Dashboard</div>
        <div className="actions">
          <span className="chip">Session: LIVE</span>
          <span className="chip">6 Qs • 25 min</span>
        </div>
      </div>

      <div className="canvas">
        {/* LEFT: Candidate */}
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

        {/* CENTER: Live Question */}
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


        {/* RIGHT: AI Evaluation */}
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
      </div>
    </div>
  );
}
