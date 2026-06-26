export default function PracticeProgress({ stats }) {
  return (
    <section className="interview-progress terminal-card">
      <span>{stats.startedCount} started</span>
      <span>{stats.completedCount} complete</span>
      <span>{stats.completionPercentage}% done</span>
      <span>{stats.difficultyCompletion.Beginner?.percentage || 0}% beginner</span>
      <span>{stats.difficultyCompletion.Advanced?.percentage || 0}% advanced</span>
    </section>
  );
}
