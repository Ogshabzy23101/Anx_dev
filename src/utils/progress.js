export function calculateModuleProgress({
  masteredCount,
  flashcardTotal,
  quizScore,
  completedCommandCount,
  commandTotal,
  completedPracticeCount,
  practiceTotal,
}) {
  const ratios = [
    flashcardTotal ? masteredCount / flashcardTotal : 0,
    quizScore / 100,
    commandTotal ? completedCommandCount / commandTotal : 0,
    practiceTotal ? completedPracticeCount / practiceTotal : 0,
  ];

  return ratios.reduce((total, ratio) => total + ratio, 0) / ratios.length * 100;
}
