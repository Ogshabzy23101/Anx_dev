export function isMultipleChoiceCorrect(question, selectedIndex) {
  return selectedIndex === question.answer;
}

export function normalizeCommand(command) {
  return command.trim().replace(/\s+/g, " ");
}

export function isCommandCorrect(answer, acceptedAnswers) {
  const normalized = normalizeCommand(answer);
  return acceptedAnswers.some(
    (acceptedAnswer) => normalizeCommand(acceptedAnswer) === normalized,
  );
}

export function validatePracticeAnswer(answer, rules) {
  const missing = rules
    .filter((rule) => {
      if (rule.test) return !rule.test(answer);
      return !rule.pattern.test(answer);
    })
    .map((rule) => rule.label);

  return {
    isCorrect: missing.length === 0,
    missing,
  };
}
