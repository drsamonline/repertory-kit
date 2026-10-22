const R = require(require("path").join(__dirname, "repertory-kit.js"));
let pass = 0, fail = 0;
function ok(n, c, e) { c ? (pass++, console.log("PASS  " + n + (e ? "  (" + e + ")" : ""))) : (fail++, console.log("FAIL  " + n + (e ? "  (" + e + ")" : ""))); }

const rubrics = [
  R.rubric("Head, pain, bursting", [["Bell", 3], ["Apis", 2], ["Bry", 1]]),
  R.rubric("Head, pain, < motion", [["Bry", 3], ["Bell", 1]]),
  R.rubric("Head, pain, > pressure", [["Bell", 2], ["Apis", 3]]),
];

const r = R.analyse(rubrics);
ok("returns a ranked list", r.remedies.length === 3);
ok("Bell is first (3+1+2 = 6)", r.remedies[0].remedy === "Bell" && r.remedies[0].total === 6, r.remedies[0].remedy + "=" + r.remedies[0].total);
ok("totals are grade-weighted", r.remedies.find(x => x.remedy === "Bry").total === 4);
ok("count tracks rubrics present", r.remedies.find(x => x.remedy === "Bell").count === 3);
ok("coverage is a fraction", r.remedies.find(x => x.remedy === "Apis").coverage === 2 / 3);

const hi = R.analyse(rubrics, { minGrade: 3 });
ok("minGrade filters links", hi.remedies.every(x => x.rubrics.every(y => y.grade >= 3)));
ok("minGrade counts only high links (Apis = its grade-3 only)", hi.remedies.find(x => x.remedy === "Apis").total === 3);

const ex = R.analyse(rubrics, { exclude: ["Bell"] });
ok("exclude removes a remedy", !ex.remedies.find(x => x.remedy === "Bell"));

const must = R.analyse(rubrics, { mustHave: ["Bell"] });
ok("mustHave keeps only full-coverage remedies", must.remedies.length === 1 && must.remedies[0].remedy === "Bell");

const lim = R.analyse(rubrics, { limit: 2 });
ok("limit caps the list", lim.remedies.length === 2);

const merged = R.merge([
  R.rubric("Head, pain", [["Bell", 1]]),
  R.rubric("head,  pain", [["Bell", 3], ["Apis", 2]]),
]);
ok("merge de-duplicates by normalised name", merged.length === 1 && merged[0].remedies.find(x => x.remedy === "Bell").grade === 3);

const sel = R.select(rubrics.map(x => x), ["motion"]);
ok("select matches rubric names", sel.rubricCount === 1 && sel.remedies[0].remedy === "Bry");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
