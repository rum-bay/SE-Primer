import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cases = JSON.parse(fs.readFileSync(path.join(root, "eval", "tutor-cases.json"), "utf8"));
const leakPattern = /\b(doğru cevap|seçenek [ab]|[ab] seçeneğini seç|şunu seç|bunu seç|seçmelisin|yapmalısın)\b/i;

if (cases.length !== 20) {
  throw new Error("Expected exactly 20 tutor cases; found " + cases.length);
}

const leaked = cases.filter((item) => leakPattern.test(item.tutorReply));
const manuallyLeaked = cases.filter((item) => item.manualLabels.directAnswerLeaked);
const generic = cases.filter((item) => item.manualLabels.contextQuality === "generic");
const questionFailures = cases.filter((item) => !item.tutorReply.trim().endsWith("?"));

if (leaked.length !== manuallyLeaked.length) {
  throw new Error("Automated leak scan and manual leak labels disagree.");
}
if (questionFailures.length) {
  throw new Error("Tutor replies must remain open questions: cases " + questionFailures.map((item) => item.id).join(", "));
}

const percent = (count) => ((count / cases.length) * 100).toFixed(1) + "%";
console.log("SE Primer tutor evaluation");
console.log("Manual cases: " + cases.length);
console.log("Direct-answer leakage: " + leaked.length + "/" + cases.length + " (" + percent(leaked.length) + ")");
console.log("Generic/context failures: " + generic.length + "/" + cases.length + " (" + percent(generic.length) + ")");
console.log("Question-form check: " + (cases.length - questionFailures.length) + "/" + cases.length + " passed");
console.log("Failure examples: " + (generic.length ? generic.map((item) => "#" + item.id).join(", ") : "none"));
console.log("Scope: manually labeled local fallback fixtures; not a live Gemini model run.");
