# Security Audit Findings

**Date**: March 21, 2026

## 1. `package.json` Dependency Audit
Ran `npm audit` on the project dependencies.

**Results:**
- 79 vulnerabilities found (13 low, 31 moderate, 33 high, 2 critical)
- These vulnerabilities primarily originate from nested dependencies within the Gatsby and Webpack ecosystems typical of static site generators.
- *Recommendation*: While they do not directly expose the static site to runtime attacks once built, it is recommended to run `npm audit fix` periodically and consider updating the base Gatsby template when a newer version is released.

## 2. React Code XSS Vector Audit
- The portfolio was redesigned strictly using CSS/Theme overrides, meaning no new React logic or raw HTML injection vectors (`dangerouslySetInnerHTML`) were introduced in the process.
- Boilerplate information was sanitized by replacing static strings in `gatsby-config.ts`.
- **Finding**: No new Cross-Site Scripting (XSS) vulnerabilities were introduced during the implementation phase. Routine is clean.
