export const interviewReviewStatuses = [
  "generated",
  "needs-review",
  "reviewed",
  "approved",
];

export const reviewedAnswerFields = [
  "id",
  "category",
  "difficulty",
  "question",
  "shortAnswer",
  "detailedAnswer",
  "beginnerExplanation",
  "professionalExplanation",
  "realWorldExample",
  "commands",
  "followUpQuestions",
  "commonMistakes",
  "interviewTip",
  "requiredKeywords",
  "relatedModule",
  "reviewStatus",
];

const requiredStringFields = [
  "id",
  "category",
  "difficulty",
  "question",
  "shortAnswer",
  "detailedAnswer",
  "beginnerExplanation",
  "professionalExplanation",
  "realWorldExample",
  "interviewTip",
  "relatedModule",
  "reviewStatus",
];

const requiredArrayFields = [
  "commands",
  "followUpQuestions",
  "commonMistakes",
  "requiredKeywords",
];

const genericPhrases = [
  "Explain the concept clearly",
  "A strong answer should mention",
  "connect it to real operational work",
  "affect reliability, repeatability, or delivery speed",
];

function words(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean);
}

function toArray(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string") {
    if (!value.trim() || value.trim().toLowerCase() === "none") return [];
    return value.split(/\s*,\s*/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeReviewStatus(status) {
  return interviewReviewStatuses.includes(status) ? status : "needs-review";
}

export function normalizeReviewedQuestion(question) {
  const commonMistakes = toArray(question.commonMistakes || question.commonMistake);
  const realWorldExample = question.realWorldExample || question.example || "";

  return {
    id: question.id,
    category: question.category,
    difficulty: question.difficulty,
    question: question.question,
    shortAnswer: question.shortAnswer || "",
    detailedAnswer: question.detailedAnswer || "",
    beginnerExplanation: question.beginnerExplanation || question.shortAnswer || "",
    professionalExplanation: question.professionalExplanation || question.detailedAnswer || "",
    realWorldExample,
    example: question.example || realWorldExample,
    commands: toArray(question.commands),
    followUpQuestions: toArray(question.followUpQuestions),
    commonMistakes,
    commonMistake: question.commonMistake || commonMistakes[0] || "",
    interviewTip: question.interviewTip || "",
    requiredKeywords: toArray(question.requiredKeywords),
    relatedModule: question.relatedModule,
    reviewStatus: normalizeReviewStatus(question.reviewStatus),
  };
}

export function detectDuplicateQuestionIds(questions) {
  const seen = new Set();
  const duplicates = new Set();

  questions.forEach((question) => {
    if (!question.id) return;
    if (seen.has(question.id)) duplicates.add(question.id);
    seen.add(question.id);
  });

  return [...duplicates];
}

export function checkInterviewAnswerQuality(question) {
  const normalized = normalizeReviewedQuestion(question);
  const combinedAnswer = [
    normalized.shortAnswer,
    normalized.detailedAnswer,
    normalized.beginnerExplanation,
    normalized.professionalExplanation,
    normalized.realWorldExample,
  ].join(" ");
  const issues = [];

  if (words(normalized.shortAnswer).length < 8) issues.push("shortAnswer is too short");
  if (words(normalized.detailedAnswer).length < 25) issues.push("detailedAnswer is too short");
  if (!hasText(normalized.realWorldExample)) issues.push("missing realWorldExample");
  if (!normalized.commonMistakes.length) issues.push("missing commonMistakes");
  if (!hasText(normalized.interviewTip)) issues.push("missing interviewTip");
  if (!normalized.requiredKeywords.length) issues.push("missing requiredKeywords");

  genericPhrases.forEach((phrase) => {
    if (combinedAnswer.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`contains placeholder wording: ${phrase}`);
    }
  });

  normalized.requiredKeywords.forEach((keyword) => {
    if (!combinedAnswer.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push(`missing required keyword in answer: ${keyword}`);
    }
  });

  return issues;
}

export function validateReviewedQuestions(questions, { knownIds } = {}) {
  const errors = [];
  const warnings = [];
  const ids = knownIds ? new Set(knownIds) : null;
  const duplicates = detectDuplicateQuestionIds(questions);

  duplicates.forEach((id) => errors.push(`duplicate question id: ${id}`));

  questions.forEach((question, index) => {
    const normalized = normalizeReviewedQuestion(question);
    const label = normalized.id || `index ${index}`;

    if (ids && normalized.id && !ids.has(normalized.id)) {
      errors.push(`${label}: unknown question id`);
    }

    requiredStringFields.forEach((field) => {
      if (!hasText(normalized[field])) errors.push(`${label}: missing ${field}`);
    });

    requiredArrayFields.forEach((field) => {
      if (!normalized[field].length) errors.push(`${label}: missing ${field}`);
    });

    if (question.reviewStatus && !interviewReviewStatuses.includes(question.reviewStatus)) {
      errors.push(`${label}: invalid reviewStatus`);
    }

    checkInterviewAnswerQuality(normalized).forEach((issue) => {
      warnings.push(`${label}: ${issue}`);
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function labelFor(field) {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatList(values) {
  const list = toArray(values);
  return list.length ? list.join(", ") : "None";
}

export function serializeInterviewReviewMarkdown(questions) {
  const sections = questions.map((question) => {
    const normalized = normalizeReviewedQuestion(question);
    return `## ${normalized.id}

- **Category:** ${normalized.category}
- **Difficulty:** ${normalized.difficulty}
- **Question:** ${normalized.question}
- **Review status:** ${normalized.reviewStatus}
- **Short answer:** ${normalized.shortAnswer}
- **Detailed answer:** ${normalized.detailedAnswer}
- **Beginner explanation:** ${normalized.beginnerExplanation}
- **Professional explanation:** ${normalized.professionalExplanation}
- **Real world example:** ${normalized.realWorldExample}
- **Commands:** ${formatList(normalized.commands)}
- **Follow-up questions:** ${formatList(normalized.followUpQuestions)}
- **Common mistakes:** ${formatList(normalized.commonMistakes)}
- **Interview tip:** ${normalized.interviewTip}
- **Required keywords:** ${formatList(normalized.requiredKeywords)}
- **Related module:** ${normalized.relatedModule}
`;
  });

  return `# Interview Question Review

This file is generated from \`src/data/interview.js\`.

Use it for human review of Interview Mode answers. Edit this Markdown file freely during review, then import approved improvements with \`npm run import:interview-review -- docs/interview-question-review.md\`.

Total questions: ${questions.length}

${sections.join("\n")}
`;
}

const labelToField = new Map([
  ["category", "category"],
  ["difficulty", "difficulty"],
  ["question", "question"],
  ["review status", "reviewStatus"],
  ["current short answer", "shortAnswer"],
  ["short answer", "shortAnswer"],
  ["current detailed answer", "detailedAnswer"],
  ["detailed answer", "detailedAnswer"],
  ["beginner explanation", "beginnerExplanation"],
  ["professional explanation", "professionalExplanation"],
  ["real world example", "realWorldExample"],
  ["example", "realWorldExample"],
  ["commands", "commands"],
  ["follow-up questions", "followUpQuestions"],
  ["follow up questions", "followUpQuestions"],
  ["common mistake", "commonMistakes"],
  ["common mistakes", "commonMistakes"],
  ["interview tip", "interviewTip"],
  ["required keywords", "requiredKeywords"],
  ["related module", "relatedModule"],
]);

export function parseInterviewReviewMarkdown(markdown) {
  return String(markdown)
    .split(/^##\s+/m)
    .slice(1)
    .map((section) => {
      const [idLine, ...lines] = section.split("\n");
      const question = { id: idLine.trim() };

      lines.forEach((line) => {
        const match = line.match(/^-\s+\*\*(.+?):\*\*\s*(.*)$/);
        if (!match) return;

        const field = labelToField.get(match[1].trim().toLowerCase());
        if (!field) return;

        question[field] = ["commands", "followUpQuestions", "commonMistakes", "requiredKeywords"].includes(field)
          ? toArray(match[2])
          : match[2].trim();
      });

      return normalizeReviewedQuestion(question);
    });
}

export function mergeReviewedQuestions(currentQuestions, reviewedQuestions) {
  const reviewedById = new Map(reviewedQuestions.map((question) => [question.id, normalizeReviewedQuestion(question)]));

  return currentQuestions.map((question) => ({
    ...normalizeReviewedQuestion(question),
    ...(reviewedById.get(question.id) || {}),
    id: question.id,
  }));
}

export function createReviewedOverrides(questions) {
  return Object.fromEntries(questions.map((question) => {
    const normalized = normalizeReviewedQuestion(question);
    return [
      normalized.id,
      Object.fromEntries(
        reviewedAnswerFields
          .filter((field) => field !== "id")
          .map((field) => [field, normalized[field]]),
      ),
    ];
  }));
}

export function serializeReviewedOverrides(overrides) {
  return `export const interviewReviewedOverrides = ${JSON.stringify(overrides, null, 2)};\n`;
}
