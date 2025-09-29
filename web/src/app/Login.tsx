import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppstore";
import { getDomain, isAllowedInterviewer } from "../lib/email";
import { supabase } from "../lib/supabase"; 
export default function Landing() {
  const nav = useNavigate();
  const setUser = useAppStore((s) => s.setUser);

  const [tab, setTab] = useState<"candidate" | "interviewer">("candidate");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // flip to mounted on next frame for a micro fade-in (no jump)
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const submit = async () => {
    setErr(null);
    setStatus(null);

    if (!email || !email.includes("@")) return setErr("Enter a valid email.");

    if (tab === "interviewer") {
      // enforce company email if required
      if (!isAllowedInterviewer(email)) {
        return setErr("Use your company email.");
      }

      // Send magic link via Supabase
      try {
        setLoading(true);
        const redirectTo = `${window.location.origin}/dashboard`; // change if necessary
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirectTo },
        });
        setLoading(false);

        if (error) {
          setErr(error.message || "Failed to send magic link.");
        } else {
          // optional: save pending interviewer email so you can show/fill after redirect
          try {
            localStorage.setItem("ppihh_pending_interviewer", email);
          } catch {}
          setStatus(`Magic link sent to ${email}. Check your inbox.`);
        }
      } catch (e: any) {
        setLoading(false);
        setErr(e?.message ?? "Unexpected error");
      }

      return;
    }

    // Candidate flow: local instant entry
    setUser({
      email,
      role: "candidate",
      verified: !!getDomain(email),
    });
    nav("/interview");
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
              style={{ width: 100, height: "auto", display: "block", marginBottom: 6 }}
              onError={() => setShowLogo(false)}
            />
          ) : (
            <div className="m-badge">PPIH</div>
          )}

          <h1 className="m-title">Ace interviews with an AI co-pilot.</h1>
          <p className="m-sub">Upload resume → timed 6Q → fair AI scoring → clean dashboard.</p>

          <div className="m-tabs" style={{ marginBottom: 12 }}>
            <button
              className={`m-tab-box ${tab === "candidate" ? "active" : ""}`}
              onClick={() => {
                setTab("candidate");
                setErr(null);
                setStatus(null);
              }}
            >
              Candidate
            </button>
            <button
              className={`m-tab-box ${tab === "interviewer" ? "active" : ""}`}
              onClick={() => {
                setTab("interviewer");
                setErr(null);
                setStatus(null);
              }}
            >
              Interviewer
            </button>
          </div>

          <input
            className="m-input"
            placeholder={tab === "interviewer" ? "you@company.com" : "you@gmail.com"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr(null);
              setStatus(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
          {err && <div className="m-err" role="alert">{err}</div>}
          {status && <div className="m-status" style={{ color: "#bfe4c9", marginTop: 8 }}>{status}</div>}

          <button className="m-btn" onClick={submit} disabled={loading} style={{ marginTop: 12 }}>
            {loading ? (tab === "interviewer" ? "Sending..." : "Processing...") : (tab === "candidate" ? "Start Practice" : "Send Magic Link")}
          </button>

          <div className="m-feats" style={{ marginTop: 14 }}>
            <div>📄 Resume autofill</div>
            <div>⏱️ 6 Qs + auto-submit</div>
            <div>🧠 Rubric scoring</div>
          </div>
        </div>
      </div>
    </>
  );
}
