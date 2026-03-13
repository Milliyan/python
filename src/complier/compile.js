// ─────────────────────────────────────────────
//  Compile pipeline — tokenize → parse → generate
// ─────────────────────────────────────────────

import { tokenize } from "./tokenize.js";
import { Parser }   from "./parser.js";
import { CodeGen }  from "./codegen.js";

/**
 * Compile a Python subset string into Embedded C.
 * @param {string} source     - Python source code
 * @param {string} targetKey  - "arduino" | "esp32" | "stm32"
 * @returns {{ output, error, warnings, stats, tokens, ast }}
 */
export function compile(source, targetKey = "arduino") {
  const result = {
    tokens:   [],
    ast:      null,
    output:   "",
    error:    null,
    warnings: [],
    stats:    {},
  };

  try {
    const t0 = performance.now();

    result.tokens = tokenize(source);
    result.ast    = new Parser(result.tokens).parse();

    const gen     = new CodeGen(targetKey);
    result.output = gen.generate(result.ast);
    result.warnings = gen.warnings;

    const t1 = performance.now();

    const srcLines = source.split("\n")
      .filter(l => l.trim() && !l.trim().startsWith("#")).length;
    const outLines = result.output.split("\n")
      .filter(l => l.trim()).length;
    const funcs = result.ast.body.filter(n => n.type === "FuncDef").length;

    result.stats = {
      time:     (t1 - t0).toFixed(1),
      srcLines,
      outLines,
      funcs,
      tokens:   result.tokens.length,
    };
  } catch (e) {
    result.error = e.message;
  }

  return result;
}
