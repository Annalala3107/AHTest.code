/**
 * Multi-Language Client Sandbox Judge Engine (Phase 2)
 * Supports Python 3, Java 21 LTS, and SQL (Relational DDL/DML/DQL) execution
 * with strict static security trapping, loop watchdog limits, and structured ExecutionResult diagnostics.
 */

import type { ExecutionResult, PedagogicalDiagnosis } from './cExecutionEngine.ts';
import type { ExecutionOptions } from './executionManager.ts';

export type SupportedJudgeLanguage =
  | 'c'
  | 'c17'
  | 'cpp'
  | 'cpp17'
  | 'cpp20'
  | 'py3'
  | 'python'
  | 'java'
  | 'sql'
  | 'rust';

export const MULTI_LANG_MAX_CODE_LENGTH = 65536;
const DEFAULT_MAX_TICKS = 1_500_000;

const FORBIDDEN_HOST_TOKENS =
  /\b(window|document|localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|WebSocket|Worker|importScripts|postMessage|Reflect|Proxy|process|child_process|fs|globalThis|__proto__|constructor|prototype)\b/;

const SANDBOX_SHADOW_GLOBALS = [
  'window',
  'document',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'Worker',
  'navigator',
  'location',
  'globalThis',
  'top',
  'parent',
  'frames',
  'self',
  'importScripts',
  'postMessage',
  'caches',
  'process',
];

function buildErrorResult(
  status: 'CE' | 'RTE' | 'TLE',
  stderr: string,
  elapsedMs: number,
  diagnosis?: PedagogicalDiagnosis,
  stdout: string = ''
): ExecutionResult {
  return {
    status,
    exitCode: status === 'TLE' ? 124 : status === 'RTE' ? 139 : 1,
    stdout,
    stderr,
    executionTimeMs: Math.max(elapsedMs, 1),
    memoryKb: status === 'CE' ? 0 : 2048,
    diagnostics: [stderr],
    pedagogicalDiagnosis: diagnosis,
  };
}

/**
 * Strip comments and string literals before scanning for forbidden browser/host API access.
 */
export function checkMultiLangSecurity(
  code: string,
  langLabel: 'python' | 'java' | 'sql'
): { isValid: boolean; error?: string } {
  if (code.length > MULTI_LANG_MAX_CODE_LENGTH) {
    return {
      isValid: false,
      error: `[Dung lượng vượt mức]: Mã nguồn ${langLabel} dài ${code.length.toLocaleString('vi-VN')} ký tự, vượt quá giới hạn tối đa ${MULTI_LANG_MAX_CODE_LENGTH.toLocaleString('vi-VN')} ký tự.`,
    };
  }

  let sanitized = code;
  if (langLabel === 'python') {
    sanitized = sanitized
      .replace(/"""[\s\S]*?"""|'''[\s\S]*?'''/g, '""')
      .replace(/#.*$/gm, '');
  } else if (langLabel === 'java') {
    sanitized = sanitized.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  } else {
    sanitized = sanitized.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '');
  }

  sanitized = sanitized
    .replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '""')
    .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, "''");

  const forbidden = sanitized.match(FORBIDDEN_HOST_TOKENS);
  if (forbidden) {
    return {
      isValid: false,
      error: `security violation: access to host identifier '${forbidden[1]}' is forbidden in the ${langLabel} execution sandbox.`,
    };
  }

  return { isValid: true };
}

function runSandboxedFn(
  jsBody: string,
  argNames: string[],
  argValues: unknown[]
): void {
  const runner = new Function(
    ...argNames,
    ...SANDBOX_SHADOW_GLOBALS,
    `"use strict";\n${jsBody}`
  );
  runner(...argValues, ...SANDBOX_SHADOW_GLOBALS.map(() => undefined));
}

/* ============================================================================
 * 1. PYTHON 3 SANDBOX ENGINE
 * ============================================================================ */

