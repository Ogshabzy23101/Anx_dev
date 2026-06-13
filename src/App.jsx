import { useMemo, useState } from "react";
import CorrectionModal from "./components/CorrectionModal";
import DockerLab from "./components/DockerLab";
import LinuxLab from "./components/LinuxLab";
import ProgressBar from "./components/ProgressBar";
import {
  dockerCommandQuiz,
  dockerFilePractice,
  dockerFlashcards,
} from "./data/docker";
import { linuxCommandQuiz, linuxFlashcards } from "./data/linux";
import { linuxShellPractice } from "./data/linuxPractice";
import { tools } from "./data/tools";
import { useLocalStorage } from "./hooks/useLocalStorage";

const initialProgress = {
  masteredFlashcards: [],
  quizScore: 0,
  completedCommands: [],
  completedPractices: [],
  dockerMasteredFlashcards: [],
  dockerQuizScore: 0,
  dockerCompletedCommands: [],
  dockerCompletedPractices: [],
};

export default function App() {
  const [activeTool, setActiveTool] = useState("linux");
  const [correction, setCorrection] = useState(null);
  const [progress, setProgress] = useLocalStorage("devops-lab-progress-v1", initialProgress);

  const moduleProgress = useMemo(() => {
    const linux = (
      progress.masteredFlashcards.length / linuxFlashcards.length +
      progress.quizScore / 100 +
      progress.completedCommands.length / linuxCommandQuiz.length +
      progress.completedPractices.length / linuxShellPractice.length
    ) / 4 * 100;

    const docker = (
      progress.dockerMasteredFlashcards.length / dockerFlashcards.length +
      progress.dockerQuizScore / 100 +
      progress.dockerCompletedCommands.length / dockerCommandQuiz.length +
      progress.dockerCompletedPractices.length / dockerFilePractice.length
    ) / 4 * 100;

    return { linux, docker };
  }, [progress]);

  const activeToolData = tools.find((tool) => tool.id === activeTool);
  const trackedTool = activeTool === "docker" ? "docker" : "linux";
  const trackedCards = trackedTool === "docker"
    ? progress.dockerMasteredFlashcards.length
    : progress.masteredFlashcards.length;
  const trackedScore = trackedTool === "docker"
    ? progress.dockerQuizScore
    : progress.quizScore;

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
                {!["linux", "docker"].includes(tool.id) && (
                  <span className="lock-mark" aria-hidden="true">soon</span>
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-progress">
            <ProgressBar
              value={moduleProgress[trackedTool]}
              label={`${trackedTool === "docker" ? "Docker" : "Linux"} progress`}
            />
            <p>{trackedCards} cards · {trackedScore}% best quiz</p>
          </div>
        </aside>

        <main>
          {activeTool === "linux" ? (
            <LinuxLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
          ) : activeTool === "docker" ? (
            <DockerLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
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
