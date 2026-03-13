// Section 05 — Author / About the builder

export default function Author() {
  return (
    <section className="section">
      <div className="sec-n fade-up">05</div>

      <div className="author-grid fade-up d1">
        <div className="av">👨‍💻</div>

        <div>
          <div className="av-name">The Builder</div>
          <div className="av-role">Computer Science — Compiler Research</div>
          <p className="av-bio">
            Specializing in compiler design and embedded systems. PyEmbed is
            original research into making IoT programming more accessible through
            principled language translation and hardware-aware optimization.
          </p>
          <div className="av-links">
            {["GitHub ↗", "LinkedIn ↗", "Email →"].map(l => (
              <a href="#" className="av-link" key={l}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