function splitTopLevelCommas(expr: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  let quote: string | null = null;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      current += ch;
      if (ch === '\\' && i + 1 < expr.length) {
        current += expr[++i];
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') depth--;

    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function findUnquotedTokenIndex(line: string, token: string): number {
  let quote: string | null = null;
  let triple: string | null = null;
  let depth = 0;

  for (let i = 0; i < line.length; i++) {
    if (triple) {
      if (line.slice(i, i + 3) === triple) {
        triple = null;
        i += 2;
      }
      continue;
    }
    if (quote) {
      if (line[i] === '\\') {
        i++;
        continue;
      }
      if (line[i] === quote) quote = null;
      continue;
    }
    const tri = line.slice(i, i + 3);
    if (tri === '"""' || tri === "'''") {
      triple = tri;
      i += 2;
      continue;
    }
    if (line[i] === '"' || line[i] === "'") {
      quote = line[i];
      continue;
    }
    if (line[i] === '(' || line[i] === '[' || line[i] === '{') depth++;
    else if (line[i] === ')' || line[i] === ']' || line[i] === '}') depth--;

    if (depth === 0 && line[i] === token) {
      return i;
    }
  }
  return -1;
}

function stripPythonComment(line: string): string {
  const hashIdx = findUnquotedTokenIndex(line, '#');
  if (hashIdx === -1) return line;
  return line.slice(0, hashIdx).replace(/\s+$/, '');
}

function convertPythonFString(raw: string): string {
  // Strip optional leading f/F and outer quotes
  const isDouble = raw.startsWith('f"') || raw.startsWith('F"');
  const inner = raw.slice(2, -1);
  let result = '';
  let i = 0;
  while (i < inner.length) {
    if (inner[i] === '{' && inner[i + 1] === '{') {
      result += '{';
      i += 2;
      continue;
    }
    if (inner[i] === '}' && inner[i + 1] === '}') {
      result += '}';
      i += 2;
      continue;
    }
    if (inner[i] === '{') {
      let depth = 1;
      let j = i + 1;
      while (j < inner.length && depth > 0) {
        if (inner[j] === '{') depth++;
        else if (inner[j] === '}') depth--;
        j++;
      }
      const exprRaw = inner.slice(i + 1, j - 1);
      const formatMatch = exprRaw.match(/^([\s\S]+?):\.(\d+)f$/);
      if (formatMatch) {
        result += `\${Number(${formatMatch[1].trim()}).toFixed(${formatMatch[2]})}`;
      } else {
        result += `\${__py.str(${exprRaw.trim()})}`;
      }
      i = j;
      continue;
    }
    const ch = inner[i];
    if (ch === '`') result += '\\`';
    else if (ch === '$' && inner[i + 1] === '{') result += '\\$';
    else if (!isDouble && ch === '"') result += '"';
    else result += ch;
    i++;
  }
  return '`' + result + '`';
}

function rewritePythonPrintCalls(code: string): string {
  let out = '';
  let i = 0;
  while (i < code.length) {
    const rest = code.slice(i);
    const match = rest.match(/^print\s*\(/);
    const prevCh = i > 0 ? code[i - 1] : '';
    if (match && !/[a-zA-Z0-9_.]/.test(prevCh)) {
      let depth = 1;
      let j = i + match[0].length;
      while (j < code.length && depth > 0) {
        if (code[j] === '(') depth++;
        else if (code[j] === ')') depth--;
        j++;
      }
      if (depth === 0) {
        const argsRaw = code.slice(i + match[0].length, j - 1);
        const args = splitTopLevelCommas(argsRaw);
        const positional: string[] = [];
        let sep = '" "';
        let end = '"\\n"';
        for (const a of args) {
          const sepMatch = a.match(/^sep\s*=\s*([\s\S]+)$/);
          const endMatch = a.match(/^end\s*=\s*([\s\S]+)$/);
          if (sepMatch) sep = sepMatch[1].trim();
          else if (endMatch) end = endMatch[1].trim();
          else positional.push(a);
        }
        out += `__py.print([${positional.join(', ')}], ${sep}, ${end})`;
        i = j;
        continue;
      }
    }
    out += code[i];
    i++;
  }
  return out;
}

function transformPythonExpressions(inputExpr: string): string {
  const literals: string[] = [];
  let expr = inputExpr.replace(
    /\b[fFrR]?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    (match) => {
      const idx = literals.length;
      if (match.startsWith('f"') || match.startsWith("f'") || match.startsWith('F"') || match.startsWith("F'")) {
        literals.push(convertPythonFString(match));
      } else if (match.startsWith('"""') || match.startsWith("'''")) {
        literals.push(JSON.stringify(match.slice(3, -3)));
      } else {
        literals.push(match);
      }
      return `__PY_STR_${idx}__`;
    }
  );

  // Convert list comprehensions: [expr for v in iter if cond] or [expr for v in iter]
  expr = expr.replace(
    /\[\s*([^[\]]+?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+([^[\]]+?)\s+if\s+([^[\]]+?)\s*\]/g,
    (_, body, varName, iterExpr, condExpr) =>
      `__py.listComp(${iterExpr}, (${varName}) => __py.bool(${condExpr}), (${varName}) => ${body})`
  );
  expr = expr.replace(
    /\[\s*([^[\]]+?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+([^[\]]+?)\s*\]/g,
    (_, body, varName, iterExpr) =>
      `__py.listComp(${iterExpr}, null, (${varName}) => ${body})`
  );

  // Convert slicing on expressions like s[::-1], arr[a:b], arr[:b], arr[a:]
  expr = expr.replace(
    /([a-zA-Z_]\w*(?:\([^)]*\))?)\[\s*([^:\]]*)\s*:\s*([^:\]]*)\s*(?::\s*([^\]]*))?\s*\]/g,
    (_, target, start, stop, step) => {
      const s0 = start.trim() || 'null';
      const s1 = stop.trim() || 'null';
      const s2 = step && step.trim() ? step.trim() : 'null';
      return `__py.slice(${target}, ${s0}, ${s1}, ${s2})`;
    }
  );

  // Operators & keywords
  expr = expr.replace(/([a-zA-Z0-9_)\]]+)\s*\/\/\s*([a-zA-Z0-9_(-]+)/g, '__py.floorDiv($1, $2)');
  expr = expr.replace(/\bTrue\b/g, 'true');
  expr = expr.replace(/\bFalse\b/g, 'false');
  expr = expr.replace(/\bNone\b/g, 'null');
  expr = expr.replace(/\band\b/g, '&&');
  expr = expr.replace(/\bor\b/g, '||');
  expr = expr.replace(/\b([a-zA-Z_]\w*|__PY_STR_\d+__)\s+not\s+in\s+([a-zA-Z_]\w*(?:\([^)]*\))?)/g, '!__py.contains($2, $1)');
  expr = expr.replace(/\bnot\s+/g, '!');
  expr = expr.replace(/(?<![=!<>])==(?!=)/g, '===');
  expr = expr.replace(/!=/g, '!==');

  // Common Python string/list method mappings
  expr = expr.replace(/\.append\s*\(/g, '.push(');
  expr = expr.replace(/\.strip\s*\(\s*\)/g, '.trim()');
  expr = expr.replace(/\.lstrip\s*\(\s*\)/g, '.trimStart()');
  expr = expr.replace(/\.rstrip\s*\(\s*\)/g, '.trimEnd()');
  expr = expr.replace(/\.upper\s*\(\s*\)/g, '.toUpperCase()');
  expr = expr.replace(/\.lower\s*\(\s*\)/g, '.toLowerCase()');
  expr = expr.replace(/\.startswith\s*\(/g, '.startsWith(');
  expr = expr.replace(/\.endswith\s*\(/g, '.endsWith(');
  expr = expr.replace(/\.split\s*\(\s*\)/g, '.__pySplit()');

  // print(...) keyword arguments: sep=... / end=... (supports nested calls like print(sum(a)))
  expr = rewritePythonPrintCalls(expr);

  // Restore literals
  expr = expr.replace(/__PY_STR_(\d+)__/g, (_, idx) => literals[Number(idx)]);
  return expr;
}

function joinPythonLogicalLines(rawCode: string): string[] {
  const lines = rawCode.replace(/\r\n/g, '\n').split('\n');
  const joined: string[] = [];
  let buffer = '';
  let bracketDepth = 0;

  for (const line of lines) {
    const clean = stripPythonComment(line);
    if (!clean.trim() && bracketDepth === 0) continue;

    if (buffer) {
      buffer += ' ' + clean.trim();
    } else {
      buffer = clean;
    }

    let quote: string | null = null;
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (quote) {
        if (ch === '\\') i++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '(' || ch === '[' || ch === '{') bracketDepth++;
      else if (ch === ')' || ch === ']' || ch === '}') bracketDepth = Math.max(0, bracketDepth - 1);
    }

    if (bracketDepth === 0) {
      joined.push(buffer);
      buffer = '';
    }
  }
  if (buffer.trim()) joined.push(buffer);
  return joined;
}

export function transpilePythonToJS(pyCode: string): string {
  const logicalLines = joinPythonLogicalLines(pyCode);
  const indentStack: number[] = [0];
  const jsLines: string[] = [];
  const declaredVarsByDepth = new Map<number, Set<string>>();
  declaredVarsByDepth.set(0, new Set());

  const ensureDeclared = (varName: string, depth: number) => {
    const set = declaredVarsByDepth.get(depth);
    if (set && !set.has(varName)) {
      set.add(varName);
      return true;
    }
    return false;
  };

  for (const rawLine of logicalLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Ignore Python import boilerplate (runtime injects sys, math, etc.)
    if (/^(?:import|from)\s+/.test(trimmed)) continue;

    const indent = rawLine.length - rawLine.trimStart().length;
    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push('}');
    }

    const scopeDepth = indentStack.length - 1;
    if (!declaredVarsByDepth.has(scopeDepth)) {
      declaredVarsByDepth.set(scopeDepth, new Set());
    }

    if (/^if\s+__name__\s*==\s*['"]__main__['"]\s*:$/.test(trimmed)) {
      indentStack.push(indent + 1);
      jsLines.push('if (true) {');
      continue;
    }

    if (trimmed === 'pass') {
      jsLines.push('/* pass */');
      continue;
    }
    if (trimmed === 'break' || trimmed === 'continue') {
      jsLines.push(`${trimmed};`);
      continue;
    }

    // def fn(a, b=0):
    const defMatch = trimmed.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:$/);
    if (defMatch) {
      const fnName = defMatch[1];
      const params = defMatch[2];
      indentStack.push(indent + 1);
      const paramSet = new Set(
        params
          .split(',')
          .map((p) => p.split('=')[0].trim())
          .filter(Boolean)
      );
      declaredVarsByDepth.set(indentStack.length - 1, paramSet);
      jsLines.push(`function ${fnName}(${params}) { __py.tick();`);
      continue;
    }

    // if / elif / else
    const ifMatch = trimmed.match(/^if\s+([\s\S]+):$/);
    if (ifMatch) {
      indentStack.push(indent + 1);
      jsLines.push(`if (__py.bool(${transformPythonExpressions(ifMatch[1])})) {`);
      continue;
    }
    const elifMatch = trimmed.match(/^elif\s+([\s\S]+):$/);
    if (elifMatch) {
      indentStack.push(indent + 1);
      jsLines.push(`else if (__py.bool(${transformPythonExpressions(elifMatch[1])})) {`);
      continue;
    }
    if (/^else\s*:$/.test(trimmed)) {
      indentStack.push(indent + 1);
      jsLines.push('else {');
      continue;
    }

    // for tuple unpacking or single variable
    const forMultiMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)+)\s+in\s+([\s\S]+):$/);
    if (forMultiMatch) {
      indentStack.push(indent + 1);
      jsLines.push(
        `for (const [${forMultiMatch[1]}] of __py.iter(${transformPythonExpressions(forMultiMatch[2])})) { __py.tick();`
      );
      continue;
    }
    const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+([\s\S]+):$/);
    if (forMatch) {
      indentStack.push(indent + 1);
      jsLines.push(
        `for (var ${forMatch[1]} of __py.iter(${transformPythonExpressions(forMatch[2])})) { __py.tick();`
      );
      continue;
    }

    // while cond:
    const whileMatch = trimmed.match(/^while\s+([\s\S]+):$/);
    if (whileMatch) {
      indentStack.push(indent + 1);
      jsLines.push(`while (__py.bool(${transformPythonExpressions(whileMatch[1])})) { __py.tick();`);
      continue;
    }

    if (/^try\s*:$/.test(trimmed)) {
      indentStack.push(indent + 1);
      jsLines.push('try {');
      continue;
    }
    if (/^except\b.*:$/.test(trimmed)) {
      indentStack.push(indent + 1);
      jsLines.push('catch (__pyErr) {');
      continue;
    }

    if (/^return\b/.test(trimmed)) {
      const retBody = trimmed.slice(6).trim();
      jsLines.push(retBody ? `return ${transformPythonExpressions(retBody)};` : 'return null;');
      continue;
    }

    // Tuple unpacking assignment: a, b = expr
    const unpackMatch = trimmed.match(/^([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)+)\s*=\s*([\s\S]+)$/);
    if (unpackMatch) {
      const targets = unpackMatch[1].split(',').map((t) => t.trim());
      const decls = targets.filter((t) => ensureDeclared(t, scopeDepth));
      if (decls.length > 0) {
        jsLines.push(`var ${decls.join(', ')};`);
      }
      jsLines.push(
        `[${targets.join(', ')}] = __py.unpack(${transformPythonExpressions(unpackMatch[2])});`
      );
      continue;
    }

    // Simple variable assignment: x = expr (not ==)
    const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=(?!=)\s*([\s\S]+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const prefix = ensureDeclared(varName, scopeDepth) ? 'var ' : '';
      jsLines.push(`${prefix}${varName} = ${transformPythonExpressions(assignMatch[2])};`);
      continue;
    }

    // Augmented assignment: +=, -=, *=, //=, /=, %=
    const augMatch = trimmed.match(/^([a-zA-Z_]\w*(?:\[[^\]]+\])?)\s*(\/\/=|\+=|-=|\*=|\/=|%=)\s*([\s\S]+)$/);
    if (augMatch) {
      if (augMatch[2] === '//=') {
        jsLines.push(`${augMatch[1]} = __py.floorDiv(${augMatch[1]}, ${transformPythonExpressions(augMatch[3])});`);
      } else {
        jsLines.push(`${augMatch[1]} ${augMatch[2]} ${transformPythonExpressions(augMatch[3])};`);
      }
      continue;
    }

    jsLines.push(`${transformPythonExpressions(trimmed)};`);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push('}');
  }

  return jsLines.join('\n');
}

