# repertory-kit — API reference

**Version 1.0.0.** **The homeopathic repertorisation core.** Zero dependencies. One file. Rubric grading (1/2/3) and grade-weighted remedy scoring — the shared logic extracted from the drsamonline apps that repeat it.

Generated from the source in this repository: every name, argument and
note below is read out of the kit file, so it cannot describe a function
that is not there.

```js
<script src="repertory-kit.js"></script>
Repertory.rubric(...)
// or: const Repertory = require('./repertory-kit.js')
```

## The surface (4 entries)

| Name | Arguments | What it does |
|---|---|---|
| `Repertory.rubric` | `(name, remedies)` | — |
| `Repertory.analyse` | `(rubrics, opts)` | Analyse a set of rubrics into a ranked remedy list. opts.minGrade - ignore links below this grade (default 1) opts.mustHave - remedy names that must appear in EVERY rubric opts.exclude - remedy names  |
| `Repertory.select` | `(corpus, terms, opts)` | A convenience for apps that hold a big rubric corpus: pick the rubrics whose names match any of the given terms, then analyse them. |
| `Repertory.merge` | `(rubrics)` | Merge duplicate rubrics (same name) into one, keeping the highest grade. |

## Notes

- Zero dependencies, one file, no build step: it works from `file://`, from a
  `<script>` tag and from Node.
- The version above is the `VERSION` file in this repository; a pinned copy is
  what an app vendors.
