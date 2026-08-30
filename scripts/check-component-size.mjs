#!/usr/bin/env node
/**
 * Enforces the 300-line cap on individual components.
 *
 * The rule exists so each component stays small enough to read in one sitting
 * and to hand to an AI whole, which is how this team iterates. Total lines is
 * the measure, not statements and not lines-minus-comments, because total lines
 * is what actually fills a context window.
 *
 * Runs in CI on every push, and locally with `npm run check:size`.
 */

import { readdirSync, readFileSync, statSync, appendFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const LIMIT = Number(process.env.COMPONENT_LINE_LIMIT ?? 300)
const ROOT = fileURLToPath(new URL('..', import.meta.url))
const TARGET = join(ROOT, 'src/components')

/** Every .tsx/.ts under src/components, recursively. */
function collect(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) out.push(...collect(path))
    else if (/\.tsx?$/.test(entry)) out.push(path)
  }
  return out
}

const files = collect(TARGET)
  .map((path) => ({
    path: relative(ROOT, path),
    lines: readFileSync(path, 'utf8').split('\n').length,
  }))
  .sort((a, b) => b.lines - a.lines)

const over = files.filter((f) => f.lines > LIMIT)
const pad = Math.max(...files.map((f) => f.path.length))

console.log(`Component size check: limit ${LIMIT} lines\n`)
for (const { path, lines } of files) {
  const bar = lines > LIMIT ? 'OVER' : `${Math.round((lines / LIMIT) * 100)}%`
  console.log(`  ${lines > LIMIT ? '✗' : '✓'} ${path.padEnd(pad)}  ${String(lines).padStart(4)}  ${bar}`)
}

// GitHub renders these as inline annotations on the offending file.
for (const { path, lines } of over) {
  console.log(
    `::error file=${path},line=${LIMIT + 1}::${path} is ${lines} lines, over the ${LIMIT}-line limit. Split it rather than raising the cap.`,
  )
}

// And this becomes the run's summary panel.
if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = files.map((f) => `| \`${f.path}\` | ${f.lines} | ${f.lines > LIMIT ? '❌' : '✅'} |`)
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    [
      `## Component size: limit ${LIMIT} lines`,
      '',
      `${files.length} files checked, ${over.length} over.`,
      '',
      '| File | Lines | |',
      '|---|---:|:-:|',
      ...rows,
      '',
    ].join('\n'),
  )
}

console.log(
  `\n${files.length} file${files.length === 1 ? '' : 's'} checked, ${over.length} over the limit.`,
)
process.exit(over.length > 0 ? 1 : 0)