function createPythonRuntime(stdin: string, maxTicks: number) {
  const normalizedInput = stdin.replace(/\r\n/g, '\n');
  const lines = normalizedInput.split('\n');
  let lineCursor = 0;
  let ticks = 0;
  let stdout = '';

  const tick = () => {
    ticks++;
    if (ticks > maxTicks) {
      throw new Error('TIME_LIMIT_EXCEEDED: Vượt quá thời gian thực thi tối đa trong Python Sandbox.');
    }
  };

  const str = (v: unknown): string => {
    if (v === null || v === undefined) return 'None';
    if (v === true) return 'True';
    if (v === false) return 'False';
    if (Array.isArray(v)) {
      return '[' + v.map((item) => (typeof item === 'string' ? `'${item}'` : str(item))).join(', ') + ']';
    }
    return String(v);
  };

  const bool = (v: unknown): boolean => {
    if (Array.isArray(v)) return v.length > 0;
    if (v && typeof v === 'object') return Object.keys(v).length > 0;
    return Boolean(v);
  };

  const iter = (v: unknown): any[] => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') return v.split('');
    if (v && typeof (v as any)[Symbol.iterator] === 'function') return Array.from(v as Iterable<any>);
    if (v && typeof v === 'object') return Object.keys(v);
    return [];
  };

  const gcd = (a: number, b: number): number => {
    let x = Math.abs(Math.trunc(a));
    let y = Math.abs(Math.trunc(b));
    while (y !== 0) {
      const t = x % y;
      x = y;
      y = t;
    }
    return x;
  };

  const pyRuntime = {
    tick,
    str,
    bool,
    iter,
    floorDiv: (a: number, b: number) => {
      tick();
      if (b === 0) throw new Error('ZeroDivisionError: integer division or modulo by zero');
      return Math.floor(a / b);
    },
    slice: (target: any, start: number | null, stop: number | null, step: number | null) => {
      const isStr = typeof target === 'string';
      const arr = isStr ? target.split('') : Array.isArray(target) ? target : [];
      const len = arr.length;
      const st = step ?? 1;
      if (st === 0) throw new Error('ValueError: slice step cannot be zero');

      const out: any[] = [];
      if (st > 0) {
        let i = start === null ? 0 : start < 0 ? Math.max(0, len + start) : Math.min(len, start);
        const end = stop === null ? len : stop < 0 ? Math.max(0, len + stop) : Math.min(len, stop);
        for (; i < end; i += st) out.push(arr[i]);
      } else {
        let i = start === null ? len - 1 : start < 0 ? Math.max(-1, len + start) : Math.min(len - 1, start);
        const end = stop === null ? -1 : stop < 0 ? Math.max(-1, len + stop) : Math.min(len - 1, stop);
        for (; i > end; i += st) out.push(arr[i]);
      }
      return isStr ? out.join('') : out;
    },
    listComp: (source: unknown, predicate: ((v: any) => boolean) | null, mapper: (v: any) => any) => {
      const result: any[] = [];
      for (const item of iter(source)) {
        tick();
        if (!predicate || predicate(item)) {
          result.push(mapper(item));
        }
      }
      return result;
    },
    contains: (container: unknown, value: unknown): boolean => {
      if (typeof container === 'string') return container.includes(String(value));
      if (Array.isArray(container)) return container.includes(value);
      if (container && typeof container === 'object') return String(value) in container;
      return false;
    },
    unpack: (source: unknown): any[] => iter(source),
    print: (args: unknown[], sep = ' ', end = '\n') => {
      tick();
      stdout += args.map((a) => str(a)).join(sep) + end;
    },
    getStdout: () => stdout,
  };

  // Python builtins exposed inside sandbox
  const builtins = {
    input: (prompt?: string) => {
      tick();
      if (prompt) stdout += String(prompt);
      if (lineCursor >= lines.length) {
        return '';
      }
      return lines[lineCursor++];
    },
    int: (v: unknown, base = 10) => {
      if (typeof v === 'boolean') return v ? 1 : 0;
      const n = typeof v === 'string' ? parseInt(v.trim(), base) : Math.trunc(Number(v));
      if (Number.isNaN(n)) throw new Error(`ValueError: invalid literal for int(): ${String(v)}`);
      return n;
    },
    float: (v: unknown) => {
      const n = Number(v);
      if (Number.isNaN(n)) throw new Error(`ValueError: could not convert string to float: ${String(v)}`);
      return n;
    },
    str: (v: unknown) => str(v),
    bool: (v: unknown) => bool(v),
    list: (v?: unknown) => (v === undefined ? [] : iter(v).slice()),
    len: (v: unknown) => {
      if (typeof v === 'string' || Array.isArray(v)) return v.length;
      if (v instanceof Set || v instanceof Map) return v.size;
      if (v && typeof v === 'object') return Object.keys(v).length;
      return 0;
    },
    range: (a: number, b?: number, step = 1) => {
      const start = b === undefined ? 0 : a;
      const stop = b === undefined ? a : b;
      const res: number[] = [];
      if (step > 0) {
        for (let i = start; i < stop; i += step) {
          tick();
          res.push(i);
        }
      } else if (step < 0) {
        for (let i = start; i > stop; i += step) {
          tick();
          res.push(i);
        }
      }
      return res;
    },
    sum: (iterable: unknown, start = 0) => iter(iterable).reduce((acc, cur) => acc + Number(cur), start),
    min: (...args: any[]) => (args.length === 1 && Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args)),
    max: (...args: any[]) => (args.length === 1 && Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args)),
    abs: (x: number) => Math.abs(x),
    round: (x: number, ndigits?: number) =>
      ndigits === undefined ? Math.round(x) : Number(x.toFixed(ndigits)),
    pow: (base: number, exp: number, mod?: number) => {
      if (mod !== undefined) {
        let res = 1;
        let b = ((base % mod) + mod) % mod;
        let e = exp;
        while (e > 0) {
          tick();
          if (e % 2 === 1) res = (res * b) % mod;
          b = (b * b) % mod;
          e = Math.floor(e / 2);
        }
        return res;
      }
      return Math.pow(base, exp);
    },
    sorted: (iterable: unknown, reverse = false) => {
      const copy = iter(iterable).slice();
      copy.sort((x, y) => {
        if (typeof x === 'number' && typeof y === 'number') return reverse ? y - x : x - y;
        const sx = String(x);
        const sy = String(y);
        if (sx === sy) return 0;
        return reverse ? (sx < sy ? 1 : -1) : sx < sy ? -1 : 1;
      });
      return copy;
    },
    reversed: (iterable: unknown) => iter(iterable).slice().reverse(),
    enumerate: (iterable: unknown, start = 0) => iter(iterable).map((val, idx) => [start + idx, val]),
    zip: (...iterables: unknown[]) => {
      const arrays = iterables.map(iter);
      const minLen = Math.min(...arrays.map((a) => a.length));
      const zipped: any[] = [];
      for (let i = 0; i < minLen; i++) zipped.push(arrays.map((a) => a[i]));
      return zipped;
    },
    map: (fn: (v: any) => any, iterable: unknown) => iter(iterable).map((v) => fn(v)),
    filter: (fn: ((v: any) => boolean) | null, iterable: unknown) =>
      iter(iterable).filter((v) => (fn ? fn(v) : bool(v))),
    all: (iterable: unknown) => iter(iterable).every(bool),
    any: (iterable: unknown) => iter(iterable).some(bool),
    ord: (ch: string) => String(ch).charCodeAt(0),
    chr: (code: number) => String.fromCharCode(code),
    divmod: (a: number, b: number) => [Math.floor(a / b), ((a % b) + b) % b],
    math: {
      sqrt: Math.sqrt,
      floor: Math.floor,
      ceil: Math.ceil,
      factorial: (n: number) => {
        let r = 1;
        for (let i = 2; i <= n; i++) {
          tick();
          r *= i;
        }
        return r;
      },
      gcd,
      lcm: (a: number, b: number) => (a === 0 || b === 0 ? 0 : Math.abs((a / gcd(a, b)) * b)),
      isqrt: (n: number) => Math.floor(Math.sqrt(n)),
      log: Math.log,
      log2: Math.log2,
      log10: Math.log10,
      sin: Math.sin,
      cos: Math.cos,
      pi: Math.PI,
      inf: Infinity,
    },
    sys: {
      stdin: {
        read: () => {
          const rest = lines.slice(lineCursor).join('\n');
          lineCursor = lines.length;
          return rest;
        },
        readline: () => (lineCursor < lines.length ? lines[lineCursor++] + '\n' : ''),
        readlines: () => {
          const rest = lines.slice(lineCursor).map((l) => l + '\n');
          lineCursor = lines.length;
          return rest;
        },
      },
    },
  };

  return { pyRuntime, builtins };
}

