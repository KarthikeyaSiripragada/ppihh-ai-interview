export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <h2 className="display-sm">Pricing</h2>
      <div className="cards">
        <div className="card-price">
          <h3>Candidate — Free</h3>
          <ul><li>Mock interviews</li><li>AI summary</li><li>Export transcript</li></ul>
          <a className="btn primary" href="/interview">Start Practice</a>
        </div>
        <div className="card-price">
          <h3>Interviewer — Free</h3>
          <ul><li>Dashboard</li><li>Search & sort</li><li>Rubric breakdown</li></ul>
          <a className="btn" href="/dashboard">Open Dashboard</a>
        </div>
      </div>
      <p className="muted" style={{marginTop:12}}>This is an assignment demo; both tiers are free.</p>
    </section>
  );
}
