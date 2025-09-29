import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppstore";
import { getDomain, isAllowedInterviewer } from "../lib/email";
import "../index.css";

export default function Landing() {
  const nav = useNavigate();
  const setUser = useAppStore((s: any) => s.setUser);

  const [tab, setTab] = useState<"candidate" | "interviewer">("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ---------- Mock sign-in without Supabase (temporary local flow) ----------
  // This is purely client-side and intended for local dev / prototyping only.
  // It does NOT provide real authentication — replace with your real auth later.
  const mockSignInWithGoogle = async () => {
    setErr(null);
    setStatus(null);
    setLoading(true);

    try {
      // Simulate redirect/auth delay
      await new Promise((r) => setTimeout(r, 700));

      // Provide a fake user object and navigate based on tab
      const fakeEmail = email || (tab === "interviewer" ? "you@company.com" : "you@gmail.com");
      setUser({
        email: fakeEmail,
        role: tab,
        verified: !!getDomain(fakeEmail),
      });

      setStatus("Signed in (mock). Redirecting...");
      setTimeout(() => {
        if (tab === "interviewer") nav("/dashboard");
        else nav("/interview");
      }, 400);
    } catch (e: any) {
      setErr(e?.message ?? "Mock Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const mockEmailSignUp = async () => {
    setErr(null);
    setStatus(null);

    if (!email || !email.includes("@")) {
      return setErr("Enter a valid email address.");
    }

    if (!password || password.length < 6) {
      return setErr("Password must be at least 6 characters.");
    }

    if (!acceptedTerms) {
      return setErr("You must accept the terms and conditions.");
    }

    if (tab === "interviewer" && !isAllowedInterviewer(email)) {
      return setErr("Please use your company email for interviewer access.");
    }

    setLoading(true);
    try {
      // Simulate server processing
      await new Promise((r) => setTimeout(r, 700));

      // Locally register user in app store (mock)
      setUser({
        email,
        role: tab,
        verified: !!getDomain(email),
      });

      setStatus(tab === "candidate" ? "Account created. Redirecting..." : "Interviewer account created (mock). Redirecting...");

      setTimeout(() => {
        if (tab === "candidate") nav("/interview");
        else nav("/dashboard");
      }, 400);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to create account (mock).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          borderRadius: "8px",
          padding: "32px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1a202c",
              marginBottom: "8px",
            }}
          >
            PPIH Interviews
          </h1>
          <p style={{ color: "#718096", fontSize: "14px" }}>
            {tab === "candidate" ? "Practice and ace your interviews" : "Access interviewer dashboard"}
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "#f7fafc",
            borderRadius: "6px",
            padding: "4px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => {
              setTab("candidate");
              setErr(null);
              setStatus(null);
            }}
            style={{
              flex: 1,
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              background: tab === "candidate" ? "white" : "transparent",
              color: tab === "candidate" ? "#1a202c" : "#718096",
              fontWeight: "500",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: tab === "candidate" ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
            }}
          >
            Candidate
          </button>
          <button
            onClick={() => {
              setTab("interviewer");
              setErr(null);
              setStatus(null);
            }}
            style={{
              flex: 1,
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              background: tab === "interviewer" ? "white" : "transparent",
              color: tab === "interviewer" ? "#1a202c" : "#718096",
              fontWeight: "500",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: tab === "interviewer" ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
            }}
          >
            Interviewer
          </button>
        </div>

        {/* Google Sign In (mock) */}
        <button
          onClick={mockSignInWithGoogle}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: "white",
            color: "#374151",
            fontWeight: "500",
            fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "24px",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google (mock)
        </button>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          <div style={{ padding: "0 12px", color: "#718096", fontSize: "14px", fontWeight: "500" }}>Or continue with email</div>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        </div>

        {/* Email Form */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={tab === "interviewer" ? "company@email.com" : "your@email.com"}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Terms Checkbox */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", color: "#374151", cursor: "pointer" }}>
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={{ marginTop: "2px" }} />
            <span>
              I agree to the <a href="/terms" style={{ color: "#2563eb" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "#2563eb" }}>Privacy Policy</a>
            </span>
          </label>
        </div>

        {/* Status / Error */}
        {err && (
          <div style={{ padding: "12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>
            {err}
          </div>
        )}
        {status && (
          <div style={{ padding: "12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", color: "#1e3a8a", fontSize: "14px", marginBottom: "16px" }}>
            {status}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={mockEmailSignUp}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "500",
            fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            marginBottom: "16px",
          }}
        >
          {loading ? "Processing..." : tab === "candidate" ? "Start Practicing" : "Create Account"}
        </button>

        {/* Login Link */}
        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#718096", fontSize: "14px" }}>
            Already have an account?{" "}
            <button
              onClick={() => nav("/login")}
              style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}
            >
              Sign in
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