export async function executePythonCode(
  code: string,
  stdin: string = '',
  options: ExecutionOptions = {}
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const sec = checkMultiLangSecurity(code, 'python');
  if (!sec.isValid) {
    return buildErrorResult('CE', sec.error || 'Security error', performance.now() - startTime);
  }

  // Provide whitespace split() compatibility helper via String wrapper only during sandbox run
  const { pyRuntime, builtins } = createPythonRuntime(
    stdin,
    options.timeoutMs ? options.timeoutMs * 1000 : DEFAULT_MAX_TICKS
  );

  try {
    let compiledJs = transpilePythonToJS(code);
    // Replace x.__pySplit() with whitespace split matching Python str.split()
    compiledJs = compiledJs.replace(/\.__pySplit\(\)/g, '.trim().split(/\\s+/).filter(Boolean)');

    const builtinNames = Object.keys(builtins);
    const builtinVals = builtinNames.map((k) => (builtins as Record<string, unknown>)[k]);

    runSandboxedFn(compiledJs, ['__py', ...builtinNames], [pyRuntime, ...builtinVals]);

    return {
      status: 'SUCCESS',
      exitCode: 0,
      stdout: pyRuntime.getStdout(),
      stderr: '',
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      memoryKb: 2048,
    };
  } catch (err: any) {
    const msg = String(err?.message || err);
    const elapsed = Math.round(performance.now() - startTime);
    if (msg.includes('TIME_LIMIT_EXCEEDED')) {
      return buildErrorResult('TLE', msg, elapsed, undefined, pyRuntime.getStdout());
    }
    return buildErrorResult('RTE', `Python Runtime Error: ${msg}`, elapsed, undefined, pyRuntime.getStdout());
  }
}

/* ============================================================================
 * 2. JAVA 21 LTS SANDBOX ENGINE
 * ============================================================================ */

