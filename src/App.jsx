import { useMemo, useState } from "react";
import CorrectionModal from "./components/CorrectionModal";
import LinuxLab from "./components/LinuxLab";
import ProgressBar from "./components/ProgressBar";
import { linuxCommandQuiz, linuxFlashcards } from "./data/linux";
import { linuxShellPractice } from "./data/linuxPractice";
import { tools } from "./data/tools";
import { useLocalStorage } from "./hooks/useLocalStorage";

const initialProgress = {
  masteredFlashcards: [],
  quizScore: 0,
  completedCommands: [],
  completedPractices: [],
};

export default function App() {
  const [activeTool, setActiveTool] = useState("linux");
  const [correction, setCorrection] = useState(null);
  const [progress, setProgress] = useLocalStorage("devops-lab-progress-v1", initialProgress);

  const overallProgress = useMemo(() => {
    const flashcardPoints = progress.masteredFlashcards.length / linuxFlashcards.length;
    const quizPoints = progress.quizScore / 100;
    const commandPoints = progress.completedCommands.length / linuxCommandQuiz.length;
    const practicePoints = progress.completedPractices.length / linuxShellPractice.length;
    return ((flashcardPoints + quizPoints + commandPoints + practicePoints) / 4) * 100;
  }, [progress]);

  const activeToolData = tools.find((tool) => tool.id === activeTool);

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
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="tool-prompt">{activeTool === tool.id ? ">" : "$"}</span>
                {tool.label}
                {tool.id !== "linux" && <span className="lock-mark">soon</span>}
              </button>
            ))}
          </nav>
          <div className="sidebar-progress">
            <ProgressBar value={overallProgress} label="Linux progress" />
            <p>{progress.masteredFlashcards.length} cards · {progress.quizScore}% best quiz</p>
          </div>
        </aside>

        <main>
          {activeTool === "linux" ? (
            <LinuxLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
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
