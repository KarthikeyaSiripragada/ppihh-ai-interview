import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";  // <-- add useEffect
import { useAppStore } from "../store/useAppstore";
import { getDomain, isAllowedInterviewer } from "../lib/email";

export default function Landing() {
  const nav = useNavigate();
  const setUser = useAppStore(s => s.setUser);

  const [tab, setTab] = useState<"candidate" | "interviewer">("candidate");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [mounted, setMounted] = useState(false);     // <-- new

  useEffect(() => {
    // flip to mounted on next frame for a micro fade-in (no jump)
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const submit = () => {
    if (!email.includes("@")) return setErr("Enter a valid email.");
    if (tab === "interviewer" && !isAllowedInterviewer(email)) {
      return setErr("Use your company email.");
    }
    setUser({ email, role: tab, verified: tab === "interviewer" ? true : !!getDomain(email) });
    nav(tab === "candidate" ? "/interview" : "/dashboard");
  };

  return (
    <>
      {/* Add 'mounted' class here */}
      <div
        className={`m-hero ${mounted ? "mounted" : ""}`}
        style={{
          position: "fixed",
          inset: 0,
          display: "grid",
          placeItems: "center",
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("/bg-hero.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="m-card">
          {showLogo ? (
            <img
              src="/logo.png"
              alt="PPIH"
              style={{ width: 48, height: "auto", display: "block", marginBottom: 6 }}
              onError={() => setShowLogo(false)}
            />
          ) : (
            <div className="m-badge">PPIH</div>
          )}

          <h1 className="m-title">Ace interviews with an AI co-pilot.</h1>
          <p className="m-sub">Upload resume → timed 6Q → fair AI scoring → clean dashboard.</p>

         <div className="m-tabs">
  <button
    className={`m-tab-box ${tab === "candidate" ? "active" : ""}`}
    onClick={() => { setTab("candidate"); setErr(null); }}
  >
    Candidate
  </button>
  <button
    className={`m-tab-box ${tab === "interviewer" ? "active" : ""}`}
    onClick={() => { setTab("interviewer"); setErr(null); }}
  >
    Interviewer
  </button>
</div>
          <input
            className="m-input"
            placeholder={tab === "interviewer" ? "you@company.com" : "you@gmail.com"}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErr(null); }}
          />
          {err && <div className="m-err">{err}</div>}

          <button className="m-btn" onClick={submit}>
            {tab === "candidate" ? "Start Practice" : "Open Dashboard"}
          </button>

          <div className="m-feats">
            <div>📄 Resume autofill</div>
            <div>⏱️ 6 Qs + auto-submit</div>
            <div>🧠 Rubric scoring</div>
          </div>
        </div>
      </div>
    </>
  );
}
