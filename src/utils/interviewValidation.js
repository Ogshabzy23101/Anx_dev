export function validateWrittenAnswer(answer, requiredKeywords) {
  const normalized = answer.toLowerCase();
  const passed = requiredKeywords.filter((keyword) => (
    normalized.includes(keyword.toLowerCase())
  ));
  const missing = requiredKeywords.filter((keyword) => !passed.includes(keyword));

  return {
    isCorrect: missing.length === 0,
    passed,
    missing,
    score: requiredKeywords.length
      ? Math.round((passed.length / requiredKeywords.length) * 100)
      : 0,
  };
}

export function scoreMockInterview(answers, questions) {
  const results = questions.map((question) => ({
    question,
    validation: validateWrittenAnswer(answers[question.id] || "", question.requiredKeywords),
  }));

  const score = results.length
    ? Math.round(results.reduce((total, item) => total + item.validation.score, 0) / results.length)
    : 0;

  const categoryScores = results.reduce((acc, item) => {
    const category = item.question.category;
    const current = acc[category] || { total: 0, count: 0 };
    acc[category] = {
      total: current.total + item.validation.score,
      count: current.count + 1,
    };
    return acc;
  }, {});

  const ranked = Object.entries(categoryScores)
    .map(([category, value]) => ({
      category,
      score: Math.round(value.total / value.count),
    }))
    .sort((a, b) => b.score - a.score);

  return {
    score,
    strongAreas: ranked.filter((item) => item.score >= 70).map((item) => item.category),
    weakAreas: ranked.filter((item) => item.score < 70).map((item) => item.category),
    suggestedModules: ranked
      .filter((item) => item.score < 70)
      .map((item) => questions.find((question) => question.category === item.category)?.relatedModule)
      .filter(Boolean),
    results,
  };
}