export function checkJavaSyntax(code: string): { isValid: boolean; error?: string } {
  const sec = checkMultiLangSecurity(code, 'java');
  if (!sec.isValid) return sec;

  const clean = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  if (!/\bclass\s+[a-zA-Z_]\w*/.test(clean)) {
    return {
      isValid: false,
      error: 'Main.java:1: error: class Main is required.\n[Java Compiler Error] Chương trình Java phải định nghĩa một class (ví dụ: public class Main).',
    };
  }
  if (!/\bstatic\s+void\s+main\s*\(/.test(clean)) {
    return {
      isValid: false,
      error: 'Main.java: error: Main method not found in class Main, please define: public static void main(String[] args)',
    };
  }
  return { isValid: true };
}

export function transpileJavaToJS(javaCode: string): string {
  const stringLiterals: string[] = [];
  let code = javaCode.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (m) => {
    const idx = stringLiterals.length;
    stringLiterals.push(m);
    return `__JAVA_STR_${idx}__`;
  });

  code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  code = code.replace(/^\s*(?:import|package)\s+[^;]+;\s*$/gm, '');

  // Unwrap top-level class declaration { ... }
  code = code.replace(/\b(?:public\s+|final\s+|abstract\s+)*class\s+[a-zA-Z_]\w*\s*\{/, '');
  const lastBrace = code.lastIndexOf('}');
  if (lastBrace !== -1) {
    code = code.slice(0, lastBrace) + code.slice(lastBrace + 1);
  }

  // Main entrypoint & static helper methods
  code = code.replace(/\b(?:public\s+|private\s+|protected\s+)?static\s+void\s+main\s*\([^)]*\)(?:\s+throws\s+[^{]+)?\s*\{/, 'function __java_main() {');
  code = code.replace(
    /\b(?:public\s+|private\s+|protected\s+)?static\s+(?:int|long|double|float|boolean|char|void|String)(?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)(?:\s+throws\s+[^{]+)?\s*\{/g,
    (_, fnName, params) => {
      const cleanParams = params
        .split(',')
        .map((p: string) => {
          const parts = p.trim().split(/\s+/);
          return parts[parts.length - 1] || '';
        })
        .filter(Boolean)
        .join(', ');
      return `function ${fnName}(${cleanParams}) { __java.tick();`;
    }
  );

  // Scanner & System.out
  code = code.replace(/\bScanner\s+([a-zA-Z_]\w*)\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)\s*;/g, 'let $1 = __java.createScanner();');
  code = code.replace(/\bSystem\.out\.println\s*\(/g, '__java.println(');
  code = code.replace(/\bSystem\.out\.print\s*\(/g, '__java.print(');
  code = code.replace(/\bSystem\.out\.printf\s*\(/g, '__java.printf(');

  // Collections & Array utilities
  code = code.replace(/\bArrays\.sort\s*\(/g, '__java.sortArray(');
  code = code.replace(/\bArrays\.fill\s*\(/g, '__java.fillArray(');
  code = code.replace(/\bArrayList\s*<[^>]*>\s+([a-zA-Z_]\w*)\s*=\s*new\s+ArrayList\s*(?:<[^>]*>)?\s*\(\s*\)\s*;/g, 'let $1 = [];');

  // Java String/Integer helpers BEFORE loop regexes so .length() inside for(...) resolves cleanly
  code = code.replace(/\.equals\s*\(([^)]+)\)/g, ' === ($1)');
  code = code.replace(/\.length\s*\(\s*\)/g, '.length');
  code = code.replace(/\.isEmpty\s*\(\s*\)/g, '.length === 0');
  code = code.replace(/\.add\s*\(/g, '.push(');

  // Loops watchdog
  code = code.replace(/\bfor\s*\(\s*(?:int|long|double|float|String|char|boolean)\s+([a-zA-Z_]\w*)\s*:\s*([^)]+)\)\s*\{/g, 'for (let $1 of $2) { __java.tick();');
  code = code.replace(/\bfor\s*\(([^)]+)\)\s*\{/g, 'for ($1) { __java.tick();');
  code = code.replace(/\bwhile\s*\(([^)]+)\)\s*\{/g, 'while ($1) { __java.tick();');

  // Arrays & typed variable declarations
  code = code.replace(/\b(?:int|long|double|float|boolean)\s*\[\s*\]\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=\s*new\s+(?:int|long|double|float|boolean)\s*\[([^\]]+)\]\s*\[([^\]]+)\]\s*;/g,
    'let $1 = Array.from({ length: $2 }, () => new Array($3).fill(0));');
  code = code.replace(/\b(?:int|long|double|float|boolean)\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=\s*new\s+(?:int|long|double|float|boolean)\s*\[([^\]]+)\]\s*;/g,
    'let $1 = new Array($2).fill(0);');
  code = code.replace(/\bString\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=\s*new\s+String\s*\[([^\]]+)\]\s*;/g,
    'let $1 = new Array($2).fill("");');
  code = code.replace(/\b(?:int|long|double|float|boolean|char|String)\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=\s*\{([^}]*)\}\s*;/g, 'let $1 = [$2];');
  code = code.replace(/\(\s*(?:int|long|double|float|char)\s*\)\s*/g, '');
  code = code.replace(/\b(?:static\s+)?(?:final\s+)?(?:int|long|double|float|boolean|char|String)\s+([a-zA-Z_]\w*)/g, 'let $1');

  code = code.replace(/\bInteger\.parseInt\s*\(/g, 'parseInt(');
  code = code.replace(/\bLong\.parseLong\s*\(/g, 'parseInt(');
  code = code.replace(/\bDouble\.parseDouble\s*\(/g, 'parseFloat(');
  code = code.replace(/\bString\.valueOf\s*\(/g, 'String(');
  code = code.replace(/\bMath\.PI\b/g, 'Math.PI');

  code = code.replace(/__JAVA_STR_(\d+)__/g, (_, idx) => stringLiterals[Number(idx)]);

  return `
    ${code}
    if (typeof __java_main === 'function') {
      __java_main();
    }
  `;
}

export async function executeJavaCode(
  code: string,
  stdin: string = '',
  options: ExecutionOptions = {}
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const syntax = checkJavaSyntax(code);
  if (!syntax.isValid) {
    return buildErrorResult('CE', syntax.error || 'Java Compile Error', performance.now() - startTime);
  }

  const maxTicks = options.timeoutMs ? options.timeoutMs * 1000 : DEFAULT_MAX_TICKS;
  let ticks = 0;
  let stdout = '';
  const tokens = stdin.trim() ? stdin.trim().split(/\s+/) : [];
  const rawLines = stdin.replace(/\r\n/g, '\n').split('\n');
  let tokIdx = 0;
  let lineIdx = 0;

  const tick = () => {
    ticks++;
    if (ticks > maxTicks) {
      throw new Error('TIME_LIMIT_EXCEEDED: Chương trình Java vượt quá thời gian cho phép.');
    }
  };

  const javaRuntime = {
    tick,
    print: (val: unknown = '') => {
      tick();
      stdout += String(val);
    },
    println: (val?: unknown) => {
      tick();
      stdout += (val !== undefined ? String(val) : '') + '\n';
    },
    printf: (format: string, ...args: any[]) => {
      tick();
      let idx = 0;
      const out = String(format).replace(/%(?:(\.\d+)?f|d|s|n|%)/g, (match, prec) => {
        if (match === '%%') return '%';
        if (match === '%n') return '\n';
        if (idx >= args.length) return match;
        const v = args[idx++];
        if (match.endsWith('f')) {
          const num = Number(v);
          return prec ? num.toFixed(parseInt(prec.slice(1), 10)) : num.toFixed(6);
        }
        if (match === '%d') return String(parseInt(v, 10));
        return String(v);
      });
      stdout += out;
    },
    sortArray: (arr: any[], fromIdx?: number, toIdx?: number) => {
      tick();
      if (!Array.isArray(arr)) return;
      const start = fromIdx ?? 0;
      const end = toIdx ?? arr.length;
      const sub = arr.slice(start, end).sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))));
      for (let i = 0; i < sub.length; i++) arr[start + i] = sub[i];
    },
    fillArray: (arr: any[], val: unknown) => {
      tick();
      if (Array.isArray(arr)) arr.fill(val);
    },
    createScanner: () => ({
      nextInt: () => {
        tick();
        if (tokIdx >= tokens.length) return 0;
        const n = parseInt(tokens[tokIdx++], 10);
        return Number.isNaN(n) ? 0 : n;
      },
      nextLong: () => {
        tick();
        if (tokIdx >= tokens.length) return 0;
        const n = parseInt(tokens[tokIdx++], 10);
        return Number.isNaN(n) ? 0 : n;
      },
      nextDouble: () => {
        tick();
        if (tokIdx >= tokens.length) return 0;
        const n = parseFloat(tokens[tokIdx++]);
        return Number.isNaN(n) ? 0 : n;
      },
      nextFloat: () => {
        tick();
        if (tokIdx >= tokens.length) return 0;
        const n = parseFloat(tokens[tokIdx++]);
        return Number.isNaN(n) ? 0 : n;
      },
      next: () => {
        tick();
        return tokIdx < tokens.length ? tokens[tokIdx++] : '';
      },
      nextLine: () => {
        tick();
        return lineIdx < rawLines.length ? rawLines[lineIdx++] : '';
      },
      hasNext: () => tokIdx < tokens.length,
      hasNextInt: () => tokIdx < tokens.length && /^-?\d+$/.test(tokens[tokIdx]),
      close: () => {},
    }),
  };

  try {
    const jsBody = transpileJavaToJS(code);
    runSandboxedFn(jsBody, ['__java'], [javaRuntime]);
    return {
      status: 'SUCCESS',
      exitCode: 0,
      stdout,
      stderr: '',
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      memoryKb: 4096,
    };
  } catch (err: any) {
    const msg = String(err?.message || err);
    const elapsed = Math.round(performance.now() - startTime);
    if (msg.includes('TIME_LIMIT_EXCEEDED')) {
      return buildErrorResult('TLE', msg, elapsed, undefined, stdout);
    }
    return buildErrorResult('RTE', `Java Runtime Error: ${msg}`, elapsed, undefined, stdout);
  }
}

/* ============================================================================
 * 3. PURE TYPESCRIPT RELATIONAL SQL SANDBOX ENGINE
 * ============================================================================ */

type SqlRow = Record<string, any>;

interface SqlTable {
  columns: string[];
  rows: SqlRow[];
}

function splitSqlStatements(sql: string): string[] {
  const clean = sql.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '');
  const stmts: string[] = [];
  let cur = '';
  let quote: string | null = null;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (quote) {
      cur += ch;
      if (ch === quote && clean[i + 1] === quote) {
        cur += clean[++i];
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      cur += ch;
      continue;
    }
    if (ch === ';') {
      if (cur.trim()) stmts.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) stmts.push(cur.trim());
  return stmts;
}

function parseSqlLiteral(raw: string): any {
  const s = raw.trim();
  if (/^NULL$/i.test(s)) return null;
  if (/^TRUE$/i.test(s)) return true;
  if (/^FALSE$/i.test(s)) return false;
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1).replace(/''/g, "'");
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function parseValueTuples(valuesBody: string): any[][] {
  const tuples: any[][] = [];
  let i = 0;
  while (i < valuesBody.length) {
    if (valuesBody[i] === '(') {
      let depth = 1;
      let j = i + 1;
      let quote: string | null = null;
      while (j < valuesBody.length && depth > 0) {
        const ch = valuesBody[j];
        if (quote) {
          if (ch === quote && valuesBody[j + 1] === quote) j++;
          else if (ch === quote) quote = null;
        } else {
          if (ch === "'" || ch === '"') quote = ch;
          else if (ch === '(') depth++;
          else if (ch === ')') depth--;
        }
        j++;
      }
      const tupleInner = valuesBody.slice(i + 1, j - 1);
      tuples.push(splitTopLevelCommas(tupleInner).map(parseSqlLiteral));
      i = j;
    } else {
      i++;
    }
  }
  return tuples;
}

function getFieldCaseInsensitive(row: SqlRow, key: string): any {
  const stripped = key.includes('.') ? key.split('.').pop()! : key;
  if (key in row) return row[key];
  if (stripped in row) return row[stripped];
  const lower = stripped.toLowerCase();
  const foundKey = Object.keys(row).find((k) => k.toLowerCase() === lower);
  return foundKey !== undefined ? row[foundKey] : undefined;
}

function evalSimpleCondition(row: SqlRow, cond: string): boolean {
  const trimmed = cond.trim();
  if (!trimmed) return true;

  // Handle OR at top level
  const orParts = trimmed.split(/\s+OR\s+/i);
  if (orParts.length > 1) {
    return orParts.some((part) => evalSimpleCondition(row, part));
  }

  // Handle AND at top level
  const andParts = trimmed.split(/\s+AND\s+/i);
  if (andParts.length > 1) {
    return andParts.every((part) => evalSimpleCondition(row, part));
  }

  const nullMatch = trimmed.match(/^([a-zA-Z_][\w.]*)\s+IS\s+(NOT\s+)?NULL$/i);
  if (nullMatch) {
    const v = getFieldCaseInsensitive(row, nullMatch[1]);
    return nullMatch[2] ? v !== null && v !== undefined : v === null || v === undefined;
  }

  const inMatch = trimmed.match(/^([a-zA-Z_][\w.]*)\s+(NOT\s+)?IN\s*\(([^)]+)\)$/i);
  if (inMatch) {
    const v = getFieldCaseInsensitive(row, inMatch[1]);
    const items = splitTopLevelCommas(inMatch[3]).map(parseSqlLiteral);
    const hit = items.includes(v);
    return inMatch[2] ? !hit : hit;
  }

  const betweenMatch = trimmed.match(/^([a-zA-Z_][\w.]*)\s+BETWEEN\s+(.+?)\s+AND\s+(.+)$/i);
  if (betweenMatch) {
    const v = getFieldCaseInsensitive(row, betweenMatch[1]);
    const lo = parseSqlLiteral(betweenMatch[2]);
    const hi = parseSqlLiteral(betweenMatch[3]);
    return v >= lo && v <= hi;
  }

  const likeMatch = trimmed.match(/^([a-zA-Z_][\w.]*)\s+LIKE\s+('(?:[^']|'')*')$/i);
  if (likeMatch) {
    const v = String(getFieldCaseInsensitive(row, likeMatch[1]) ?? '');
    const pattern = String(parseSqlLiteral(likeMatch[2]))
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/%/g, '.*')
      .replace(/_/g, '.');
    return new RegExp(`^${pattern}$`, 'i').test(v);
  }

  const cmpMatch = trimmed.match(/^([a-zA-Z_][\w.]*|\w+\([^)]*\))\s*(=|!=|<>|<=|>=|<|>)\s*([\s\S]+)$/);
  if (cmpMatch) {
    const leftRaw = cmpMatch[1];
    const op = cmpMatch[2];
    const rightRaw = cmpMatch[3].trim();
    const leftVal = getFieldCaseInsensitive(row, leftRaw);
    const rightVal =
      rightRaw.startsWith("'") || rightRaw.startsWith('"') || /^-?\d+(\.\d+)?$/.test(rightRaw)
        ? parseSqlLiteral(rightRaw)
        : getFieldCaseInsensitive(row, rightRaw) ?? parseSqlLiteral(rightRaw);

    switch (op) {
      case '=':
        return leftVal == rightVal;
      case '!=':
      case '<>':
        return leftVal != rightVal;
      case '<':
        return leftVal < rightVal;
      case '<=':
        return leftVal <= rightVal;
      case '>':
        return leftVal > rightVal;
      case '>=':
        return leftVal >= rightVal;
    }
  }

  return true;
}

