import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { interviewQuestions } from "../src/data/interview.js";

const outputPath = resolve("docs/interview-question-review.md");

function list(values) {
  return values?.length ? values.join(", ") : "None";
}

function section(question) {
  return `## ${question.id}

- **Category:** ${question.category}
- **Difficulty:** ${question.difficulty}
- **Question:** ${question.question}
- **Current short answer:** ${question.shortAnswer}
- **Current detailed answer:** ${question.detailedAnswer}
- **Example:** ${question.example}
- **Common mistake:** ${question.commonMistake}
- **Interview tip:** ${question.interviewTip}
- **Required keywords:** ${list(question.requiredKeywords)}
- **Related module:** ${question.relatedModule}
`;
}

const content = `# Interview Question Review

This file is generated from \`src/data/interview.js\`.

Use it for human review of Interview Mode answers. Edit this Markdown file freely during review, then copy approved improvements back into \`src/data/interview.js\` and rerun tests.

Total questions: ${interviewQuestions.length}

${interviewQuestions.map(section).join("\n")}
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, content);

console.log(`Exported ${interviewQuestions.length} interview questions to ${outputPath}`);
