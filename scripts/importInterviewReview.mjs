import { readFileSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { interviewQuestions } from "../src/data/interview.js";
import {
  createReviewedOverrides,
  parseInterviewReviewMarkdown,
  serializeReviewedOverrides,
  validateReviewedQuestions,
} from "../src/utils/interviewReviewWorkflow.js";

const inputArg = process.argv[2];
const outputArg = process.argv[3] || "src/data/interviewReviewedOverrides.js";

if (!inputArg) {
  console.error("Usage: npm run import:interview-review -- <review-file.md|review-file.json> [output-file]");
  process.exit(1);
}

const inputPath = resolve(inputArg);
const outputPath = resolve(outputArg);
const raw = readFileSync(inputPath, "utf8");
const extension = extname(inputPath).toLowerCase();
const reviewedQuestions = extension === ".json"
  ? JSON.parse(raw)
  : parseInterviewReviewMarkdown(raw);

const validation = validateReviewedQuestions(reviewedQuestions, {
  knownIds: interviewQuestions.map((question) => question.id),
});

if (!validation.valid) {
  console.error("Interview review import failed:");
  validation.errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

if (validation.warnings.length) {
  console.warn("Interview review quality warnings:");
  validation.warnings.forEach((warning) => console.warn(`- ${warning}`));
}

const overrides = createReviewedOverrides(reviewedQuestions);
writeFileSync(outputPath, serializeReviewedOverrides(overrides));

console.log(`Imported ${reviewedQuestions.length} reviewed interview answers to ${outputPath}`);
