export function calculatePracticeLabStats(progress, labs) {
  const started = progress.practiceLabStartedIds || [];
  const completed = progress.practiceLabCompletedIds || [];
  const failures = progress.practiceLabFailures || {};
  const completedSet = new Set(completed);

  const byDifficulty = {};
  const byCategory = {};

  labs.forEach((lab) => {
    byDifficulty[lab.difficulty] ||= { total: 0, completed: 0, percentage: 0 };
    byCategory[lab.category] ||= { total: 0, completed: 0, percentage: 0, failures: 0 };

    byDifficulty[lab.difficulty].total += 1;
    byCategory[lab.category].total += 1;

    if (completedSet.has(lab.id)) {
      byDifficulty[lab.difficulty].completed += 1;
      byCategory[lab.category].completed += 1;
    }
  });

  Object.values(byDifficulty).forEach((item) => {
    item.percentage = item.total ? Math.round((item.completed / item.total) * 100) : 0;
  });

  Object.entries(byCategory).forEach(([category, item]) => {
    item.failures = failures[category] || 0;
    item.percentage = item.total ? Math.round((item.completed / item.total) * 100) : 0;
  });

  const recommendedPracticeAreas = Object.entries(byCategory)
    .filter(([, item]) => item.percentage < 50 || item.failures >= 2)
    .sort((a, b) => {
      const failureDiff = b[1].failures - a[1].failures;
      if (failureDiff) return failureDiff;
      return a[1].percentage - b[1].percentage;
    })
    .slice(0, 5)
    .map(([category]) => category);

  return {
    startedCount: started.length,
    completedCount: completed.length,
    totalCount: labs.length,
    completionPercentage: labs.length ? Math.round((completed.length / labs.length) * 100) : 0,
    difficultyCompletion: byDifficulty,
    categoryCompletion: byCategory,
    recommendedPracticeAreas,
  };
}
