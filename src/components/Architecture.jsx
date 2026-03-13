// Section 02 — Architecture: pipeline + features grid

import { forwardRef } from "react";

const PIPELINE_STAGES = [
  {
    n: "01", name: "Lexer",
    desc: "Tokenizes Python source into keywords, identifiers, operators, and literals with full INDENT/DEDENT handling.",
    tag: "Source → Tokens",
  },
  {
    n: "02", name: "Parser",
    desc: "Recursive descent parser builds a typed Abstract Syntax Tree from the token stream using context-free grammar.",
    tag: "Tokens → AST",
  },
  {
    n: "03", name: "Analyzer",
    desc: "Validates types, resolves variable scopes, and enforces IoT safety constraints like no dynamic allocation.",
    tag: "AST → Typed AST",
  },
  {
    n: "04", name: "Optimizer",
    desc: "Applies constant folding, dead code elimination, and loop unrolling passes optimized for MCU constraints.",
    tag: "Typed → Opt AST",
  },
  {
    n: "05", name: "Generator",
    desc: "Traverses the optimized AST and emits clean, readable, target-specific Embedded C with proper headers.",
    tag: "Opt AST → C",
  },
];

const FEATURES = [
  { icon: "🧠", name: "Static Type System",    desc: "int, float, bool checked at compile time — zero runtime surprises on 8-bit MCUs." },
  { icon: "🗑️", name: "Dead Code Elimination", desc: "Unused variables and unreachable branches stripped to save precious flash memory." },
  { icon: "🔁", name: "Loop Unrolling",         desc: "Small loops expanded inline for faster execution without stack overhead." },
  { icon: "📦", name: "Zero Dynamic Memory",    desc: "No malloc or free — fully safe for bare-metal microcontrollers without an OS." },
  { icon: "🔌", name: "GPIO Builtins",          desc: "digitalWrite, analogRead, tone, pulseIn map directly to target hardware calls." },
  { icon: "🛡️", name: "IoT Validator",          desc: "Blocks Python constructs that are illegal or unsafe on embedded targets." },
];

const Architecture = forwardRef(function Architecture(_props, ref) {
  return (
    <section className="section section-alt" ref={ref}>
      <div className="sec-n fade-up">02</div>
      <div className="fade-up d1">
        <h2 className="sec-title">The Compilation Pipeline</h2>
        <p className="sec-sub">
          Five deliberate stages, each with a single responsibility. No shortcuts.
        </p>
      </div>

      {/* Pipeline steps */}
      <div className="pipeline">
        {PIPELINE_STAGES.map((s, i) => (
          <div className={`pcrd fade-up d${i + 1}`} key={s.n}>
            <span className="pn">{s.n}</span>
            <div className="pdot" />
            <div className="pname">{s.name}</div>
            <div className="pdesc">{s.desc}</div>
            <span className="ptag">{s.tag}</span>
          </div>
        ))}
      </div>

      {/* Features grid */}
      <div style={{ marginTop: "3rem" }}>
        <h3 className="sec-title fade-up" style={{ fontSize: "clamp(1.3rem, 2.8vw, 2rem)" }}>
          Designed for Constrained Environments
        </h3>
        <div className="features fade-up d1">
          {FEATURES.map(f => (
            <div className="feat" key={f.name}>
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-name">{f.name}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Architecture;