function seedDefaultUniversityDb(tables: Map<string, SqlTable>): void {
  tables.set('students', {
    columns: ['id', 'name', 'major', 'gpa'],
    rows: [
      { id: 1, name: 'Nguyen Van An', major: 'SE', gpa: 3.85 },
      { id: 2, name: 'Tran Thi Binh', major: 'AI', gpa: 3.92 },
      { id: 3, name: 'Le Hoang Cuong', major: 'SE', gpa: 3.2 },
      { id: 4, name: 'Pham Minh Duc', major: 'IA', gpa: 3.55 },
    ],
  });
  tables.set('courses', {
    columns: ['code', 'title', 'credits'],
    rows: [
      { code: 'PRF192', title: 'Programming Fundamentals', credits: 3 },
      { code: 'CSD201', title: 'Data Structures and Algorithms', credits: 3 },
      { code: 'DBI202', title: 'Database Systems', credits: 3 },
    ],
  });
}

function computeAggregate(
  fnName: string,
  argExpr: string,
  groupRows: SqlRow[]
): any {
  const fn = fnName.toUpperCase();
  const cleanArg = argExpr.trim();
  if (fn === 'COUNT') {
    if (cleanArg === '*') return groupRows.length;
    const distinctMatch = cleanArg.match(/^DISTINCT\s+(.+)$/i);
    if (distinctMatch) {
      const vals = groupRows
        .map((r) => getFieldCaseInsensitive(r, distinctMatch[1].trim()))
        .filter((v) => v !== null && v !== undefined);
      return new Set(vals).size;
    }
    return groupRows.filter((r) => {
      const v = getFieldCaseInsensitive(r, cleanArg);
      return v !== null && v !== undefined;
    }).length;
  }

  const nums = groupRows
    .map((r) => Number(getFieldCaseInsensitive(r, cleanArg)))
    .filter((n) => !Number.isNaN(n));

  if (nums.length === 0) return null;
  if (fn === 'SUM') return nums.reduce((a, b) => a + b, 0);
  if (fn === 'AVG') return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2));
  if (fn === 'MIN') return Math.min(...nums);
  if (fn === 'MAX') return Math.max(...nums);
  return null;
}

