import { useMemo, useState } from "react";
import AnsibleLab from "./components/AnsibleLab";
import CorrectionModal from "./components/CorrectionModal";
import DockerLab from "./components/DockerLab";
import HelmLab from "./components/HelmLab";
import InterviewLab from "./components/InterviewLab";
import KubernetesLab from "./components/KubernetesLab";
import LinuxLab from "./components/LinuxLab";
import PracticeLabs from "./components/PracticeLabs";
import ProgressBar from "./components/ProgressBar";
import TerraformLab from "./components/TerraformLab";
import {
  ansibleCommandQuiz,
  ansibleFlashcards,
  ansiblePractice,
} from "./data/ansible";
import {
  dockerCommandQuiz,
  dockerFilePractice,
  dockerFlashcards,
} from "./data/docker";
import { linuxCommandQuiz, linuxFlashcards } from "./data/linux";
import { linuxShellPractice } from "./data/linuxPractice";
import {
  interviewFlashcards,
  interviewQuestions,
} from "./data/interview";
import {
  helmCommandQuiz,
  helmFlashcards,
  helmPractice,
} from "./data/helm";
import {
  kubernetesCommandQuiz,
  kubernetesFlashcards,
  kubernetesManifestPractice,
} from "./data/kubernetes";
import { tools } from "./data/tools";
import { dockerPracticeLabs } from "./data/dockerPracticeLabs";
import { linuxPracticeLabs } from "./data/practiceLabs";
import {
  terraformCommandQuiz,
  terraformFlashcards,
  terraformPractice,
} from "./data/terraform";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { calculateModuleProgress } from "./utils/progress";
import { calculatePracticeLabStats } from "./utils/practiceLabProgress";

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
  helmMasteredFlashcards: [],
  helmQuizScore: 0,
  helmCompletedCommands: [],
  helmCommandScore: 0,
  helmCompletedPractices: [],
  terraformMasteredFlashcards: [],
  terraformQuizScore: 0,
  terraformCompletedCommands: [],
  terraformCommandScore: 0,
  terraformCompletedPractices: [],
  ansibleMasteredFlashcards: [],
  ansibleQuizScore: 0,
  ansibleCompletedCommands: [],
  ansibleCommandScore: 0,
  ansibleCompletedPractices: [],
  interviewReviewedQuestions: [],
  interviewMasteredFlashcards: [],
  interviewQuizScore: 0,
  interviewCompletedWritten: [],
  interviewCompletedMocks: 0,
  interviewWeakCategories: [],
  practiceLabStartedIds: [],
  practiceLabCompletedIds: [],
  practiceLabFailures: {},
  dockerPracticeLabStartedIds: [],
  dockerPracticeLabCompletedIds: [],
  dockerPracticeLabFailures: {},
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

    const helm = calculateModuleProgress({
      masteredCount: progress.helmMasteredFlashcards.length,
      flashcardTotal: helmFlashcards.length,
      quizScore: progress.helmQuizScore,
      completedCommandCount: progress.helmCompletedCommands.length,
      commandTotal: helmCommandQuiz.length,
      completedPracticeCount: progress.helmCompletedPractices.length,
      practiceTotal: helmPractice.length,
    });

    const terraform = calculateModuleProgress({
      masteredCount: progress.terraformMasteredFlashcards.length,
      flashcardTotal: terraformFlashcards.length,
      quizScore: progress.terraformQuizScore,
      completedCommandCount: progress.terraformCompletedCommands.length,
      commandTotal: terraformCommandQuiz.length,
      completedPracticeCount: progress.terraformCompletedPractices.length,
      practiceTotal: terraformPractice.length,
    });

    const ansible = calculateModuleProgress({
      masteredCount: progress.ansibleMasteredFlashcards.length,
      flashcardTotal: ansibleFlashcards.length,
      quizScore: progress.ansibleQuizScore,
      completedCommandCount: progress.ansibleCompletedCommands.length,
      commandTotal: ansibleCommandQuiz.length,
      completedPracticeCount: progress.ansibleCompletedPractices.length,
      practiceTotal: ansiblePractice.length,
    });

    const interview = calculateModuleProgress({
      masteredCount: progress.interviewMasteredFlashcards.length,
      flashcardTotal: interviewFlashcards.length,
      quizScore: progress.interviewQuizScore,
      completedCommandCount: progress.interviewReviewedQuestions.length,
      commandTotal: interviewQuestions.length,
      completedPracticeCount: progress.interviewCompletedWritten.length,
      practiceTotal: interviewQuestions.length,
    });

    const linuxPracticeLabStats = calculatePracticeLabStats(progress, linuxPracticeLabs);
    const dockerPracticeLabStats = calculatePracticeLabStats({
      practiceLabStartedIds: progress.dockerPracticeLabStartedIds,
      practiceLabCompletedIds: progress.dockerPracticeLabCompletedIds,
      practiceLabFailures: progress.dockerPracticeLabFailures,
    }, dockerPracticeLabs);
    const practiceLabs = Math.round(
      (linuxPracticeLabStats.completedCount + dockerPracticeLabStats.completedCount)
        / (linuxPracticeLabStats.totalCount + dockerPracticeLabStats.totalCount) * 100,
    );

    return { linux, docker, kubernetes, helm, terraform, ansible, interview, "practice-labs": practiceLabs };
  }, [progress]);

  const activeToolData = tools.find((tool) => tool.id === activeTool);
  const trackedTool = ["linux", "docker", "kubernetes", "helm", "terraform", "ansible", "interview", "practice-labs"].includes(activeTool)
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
    helm: {
      label: "Helm",
      cards: progress.helmMasteredFlashcards.length,
      score: progress.helmQuizScore,
      commandScore: progress.helmCommandScore,
    },
    terraform: {
      label: "Terraform",
      cards: progress.terraformMasteredFlashcards.length,
      score: progress.terraformQuizScore,
      commandScore: progress.terraformCommandScore,
    },
    ansible: {
      label: "Ansible",
      cards: progress.ansibleMasteredFlashcards.length,
      score: progress.ansibleQuizScore,
      commandScore: progress.ansibleCommandScore,
    },
    interview: {
      label: "Interview",
      cards: progress.interviewMasteredFlashcards.length,
      score: progress.interviewQuizScore,
      commandScore: Math.round(
        progress.interviewReviewedQuestions.length / interviewQuestions.length * 100,
      ),
    },
    "practice-labs": {
      label: "Practice Labs",
      cards: (progress.practiceLabStartedIds || []).length + (progress.dockerPracticeLabStartedIds || []).length,
      score: Math.round(
        ((progress.practiceLabCompletedIds || []).length + (progress.dockerPracticeLabCompletedIds || []).length)
          / (linuxPracticeLabs.length + dockerPracticeLabs.length) * 100,
      ),
      commandScore: Math.round(
        ((progress.practiceLabCompletedIds || []).length + (progress.dockerPracticeLabCompletedIds || []).length)
          / (linuxPracticeLabs.length + dockerPracticeLabs.length) * 100,
      ),
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
                {!["linux", "docker", "kubernetes", "helm", "terraform", "ansible", "interview", "practice-labs"].includes(tool.id) && (
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
          ) : activeTool === "helm" ? (
            <HelmLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
          ) : activeTool === "terraform" ? (
            <TerraformLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
          ) : activeTool === "ansible" ? (
            <AnsibleLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
          ) : activeTool === "interview" ? (
            <InterviewLab progress={progress} setProgress={setProgress} onWrong={setCorrection} />
          ) : activeTool === "practice-labs" ? (
            <PracticeLabs progress={progress} setProgress={setProgress} />
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
