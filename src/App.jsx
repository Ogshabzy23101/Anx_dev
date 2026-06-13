import { useMemo, useState } from "react";
import CorrectionModal from "./components/CorrectionModal";
import DockerLab from "./components/DockerLab";
import KubernetesLab from "./components/KubernetesLab";
import LinuxLab from "./components/LinuxLab";
import ProgressBar from "./components/ProgressBar";
import {
  dockerCommandQuiz,
  dockerFilePractice,
  dockerFlashcards,
} from "./data/docker";
import { linuxCommandQuiz, linuxFlashcards } from "./data/linux";
import { linuxShellPractice } from "./data/linuxPractice";
import {
  kubernetesCommandQuiz,
  kubernetesFlashcards,
  kubernetesManifestPractice,
} from "./data/kubernetes";
import { tools } from "./data/tools";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { calculateModuleProgress } from "./utils/progress";

const initialProgress = {
  masteredFlashcards: [],
  quizScore: 0,
  completedCommands: [],
  completedPractices: [],
  dockerMasteredFlashcards: [],
  dockerQuizScore: 0,
  dockerCompletedCommands: [],
  dockerCompletedPractices: [],
  kubernetesMasteredFlashcards: [],
  kubernetesQuizScore: 0,
  kubernetesCompletedCommands: [],
  kubernetesCommandScore: 0,
  kubernetesCompletedManifests: [],
};

export default function App() {
  const [activeTool, setActiveTool] = useState("linux");
  const [correction, setCorrection] = useState(null);
  const [progress, setProgress] = useLocalStorage("devops-lab-progress-v1", initialProgress);

  const moduleProgress = useMemo(() => {
    const linux = calculateModuleProgress({
      masteredCount: progress.masteredFlashcards.length,
      flashcardTotal: linuxFlashcards.length,
      quizScore: progress.quizScore,
      completedCommandCount: progress.completedCommands.length,
      commandTotal: linuxCommandQuiz.length,
      completedPracticeCount: progress.completedPractices.length,
      practiceTotal: linuxShellPractice.length,
    });

    const docker = calculateModuleProgress({
      masteredCount: progress.dockerMasteredFlashcards.length,
      flashcardTotal: dockerFlashcards.length,
      quizScore: progress.dockerQuizScore,
      completedCommandCount: progress.dockerCompletedCommands.length,
      commandTotal: dockerCommandQuiz.length,
      completedPracticeCount: progress.dockerCompletedPractices.length,
      practiceTotal: dockerFilePractice.length,
    });

    const kubernetes = calculateModuleProgress({
      masteredCount: progress.kubernetesMasteredFlashcards.length,
      flashcardTotal: kubernetesFlashcards.length,
      quizScore: progress.kubernetesQuizScore,
      completedCommandCount: progress.kubernetesCompletedCommands.length,
      commandTotal: kubernetesCommandQuiz.length,
      completedPracticeCount: progress.kubernetesCompletedManifests.length,
      practiceTotal: kubernetesManifestPractice.length,
    });

    return { linux, docker, kubernetes };
  }, [progress]);

  const activeToolData = tools.find((tool) => tool.id === activeTool);
  const trackedTool = ["linux", "docker", "kubernetes"].includes(activeTool)
    ? activeTool
    : "linux";
  const progressSummary = {
    linux: {
      label: "Linux",
      cards: progress.masteredFlashcards.length,
      score: progress.quizScore,
      commandScore: Math.round(
        progress.completedCommands.length / linuxCommandQuiz.length * 100,
      ),
    },
    docker: {
      label: "Docker",
      cards: progress.dockerMasteredFlashcards.length,
      score: progress.dockerQuizScore,
      commandScore: Math.round(
        progress.dockerCompletedCommands.length / dockerCommandQuiz.length * 100,
      ),
    },
    kubernetes: {
      label: "Kubernetes",
      cards: progress.kubernetesMasteredFlashcards.length,
      score: progress.kubernetesQuizScore,
      commandScore: progress.kubernetesCommandScore,
    },
  }[trackedTool];

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
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="tool-prompt" aria-hidden="true">
                  {activeTool === tool.id ? ">" : "$"}
                </span>
                {tool.label}
                {!["linux", "docker", "kubernetes"].includes(tool.id) && (
                  <span className="lock-mark" aria-hidden="true">soon</span>
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-progress">
            <ProgressBar
              value={moduleProgress[trackedTool]}
              label={`${progressSummary.label} progress`}
            />
            <p>
              {progressSummary.cards} cards · {progressSummary.score}% MCQ ·{" "}
              {progressSummary.commandScore}% commands
            </p>
          </div>
        </aside>

        <main>
          {activeTool === "linux" ? (
            <LinuxLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
          ) : activeTool === "docker" ? (
            <DockerLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
          ) : activeTool === "kubernetes" ? (
            <KubernetesLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
          ) : (
            <section className="empty-tool">
              <div className="terminal-card">
                <span className="eyebrow">module pending</span>
                <div className="large-prompt">$ {activeToolData.prompt} --learn</div>
                <h1>{activeToolData.label} lab is being provisioned.</h1>
                <p>The navigation is live. Lessons, drills, and hands-on scenarios will plug into this module next.</p>
                <button className="ghost-button" type="button" onClick={() => setActiveTool("linux")}>
                  Return to Linux
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      <CorrectionModal correction={correction} onClose={() => setCorrection(null)} />
    </div>
  );
}