export async function executeSqlQuery(
  sqlCode: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const sec = checkMultiLangSecurity(sqlCode, 'sql');
  if (!sec.isValid) {
    return buildErrorResult('CE', sec.error || 'SQL Security Error', performance.now() - startTime);
  }

  const tables = new Map<string, SqlTable>();
  const seedStmts = stdin.trim() ? splitSqlStatements(stdin) : [];
  const userStmts = splitSqlStatements(sqlCode);

  if (userStmts.length === 0) {
    return buildErrorResult(
      'CE',
      'SQL Syntax Error: Không tìm thấy câu lệnh SQL hợp lệ nào để thực thi.',
      performance.now() - startTime
    );
  }

  const combinedStmts = [...seedStmts, ...userStmts];
  const hasCreateTable = combinedStmts.some((s) => /^CREATE\s+TABLE\b/i.test(s));
  if (!hasCreateTable) {
    seedDefaultUniversityDb(tables);
  }

  const outputs: string[] = [];

  try {
    for (const stmt of combinedStmts) {
      // 1. CREATE TABLE
      const createMatch = stmt.match(
        /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z_]\w*)\s*\(([\s\S]+)\)$/i
      );
      if (createMatch) {
        const tblName = createMatch[1].toLowerCase();
        const colDefs = splitTopLevelCommas(createMatch[2])
          .map((def) => def.trim())
          .filter((def) => !/^(?:PRIMARY\s+KEY|FOREIGN\s+KEY|CONSTRAINT|UNIQUE|CHECK)\b/i.test(def))
          .map((def) => def.split(/\s+/)[0].replace(/[`"]/g, ''));
        tables.set(tblName, { columns: colDefs, rows: [] });
        continue;
      }

      // 2. INSERT INTO
      const insertMatch = stmt.match(
        /^INSERT\s+INTO\s+([a-zA-Z_]\w*)(?:\s*\(([^)]+)\))?\s+VALUES\s+([\s\S]+)$/i
      );
      if (insertMatch) {
        const tblName = insertMatch[1].toLowerCase();
        const table = tables.get(tblName);
        if (!table) {
          throw new Error(`no such table: ${insertMatch[1]}`);
        }
        const explicitCols = insertMatch[2]
          ? splitTopLevelCommas(insertMatch[2]).map((c) => c.replace(/[`"]/g, '').trim())
          : table.columns;
        const tuples = parseValueTuples(insertMatch[3]);
        for (const vals of tuples) {
          const row: SqlRow = {};
          for (const col of table.columns) row[col] = null;
          explicitCols.forEach((colName, i) => {
            row[colName] = i < vals.length ? vals[i] : null;
          });
          table.rows.push(row);
        }
        continue;
      }

      // 3. DELETE FROM
      const deleteMatch = stmt.match(/^DELETE\s+FROM\s+([a-zA-Z_]\w*)(?:\s+WHERE\s+([\s\S]+))?$/i);
      if (deleteMatch) {
        const tblName = deleteMatch[1].toLowerCase();
        const table = tables.get(tblName);
        if (!table) throw new Error(`no such table: ${deleteMatch[1]}`);
        if (!deleteMatch[2]) {
          table.rows = [];
        } else {
          table.rows = table.rows.filter((r) => !evalSimpleCondition(r, deleteMatch[2]));
        }
        continue;
      }

      // 4. UPDATE
      const updateMatch = stmt.match(
        /^UPDATE\s+([a-zA-Z_]\w*)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i
      );
      if (updateMatch) {
        const tblName = updateMatch[1].toLowerCase();
        const table = tables.get(tblName);
        if (!table) throw new Error(`no such table: ${updateMatch[1]}`);
        const assignments = splitTopLevelCommas(updateMatch[2]).map((pair) => {
          const eqIdx = pair.indexOf('=');
          return {
            col: pair.slice(0, eqIdx).trim(),
            val: parseSqlLiteral(pair.slice(eqIdx + 1)),
          };
        });
        for (const row of table.rows) {
          if (!updateMatch[3] || evalSimpleCondition(row, updateMatch[3])) {
            for (const a of assignments) row[a.col] = a.val;
          }
        }
        continue;
      }

      // 5. SELECT
      const selectMatch = stmt.match(
        /^SELECT\s+(DISTINCT\s+)?([\s\S]+?)\s+FROM\s+([a-zA-Z_]\w*)(?:\s+(?:AS\s+)?(?!(?:WHERE|JOIN|INNER|LEFT|RIGHT|CROSS|ON|GROUP|HAVING|ORDER|LIMIT)\b)([a-zA-Z_]\w*))?([\s\S]*)$/i
      );
      if (selectMatch) {
        const isDistinct = Boolean(selectMatch[1]);
        const selectRaw = selectMatch[2].trim();
        const baseName = selectMatch[3].toLowerCase();
        const baseAlias = (selectMatch[4] || selectMatch[3]).toLowerCase();
        let restClause = selectMatch[5].trim();

        const baseTable = tables.get(baseName);
        if (!baseTable) throw new Error(`no such table: ${selectMatch[3]}`);

        let workingRows: SqlRow[] = baseTable.rows.map((r) => {
          const prefixed: SqlRow = { ...r };
          for (const k of Object.keys(r)) {
            prefixed[`${baseAlias}.${k}`] = r[k];
          }
          return prefixed;
        });
        const allCols = [...baseTable.columns];

        // Parse optional JOIN clauses
        while (/^(?:INNER\s+|LEFT\s+)?JOIN\b/i.test(restClause)) {
          const joinMatch = restClause.match(
            /^(INNER\s+|LEFT\s+)?JOIN\s+([a-zA-Z_]\w*)(?:\s+(?:AS\s+)?([a-zA-Z_]\w*))?\s+ON\s+([^\s]+)\s*=\s*([^\s]+)([\s\S]*)$/i
          );
          if (!joinMatch) throw new Error(`SQL Syntax Error near JOIN: ${restClause}`);
          const isLeft = Boolean(joinMatch[1] && /LEFT/i.test(joinMatch[1]));
          const joinTblName = joinMatch[2].toLowerCase();
          const joinAlias = (joinMatch[3] || joinMatch[2]).toLowerCase();
          const leftKey = joinMatch[4];
          const rightKey = joinMatch[5];
          restClause = joinMatch[6].trim();

          const joinTable = tables.get(joinTblName);
          if (!joinTable) throw new Error(`no such table: ${joinMatch[2]}`);
          for (const c of joinTable.columns) {
            if (!allCols.includes(c)) allCols.push(c);
          }

          const joinedRows: SqlRow[] = [];
          for (const lr of workingRows) {
            let matched = false;
            for (const rr of joinTable.rows) {
              const cand: SqlRow = { ...lr };
              for (const k of Object.keys(rr)) {
                if (!(k in cand)) cand[k] = rr[k];
                cand[`${joinAlias}.${k}`] = rr[k];
              }
              if (getFieldCaseInsensitive(cand, leftKey) == getFieldCaseInsensitive(cand, rightKey)) {
                joinedRows.push(cand);
                matched = true;
              }
            }
            if (!matched && isLeft) {
              const cand: SqlRow = { ...lr };
              for (const k of joinTable.columns) {
                cand[`${joinAlias}.${k}`] = null;
              }
              joinedRows.push(cand);
            }
          }
          workingRows = joinedRows;
        }

        // Extract WHERE / GROUP BY / HAVING / ORDER BY / LIMIT
        const clauseExtract = (kw: string, stopKws: string[]): string | null => {
          const stopPattern = stopKws.length > 0 ? `(?=\\s+(?:${stopKws.join('|')})\\b|$)` : '$';
          const re = new RegExp(`^${kw}\\s+([\\s\\S]+?)${stopPattern}`, 'i');
          const m = restClause.match(re);
          if (!m) return null;
          restClause = restClause.slice(m[0].length).trim();
          return m[1].trim();
        };

        const whereClause = clauseExtract('WHERE', ['GROUP\\s+BY', 'HAVING', 'ORDER\\s+BY', 'LIMIT']);
        const groupByClause = clauseExtract('GROUP\\s+BY', ['HAVING', 'ORDER\\s+BY', 'LIMIT']);
        const havingClause = clauseExtract('HAVING', ['ORDER\\s+BY', 'LIMIT']);
        const orderByClause = clauseExtract('ORDER\\s+BY', ['LIMIT']);
        const limitClause = clauseExtract('LIMIT', []);

        if (whereClause) {
          workingRows = workingRows.filter((r) => evalSimpleCondition(r, whereClause));
        }

        // Parse SELECT projection specs
        const rawSelectItems = selectRaw === '*' ? allCols : splitTopLevelCommas(selectRaw);
        const selectSpecs = rawSelectItems.map((item) => {
          const aliasMatch = item.match(/^([\s\S]+?)\s+AS\s+([a-zA-Z_]\w*)$/i);
          const expr = aliasMatch ? aliasMatch[1].trim() : item.trim();
          const aggMatch = expr.match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*([^)]+)\s*\)$/i);
          const label = aliasMatch
            ? aliasMatch[2]
            : aggMatch
            ? expr
            : expr.includes('.')
            ? expr.split('.').pop()!
            : expr;
          return { expr, label, aggMatch };
        });

        const hasAggregate = selectSpecs.some((s) => Boolean(s.aggMatch));
        let projectedRows: SqlRow[] = [];

        if (groupByClause || hasAggregate) {
          const groupCols = groupByClause ? splitTopLevelCommas(groupByClause) : [];
          const groups = new Map<string, SqlRow[]>();

          if (groupCols.length === 0) {
            groups.set('__all__', workingRows);
          } else {
            for (const r of workingRows) {
              const gKey = JSON.stringify(groupCols.map((c) => getFieldCaseInsensitive(r, c)));
              const bucket = groups.get(gKey) || [];
              bucket.push(r);
              groups.set(gKey, bucket);
            }
          }

          for (const [, groupRows] of groups.entries()) {
            const sample = groupRows[0] || {};
            const outRow: SqlRow = {};
            for (const spec of selectSpecs) {
              if (spec.aggMatch) {
                const val = computeAggregate(spec.aggMatch[1], spec.aggMatch[2], groupRows);
                outRow[spec.label] = val;
                outRow[spec.expr] = val;
              } else {
                outRow[spec.label] = getFieldCaseInsensitive(sample, spec.expr) ?? null;
              }
            }
            if (!havingClause || evalSimpleCondition(outRow, havingClause)) {
              projectedRows.push(outRow);
            }
          }
        } else {
          projectedRows = workingRows.map((r) => {
            const outRow: SqlRow = {};
            for (const spec of selectSpecs) {
              outRow[spec.label] = getFieldCaseInsensitive(r, spec.expr) ?? null;
            }
            return outRow;
          });
        }

        if (orderByClause) {
          const orderTerms = splitTopLevelCommas(orderByClause).map((term) => {
            const parts = term.trim().split(/\s+/);
            const desc = parts[parts.length - 1]?.toUpperCase() === 'DESC';
            const col = parts[0];
            return { col, desc };
          });
          projectedRows.sort((a, b) => {
            for (const { col, desc } of orderTerms) {
              const va = getFieldCaseInsensitive(a, col);
              const vb = getFieldCaseInsensitive(b, col);
              if (va === vb) continue;
              if (va === null || va === undefined) return desc ? -1 : 1;
              if (vb === null || vb === undefined) return desc ? 1 : -1;
              const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
              if (cmp !== 0) return desc ? -cmp : cmp;
            }
            return 0;
          });
        }

        const headers = selectSpecs.map((s) => s.label);
        if (isDistinct) {
          const seen = new Set<string>();
          projectedRows = projectedRows.filter((row) => {
            const sig = JSON.stringify(headers.map((h) => row[h]));
            if (seen.has(sig)) return false;
            seen.add(sig);
            return true;
          });
        }

        if (limitClause) {
          const limitNum = parseInt(limitClause, 10);
          if (!Number.isNaN(limitNum) && limitNum >= 0) {
            projectedRows = projectedRows.slice(0, limitNum);
          }
        }

        const tableLines = [headers.join(' | ')];
        for (const r of projectedRows) {
          tableLines.push(headers.map((h) => (r[h] === null || r[h] === undefined ? 'NULL' : String(r[h]))).join(' | '));
        }
        outputs.push(tableLines.join('\n'));
        continue;
      }

      throw new Error(`Unsupported SQL statement: ${stmt}`);
    }

    return {
      status: 'SUCCESS',
      exitCode: 0,
      stdout: outputs.join('\n\n'),
      stderr: '',
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      memoryKb: 1024,
    };
  } catch (err: any) {
    return buildErrorResult(
      'CE',
      `SQL Error: ${String(err?.message || err)}`,
      Math.round(performance.now() - startTime)
    );
  }
}
