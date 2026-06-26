import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { interviewQuestions } from "../src/data/interview.js";
import { serializeInterviewReviewMarkdown } from "../src/utils/interviewReviewWorkflow.js";

const outputPath = resolve(process.argv[2] || "docs/interview-question-review.md");
const extension = extname(outputPath).toLowerCase();

const content = extension === ".json"
  ? `${JSON.stringify(interviewQuestions, null, 2)}\n`
  : serializeInterviewReviewMarkdown(interviewQuestions);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, content);

console.log(`Exported ${interviewQuestions.length} interview questions to ${outputPath}`);
