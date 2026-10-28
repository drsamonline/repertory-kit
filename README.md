# repertory-kit

[![live](https://img.shields.io/badge/live-online-22c55e)](https://drsamonline.github.io/repertory-kit/)
[![test](https://github.com/drsamonline/repertory-kit/actions/workflows/test.yml/badge.svg)](https://github.com/drsamonline/repertory-kit/actions/workflows/test.yml)
[![License: PolyForm Noncommercial 1.0.0](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-blue)](LICENSE)

**The homeopathic repertorisation core.** Zero dependencies. One file. Rubric grading (1/2/3) and grade-weighted remedy scoring — the shared logic
extracted from the drsamonline apps that repeat it.

## Use it

See `repertory-kit.js` for the full API and `test-node.js` for worked examples.

## What it does

- Grade-weighted remedy scoring
- must-have / exclude filters
- merge duplicate rubrics
- select rubrics by name

## Verified

```
node test-node.js
12 passed, 0 failed
```

## Consumers

kent-repertory-explorer, boericke-repertory, remedy-relationship-explorer, open-materia-medica, MATERIA-MEDICA-BUILDER, mnemosyne-companion

## Licence

MIT. (c) 2026 Dr Sohil Momin. Part of the Forge system — kits open, orchestrator licensed.
