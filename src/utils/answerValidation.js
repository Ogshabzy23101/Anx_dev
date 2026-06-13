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

export function getCommandFeedback(answer, expectedAnswer) {
  const userTokens = new Set(normalizeCommand(answer).split(" ").filter(Boolean));
  const expectedTokens = normalizeCommand(expectedAnswer).split(" ").filter(Boolean);

  return {
    passed: expectedTokens.filter((token) => userTokens.has(token)),
    missing: expectedTokens.filter((token) => !userTokens.has(token)),
    expectedValue: expectedAnswer,
    userValue: answer.trim() || "(empty)",
  };
}

export function validatePracticeAnswer(answer, rules) {
  const results = rules.map((rule) => ({
    label: rule.label,
    passed: rule.test ? rule.test(answer) : rule.pattern.test(answer),
  }));
  const passed = results.filter((result) => result.passed).map((result) => result.label);
  const missing = results.filter((result) => !result.passed).map((result) => result.label);

  const validation = {
    isCorrect: missing.length === 0,
    missing,
  };

  Object.defineProperty(validation, "passed", {
    value: passed,
    enumerable: false,
  });

  return validation;
}
