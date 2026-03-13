// Section 03 — Live Compiler Tool (IDE-style editor)

import { useState, useCallback, forwardRef } from "react";
import { compile }                           from "../compiler/compile.js";
import { TARGETS }                           from "../compiler/targets.js";
import { EXAMPLES, EXAMPLE_GROUPS }          from "../compiler/examples.js";
import { highlightC }                        from "../compiler/highlight.js";

const CompilerTool = forwardRef(function CompilerTool(_props, ref) {
  const [src,       setSrc]       = useState(EXAMPLES["Blink LED"]);
  const [target,    setTarget]    = useState("arduino");
  const [result,    setResult]    = useState(() => compile(EXAMPLES["Blink LED"], "arduino"));
  const [copied,    setCopied]    = useState(false);
  const [activeEx,  setActiveEx]  = useState("Blink LED");
  const [activeTab, setActiveTab] = useState("input");   // "input" | "output"

  // ── Compile ─────────────────────────────────
  const run = useCallback((tgt) => {
    setResult(compile(src, tgt || target));
    setActiveTab("output");
  }, [src, target]);

  const switchTarget = (tgt) => {
    setTarget(tgt);
    setResult(compile(src, tgt));
  };

  const loadExample = (name) => {
    setSrc(EXAMPLES[name]);
    setActiveEx(name);
    setResult(compile(EXAMPLES[name], target));
    setActiveTab("input");
  };

  const copyOutput = () => {
    if (result.output) {
      navigator.clipboard?.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // ── Keyboard shortcuts ────────────────────────
  const handleKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s  = e.target.selectionStart;
      const en = e.target.selectionEnd;
      const v  = src.substring(0, s) + "    " + src.substring(en);
      setSrc(v);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  };

  const { stats, error, warnings } = result;
  const T = TARGETS[target];

  return (
    <section className="compiler-section" ref={ref}>
      <div className="sec-n fade-up">03</div>
      <div className="fade-up d1">
        <h2 className="sec-title">Live Compiler</h2>
        <p className="sec-sub">
          Write Python below, pick your MCU target, hit Compile — and see the
          generated Embedded C instantly.
        </p>
      </div>

      <div className="compiler-wrap fade-up d2">

        {/* ── Top action bar ── */}
        <div className="c-topbar">
          <div className="c-logo">
            PyEmbed <span className="c-logo-badge">Compiler</span>
          </div>
          <div className="c-actions">
            <select
              className="c-select"
              value={activeEx}
              onChange={e => loadExample(e.target.value)}
            >
              {Object.entries(EXAMPLE_GROUPS).map(([grp, names]) => (
                <optgroup key={grp} label={`── ${grp}`}>
                  {names.map(k => <option key={k} value={k}>{k}</option>)}
                </optgroup>
              ))}
            </select>
            <button
              className="c-compile"
              onClick={() => run()}
              style={{ background: T.color }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              <span>Compile</span>
              <span className="c-shortcut">⌘↵</span>
            </button>
          </div>
        </div>

        {/* ── Target selector bar ── */}
        <div className="c-tbar">
          <span className="c-tlabel">Target MCU:</span>
          {Object.entries(TARGETS).map(([key, t]) => (
            <button
              key={key}
              className="c-tbtn"
              onClick={() => switchTarget(key)}
              style={{
                border:     `1.5px solid ${target === key ? t.color : "var(--border)"}`,
                background: target === key ? t.badge : "var(--white)",
                color:      target === key ? t.color : "var(--muted)",
              }}
            >
              <span className="tb-name" style={{ fontWeight: target === key ? 600 : 400 }}>
                {t.label}
              </span>
              <span className="tb-sub">{t.sub}</span>
            </button>
          ))}
          <div className="c-tinfo">
            <span className="c-tinfo-v" style={{ color: T.color }}>{T.voltage}</span>
            <span className="c-tinfo-d">ADC {T.adcBits}-bit · {T.serialBaud} baud</span>
          </div>
        </div>

        {/* ── Panel tabs (mobile only) ── */}
        <div className="c-ptabs">
          <button
            className={`c-ptab ${activeTab === "input" ? "active" : ""}`}
            onClick={() => setActiveTab("input")}
            style={activeTab === "input" ? { borderBottomColor: "#22C55E", color: "var(--dark)" } : {}}
          >
            <span className="c-tdot" style={{ background: activeTab === "input" ? "#22C55E" : "var(--border)" }} />
            Python Input
          </button>
          <button
            className={`c-ptab ${activeTab === "output" ? "active" : ""}`}
            onClick={() => setActiveTab("output")}
            style={activeTab === "output" ? { borderBottomColor: T.color, color: "var(--dark)" } : {}}
          >
            <span className="c-tdot" style={{ background: activeTab === "output" ? T.color : "var(--border)" }} />
            {T.label} Output
            {error && <span style={{ color: "var(--red)", marginLeft: 4, fontWeight: 700 }}>!</span>}
          </button>
        </div>

        {/* ── Editor panels ── */}
        <div className="c-main">

          {/* Python input */}
          <div className={`c-panel ${activeTab !== "input" ? "hidden" : ""}`}>
            <div className="c-ph">
              <div className="c-ptitle">
                <span className="c-dot c-dot-g" />
                <span className="lbl">Python Input</span>
              </div>
              <button className="c-paction" onClick={() => setSrc("")}>Clear</button>
            </div>
            <textarea
              className="c-editor"
              value={src}
              onChange={e => setSrc(e.target.value)}
              onKeyDown={handleKey}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="none"
              autoComplete="off"
              placeholder="# Write your Python subset here..."
            />
          </div>

          {/* C output */}
          <div className={`c-panel ${activeTab !== "output" ? "hidden" : ""}`}>
            <div className="c-ph">
              <div className="c-ptitle">
                <span className="c-dot" style={{ background: error ? "var(--red)" : T.color }} />
                <span className="lbl">
                  {error ? "Compiler Error" : `${T.label} — Embedded C`}
                </span>
              </div>
              <button
                className={`c-paction ${copied ? "flash" : ""}`}
                onClick={copyOutput}
              >
                {copied ? "✔ Copied" : "Copy"}
              </button>
            </div>
            {error
              ? (
                <div className="c-output err">
                  <div className="c-err-title">✖ Compilation Failed</div>
                  {error}
                  <div className="c-err-hint">
                    Check indentation, syntax, and type annotations.
                  </div>
                </div>
              ) : (
                <div
                  className="c-output"
                  dangerouslySetInnerHTML={{ __html: highlightC(result.output) }}
                />
              )
            }
          </div>
        </div>

        {/* ── Status bar ── */}
        <div className="c-status">
          <div className="c-sitem">
            {error
              ? <span className="c-serr">✖ Error</span>
              : <span className="c-sok">✔ OK</span>
            }
          </div>
          {!error && (
            <>
              <div className="c-sitem"><span>⏱</span><span className="c-sv">{stats.time}ms</span></div>
              <div className="c-sitem"><span>Tokens</span><span className="c-sv">{stats.tokens}</span></div>
              <div className="c-sitem"><span>Py</span><span className="c-sv">{stats.srcLines}L</span></div>
              <div className="c-sitem"><span>C</span><span className="c-sv">{stats.outLines}L</span></div>
              <div className="c-sitem"><span>fn()</span><span className="c-sv">{stats.funcs}</span></div>
              <div className="c-sitem"><span>ADC</span><span className="c-sv">{T.adcBits}-bit</span></div>
              <div className="c-sitem">
                <span>V</span>
                <span className="c-sv" style={{ color: T.color }}>{T.voltage}</span>
              </div>
            </>
          )}
          {warnings?.length > 0 && (
            <div className="c-sitem">
              <span className="c-swarn">⚠ {warnings.length}w</span>
            </div>
          )}
          <div className="c-sitem" style={{ marginLeft: "auto", borderRight: "none", borderLeft: "1px solid var(--border)" }}>
            <span style={{ fontSize: ".58rem", opacity: .7 }}>⌘↵ compile · Tab indent</span>
          </div>
        </div>

        {/* ── Mobile FAB ── */}
        <button
          className="c-fab"
          onClick={() => run()}
          style={{ background: T.color }}
          aria-label="Compile"
        >
          <span className="fab-ring" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>

      </div>
    </section>
  );
});

export default CompilerTool;
