const moduleRequiredCollections = [
  "reference.notes",
  "reference.commands",
  "flashcards",
  "multipleChoice",
  "commandQuiz",
  "practice.tasks",
];

const requiredFields = {
  note: ["id", "module", "title", "category", "difficulty", "summary"],
  command: ["id", "module", "command", "category", "difficulty", "syntax"],
  flashcard: ["id"],
  multipleChoice: ["id", "question", "options", "answer", "explanation"],
  commandQuiz: ["id", "prompt"],
  exercise: ["id", "title", "instruction"],
  interviewQuestion: [
    "id",
    "category",
    "difficulty",
    "question",
    "shortAnswer",
    "detailedAnswer",
    "example",
    "commonMistake",
    "interviewTip",
    "requiredKeywords",
    "relatedModule",
    "reviewStatus",
  ],
};

function readPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "";
}

function validateRequiredFields(items, fields, label) {
  return items.flatMap((item, index) => (
    fields
      .filter((field) => !hasValue(item[field]))
      .map((field) => `${label}[${item.id || index}] missing ${field}`)
  ));
}

export function validateLearningModule(module) {
  const errors = [];

  moduleRequiredCollections.forEach((path) => {
    const value = readPath(module, path);
    if (!Array.isArray(value) || value.length === 0) {
      errors.push(`${module.id} missing ${path}`);
    }
  });

  errors.push(
    ...validateRequiredFields(module.reference.notes, requiredFields.note, `${module.id}.notes`),
    ...validateRequiredFields(module.reference.commands, requiredFields.command, `${module.id}.commands`),
    ...validateRequiredFields(module.flashcards, requiredFields.flashcard, `${module.id}.flashcards`),
    ...validateRequiredFields(module.multipleChoice, requiredFields.multipleChoice, `${module.id}.mcq`),
    ...validateRequiredFields(module.commandQuiz, requiredFields.commandQuiz, `${module.id}.commandsQuiz`),
    ...validateRequiredFields(module.practice.tasks, requiredFields.exercise, `${module.id}.practice`),
  );

  module.flashcards.forEach((card, index) => {
    if (!hasValue(card.question) && !hasValue(card.front)) {
      errors.push(`${module.id}.flashcards[${card.id || index}] missing question/front`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateLearningModules(modules) {
  const results = modules.map(validateLearningModule);
  const errors = results.flatMap((result) => result.errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateInterviewQuestions(questions) {
  const errors = validateRequiredFields(
    questions,
    requiredFields.interviewQuestion,
    "interview.questions",
  );

  return {
    valid: errors.length === 0,
    errors,
  };
}
