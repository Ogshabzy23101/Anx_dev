import { lazy, Suspense, useMemo, useState } from "react";
import CorrectionModal from "./components/CorrectionModal";
import EmptyState from "./components/shared/EmptyState";
import LoadingState from "./components/shared/LoadingState";
import ProgressSummary from "./components/shared/ProgressSummary";
import { moduleStats, learningModuleIds, practiceLabStats } from "./data/moduleStats";
import { tools } from "./data/tools";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { calculateModuleProgress } from "./utils/progress";
import { initialProgress, migrateProgress } from "./utils/progressMigration";

const LazyLearningModule = lazy(() => import("./components/LazyLearningModule"));
const InterviewLab = lazy(() => import("./components/InterviewLab"));
const PracticeLabs = lazy(() => import("./components/PracticeLabs"));

const loadedToolIds = new Set([
  ...learningModuleIds,
  "interview",
  "practice-labs",
]);

function lengthOf(value) {
  return Array.isArray(value) ? value.length : 0;
}

function calculateTrackedModuleProgress(progress, stats) {
  return calculateModuleProgress({
    masteredCount: lengthOf(progress[stats.masteredKey]),
    flashcardTotal: stats.flashcardTotal,
    quizScore: progress[stats.quizScoreKey] || 0,
    completedCommandCount: lengthOf(progress[stats.completedCommandKey]),
    commandTotal: stats.commandTotal,
    completedPracticeCount: lengthOf(progress[stats.completedPracticeKey]),
    practiceTotal: stats.practiceTotal,
  });
}

function calculatePracticeLabsProgress(progress) {
  const completed =
    lengthOf(progress.practiceLabCompletedIds) +
    lengthOf(progress.dockerPracticeLabCompletedIds);
  const total = practiceLabStats.linux + practiceLabStats.docker;

  return total ? Math.round((completed / total) * 100) : 0;
}

function calculateInterviewProgress(progress) {
  const total = moduleStats.interview.questionTotal;
  const practiced = lengthOf(progress.interviewPracticedIds);
  return total ? Math.round((practiced / total) * 100) : 0;
}

function getProgressSummary(progress, trackedTool) {
  if (trackedTool === "interview") {
    const practiced = lengthOf(progress.interviewPracticedIds);
    const total = moduleStats.interview.questionTotal;
    const score = calculateInterviewProgress(progress);

    return {
      label: moduleStats.interview.label,
      cards: practiced,
      score,
      commandScore: score,
      detail: `${practiced}/${total} questions practiced`,
    };
  }

  if (trackedTool === "practice-labs") {
    const completed =
      lengthOf(progress.practiceLabCompletedIds) +
      lengthOf(progress.dockerPracticeLabCompletedIds);
    const started =
      lengthOf(progress.practiceLabStartedIds) +
      lengthOf(progress.dockerPracticeLabStartedIds);
    const score = calculatePracticeLabsProgress(progress);

    return {
      label: moduleStats["practice-labs"].label,
      cards: started,
      score,
      commandScore: score,
      detail: `${started} labs started · ${completed} labs complete`,
    };
  }

  const stats = moduleStats[trackedTool];
  const commandScore = stats.commandScoreKey
    ? progress[stats.commandScoreKey] || 0
    : Math.round((lengthOf(progress[stats.completedCommandKey]) / stats.commandTotal) * 100);

  return {
    label: stats.label,
    cards: lengthOf(progress[stats.masteredKey]),
    score: progress[stats.quizScoreKey] || 0,
    commandScore,
    detail: `${lengthOf(progress[stats.masteredKey])} cards · ${progress[stats.quizScoreKey] || 0}% MCQ · ${commandScore}% commands`,
  };
}

export default function App() {
  const [activeTool, setActiveTool] = useState("linux");
  const [correction, setCorrection] = useState(null);
  const [progress, setProgress] = useLocalStorage(
    "devops-lab-progress-v1",
    initialProgress,
    migrateProgress,
  );

  const moduleProgress = useMemo(() => {
    const trackedProgress = Object.fromEntries(
      Object.entries(moduleStats)
        .filter(([id]) => id !== "practice-labs" && id !== "interview")
        .map(([id, stats]) => [id, calculateTrackedModuleProgress(progress, stats)]),
    );

    return {
      ...trackedProgress,
      "practice-labs": calculatePracticeLabsProgress(progress),
      interview: calculateInterviewProgress(progress),
    };
  }, [progress]);

  const activeToolData = tools.find((tool) => tool.id === activeTool);
  const trackedTool = loadedToolIds.has(activeTool) ? activeTool : "linux";
  const progressSummary = getProgressSummary(progress, trackedTool);

  function renderActiveTool() {
    if (learningModuleIds.includes(activeTool)) {
      return (
        <LazyLearningModule
          moduleId={activeTool}
          progress={progress}
          setProgress={setProgress}
          onWrong={setCorrection}
        />
      );
    }

    if (activeTool === "interview") {
      return <InterviewLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />;
    }

    if (activeTool === "practice-labs") {
      return <PracticeLabs progress={progress} setProgress={setProgress} />;
    }

    return (
      <EmptyState
        eyebrow="module pending"
        prompt={`$ ${activeToolData.prompt} --learn`}
        title={`${activeToolData.label} lab is being provisioned.`}
      >
        <p>The navigation is live. Lessons, drills, and hands-on scenarios will plug into this module next.</p>
        <button className="ghost-button" type="button" onClick={() => setActiveTool("linux")}>
          Return to Linux
        </button>
      </EmptyState>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="DevOps Learning Lab home">
          <span className="brand-icon">&gt;_</span>
          <span>
            <strong>DevOps</strong>
            <small>Learning Lab</small>
          </span>
        </a>
        <div className="session-status"><span /> session active</div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-label">toolchain</div>
          <nav aria-label="DevOps tools">
            {tools.map((tool) => (
              <button
                className={activeTool === tool.id ? "active" : ""}
                type="button"
                key={tool.id}
                aria-label={tool.label}
                aria-pressed={activeTool === tool.id}
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="tool-prompt" aria-hidden="true">
                  {activeTool === tool.id ? ">" : "$"}
                </span>
                {tool.label}
                {!loadedToolIds.has(tool.id) && (
                  <span className="lock-mark" aria-hidden="true">soon</span>
                )}
              </button>
            ))}
          </nav>
          <ProgressSummary
            value={moduleProgress[trackedTool]}
            label={`${progressSummary.label} progress`}
          >
            <p>{progressSummary.detail}</p>
          </ProgressSummary>
        </aside>

        <main>
          <Suspense fallback={<LoadingState />}>
            {renderActiveTool()}
          </Suspense>
        </main>
      </div>

      <CorrectionModal correction={correction} onClose={() => setCorrection(null)} />
    </div>
  );
}
