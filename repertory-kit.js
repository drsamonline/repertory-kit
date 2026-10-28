/* repertory-kit — the homeopathic repertorisation core. Zero dependencies.
 *
 * The shared logic behind every repertory app (Kent, Boericke, remedy
 * relationships, the companion apps): rubric grading and grade-weighted remedy
 * scoring — the "repertorisation" a homeopath actually does.
 *
 *   const rk = Repertory.analyse([
 *     { name: "Head, pain, bursting", remedies: [["Bell", 3], ["Apis", 2]] },
 *     { name: "Head, pain, < motion", remedies: [["Bry", 3], ["Bell", 1]] }
 *   ]);
 *   rk.remedies[0].remedy;   // "Bell" — highest total
 *
 * Grades follow the classical 1/2/3 (plain / italics / bold).
 *
 * PolyForm Noncommercial 1.0.0. (c) 2026 Dr Sohil Momin.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Repertory = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var R = { version: "0.1.0" };

  function norm(s) { return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim(); }

  /* Accept ["Bell",3] or {remedy:"Bell",grade:3}. */
  function rx(x) {
    if (Array.isArray(x)) return { remedy: String(x[0]), grade: x[1] == null ? 1 : Number(x[1]) };
    return { remedy: String(x.remedy), grade: x.grade == null ? 1 : Number(x.grade) };
  }
  R.rubric = function (name, remedies) {
    return { name: String(name), remedies: (remedies || []).map(rx) };
  };

  /* Analyse a set of rubrics into a ranked remedy list.
   * opts.minGrade   - ignore links below this grade (default 1)
   * opts.mustHave   - remedy names that must appear in EVERY rubric
   * opts.exclude    - remedy names to drop entirely
   * opts.limit      - cap the result length
   */
  R.analyse = function (rubrics, opts) {
    opts = opts || {};
    var minGrade = opts.minGrade || 1;
    var must = (opts.mustHave || []).map(norm);
    var excl = {}; (opts.exclude || []).forEach(function (n) { excl[norm(n)] = 1; });
    rubrics = rubrics || [];

    var byRemedy = {};
    var rubricHits = {};
    rubrics.forEach(function (rub, ri) {
      (rub.remedies || []).map(rx).forEach(function (link) {
        if (link.grade < minGrade) return;
        var k = norm(link.remedy);
        if (excl[k]) return;
        if (!byRemedy[k]) byRemedy[k] = { remedy: link.remedy, total: 0, count: 0, rubrics: [] };
        byRemedy[k].total += link.grade;
        byRemedy[k].count += 1;
        byRemedy[k].rubrics.push({ name: rub.name, grade: link.grade });
        rubricHits[k] = (rubricHits[k] || 0) + 1;
      });
    });

    var list = Object.keys(byRemedy).map(function (k) {
      var r = byRemedy[k];
      r.coverage = rubrics.length ? rubricHits[k] / rubrics.length : 0;
      return r;
    });
    if (must.length) {
      list = list.filter(function (r) { return must.indexOf(norm(r.remedy)) !== -1 && r.count === rubrics.length; });
    }
    list.sort(function (a, b) {
      return (b.total - a.total) || (b.count - a.count) || a.remedy.localeCompare(b.remedy);
    });
    if (opts.limit) list = list.slice(0, opts.limit);
    return { rubricCount: rubrics.length, remedies: list };
  };

  /* A convenience for apps that hold a big rubric corpus: pick the rubrics whose
   * names match any of the given terms, then analyse them. */
  R.select = function (corpus, terms, opts) {
    opts = opts || {};
    var want = (terms || []).map(norm);
    var picked = (corpus || []).filter(function (rub) {
      var n = norm(rub.name);
      return want.some(function (t) { return t && n.indexOf(t) !== -1; });
    });
    return R.analyse(picked, opts);
  };

  /* Merge duplicate rubrics (same name) into one, keeping the highest grade. */
  R.merge = function (rubrics) {
    var out = {}, order = [];
    (rubrics || []).forEach(function (rub) {
      var k = norm(rub.name);
      if (!out[k]) { out[k] = { name: rub.name, remedies: {} }; order.push(k); }
      (rub.remedies || []).map(rx).forEach(function (l) {
        var rk = norm(l.remedy);
        if (!out[k].remedies[rk] || l.grade > out[k].remedies[rk].grade) out[k].remedies[rk] = l;
      });
    });
    return order.map(function (k) {
      return { name: out[k].name, remedies: Object.keys(out[k].remedies).map(function (r) { return out[k].remedies[r]; }) };
    });
  };

  return R;
});
