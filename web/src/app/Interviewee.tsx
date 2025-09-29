import { useState } from "react";
import { readResumeText } from "../lib/resume";
import { extractSkills } from "../lib/topicextract";
import { generateQuestions, type Q } from "../lib/questions";
import "./Interviewer.css";

export default function Interviewee() {
  const [meta, setMeta] = useState({ name: "", email: "", phone: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [qs, setQs] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onResume(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const text = await readResumeText(f);
      const found = extractSkills(text || "");
      setSkills(found);
      const six = generateQuestions(found);
      setQs(six);
      setIdx(0);
      setStatus("✅ Resume processed — questions generated.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to read resume.");
    }
  }

  const current = qs[idx];

  async function submitAnswer() {
    if (!answer.trim() || !current) {
      setStatus("Please type an answer before submitting.");
      return;
    }
    setLoading(true);
    setStatus(null);

    try {
      // Simulate saving answer (replace with your preferred storage method)
      console.log("Answer data:", {
        email: meta.email || null,
        name: meta.name || null,
        phone: meta.phone || null,
        question_idx: idx,
        question_text: current.text,
        answer_text: answer,
        skills,
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus("✅ Answer saved locally.");
      setAnswer("");
      setIdx((i) => Math.min(i + 1, Math.max(qs.length - 1, 0)));
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="interviewee-root">
      <div className="interview-grid">
        {/* LEFT: Resume / identity */}
        <section className="card panel left">
          <h3 className="card-title">Your Profile</h3>

          <label className="file-label">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={onResume}
              className="file-input"
            />
            <span className="file-text">Choose resume…</span>
          </label>

          <input
            className="input"
            placeholder="Full name"
            value={meta.name}
            onChange={(e) => setMeta({ ...meta, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Email"
            value={meta.email}
            onChange={(e) => setMeta({ ...meta, email: e.target.value })}
          />
          <input
            className="input"
            placeholder="Phone"
            value={meta.phone}
            onChange={(e) => setMeta({ ...meta, phone: e.target.value })}
          />

          <div className="meta-row">
            <div className="muted">Detected skills</div>
            <div className="skills">
              {skills.length ? skills.map((s, i) => <span key={i} className="tag">{s}</span>) : <span className="muted">—</span>}
            </div>
          </div>
        </section>

        {/* MIDDLE: Dynamic Q&A */}
        <section className="card panel middle">
          <div className="q-header">
            <div className="pill">Question {qs.length ? idx + 1 : 0} / {qs.length || 0}</div>
            {current ? <div className="pill muted small">{current.topic} • {current.diff}</div> : null}
          </div>

          {current ? (
            <>
              <div className="bubble ai">{current.text}</div>

              <div className="answer-area">
                <textarea
                  className="textarea"
                  rows={6}
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <div className="actions-row">
                  <button className="btn ghost" onClick={() => setIdx(i => Math.max(i - 1, 0))} disabled={idx === 0}>Prev</button>
                  <div style={{display: "flex", gap: 8}}>
                    <button className="btn secondary" onClick={() => { setAnswer(""); setStatus(null); }}>Clear</button>
                    <button className="btn primary" onClick={submitAnswer} disabled={loading}>
                      {loading ? "Saving..." : "Submit"}
                    </button>
                  </div>
                </div>
                {status && <div className="status">{status}</div>}
              </div>
            </>
          ) : (
            <div className="empty-state">Upload your resume to generate tailored questions.</div>
          )}
        </section>

        {/* RIGHT: Summary */}
        <aside className="card panel right">
          <h3 className="card-title">Session Summary</h3>

          <div className="stat">
            <div className="stat-label">Total</div>
            <div className="stat-value">{qs.length || 0} questions</div>
          </div>

          <div className="stat">
            <div className="stat-label">Progress</div>
            <div className="stat-value">{qs.length ? `${Math.min(idx + 1, qs.length)}/${qs.length}` : "0/0"}</div>
          </div>

          <div className="summary-actions">
            <button className="btn ghost" onClick={() => { setQs([]); setIdx(0); setAnswer(""); setSkills([]); setStatus("Session reset."); }}>
              Reset
            </button>
            <button className="btn primary" onClick={() => setStatus("Export not implemented yet.")}>Export</button>
          </div>
        </aside>
      </div>
    </div>
  );
}