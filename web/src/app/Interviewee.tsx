import { useState } from "react";
import { readResumeText } from "../lib/resume";
import { extractSkills } from "../lib/topicextract";
import { generateQuestions, type Q } from "../lib/questions";
import "./Interviewer.css";

export default function Interviewee() {
  const [meta, setMeta] = useState({ name:"", email:"", phone:"" });
  const [skills, setSkills] = useState<string[]>([]);
  const [qs, setQs] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");

  async function onResume(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await readResumeText(f);
    const found = extractSkills(text);
    setSkills(found);
    const six = generateQuestions(found);
    setQs(six);
    setIdx(0);
  }

  const current = qs[idx];

  function submitAnswer() {
    if (!answer.trim()) return;
    // TODO: save this answer; later send to grader
    setAnswer("");
    setIdx(i => Math.min(i+1, (qs.length||1)-1));
  }

  return (
    <div className="container grid grid-3">
      {/* LEFT: Resume / identity */}
      <section className="card">
        <h2 className="h2">Your Profile</h2>
        <input className="input" type="file" accept=".pdf,.doc,.docx,.txt" onChange={onResume} />
        <div style={{ height:8 }} />
        <input className="input" placeholder="Full name" value={meta.name} onChange={e=>setMeta({...meta,name:e.target.value})}/>
        <input className="input" placeholder="Email" value={meta.email} onChange={e=>setMeta({...meta,email:e.target.value})}/>
        <input className="input" placeholder="Phone" value={meta.phone} onChange={e=>setMeta({...meta,phone:e.target.value})}/>
        <div style={{ marginTop:8, color:"#9aa0a6" }}>Detected skills: {skills.length? skills.join(", "): "—"}</div>
      </section>

      {/* MIDDLE: Dynamic Q&A */}
      <section className="card" style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent:"space-between", marginBottom:10 }}>
          <div className="pill">Question {qs.length ? idx+1 : 0} / {qs.length || 0}</div>
          {current && <div className="pill">{current.topic} • {current.diff}</div>}
        </div>

        {current ? (
          <>
            <div className="bubble ai">{current.text}</div>
            <div className="footer">
              <textarea className="input" rows={4} placeholder="Type your answer…" value={answer} onChange={e=>setAnswer(e.target.value)} />
              <button className="btn primary" onClick={submitAnswer}>Submit</button>
            </div>
          </>
        ) : (
          <div className="muted">Upload your resume to generate tailored questions.</div>
        )}
      </section>

      {/* RIGHT: Summary */}
      <aside className="card">
        <h2 className="h2">Session Summary</h2>
        <div className="row"><span className="badge">Total</span><span className="muted">{qs.length || 0} questions</span></div>
        <div className="row"><span className="badge">Progress</span><span className="muted">{idx+ (qs.length?1:0)}/{qs.length||0}</span></div>
      </aside>
    </div>
  );
}
