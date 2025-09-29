const QA = [
  { q: "How many questions?", a: "Six: 2 Easy, 2 Medium, 2 Hard (20s/60s/120s)." },
  { q: "Can I pause and resume?", a: "Yes. We restore your session with a Welcome Back modal." },
  { q: "How are answers graded?", a: "Deterministic rubric (0–4 anchors) weighted to a 10." },
];
export default function FAQ() {
  return (
    <section id="faq" className="section">
      <h2 className="display-sm">FAQ</h2>
      <div className="faq">
        {QA.map((x, i) => (
          <details key={i} className="faq-item">
            <summary>{x.q}</summary>
            <p className="muted">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
