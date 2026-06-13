import { useState } from "react";
import {
  dockerCommandQuiz,
  dockerFilePractice,
  dockerFlashcards,
  dockerMultipleChoice,
  dockerReference,
} from "../data/docker";
import CommandQuiz from "./CommandQuiz";
import FilePractice from "./FilePractice";
import Flashcards from "./Flashcards";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import Reference from "./Reference";

const modes = [
  { id: "reference", label: "Reference", icon: "01" },
  { id: "flashcards", label: "Flashcards", icon: "02" },
  { id: "quiz", label: "Quiz", icon: "03" },
  { id: "commands", label: "Write commands", icon: "04" },
  { id: "files", label: "Dockerfile practice", icon: "05" },
];

export default function DockerLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("reference");

  function toggleMastered(id) {
    setProgress((current) => ({
      ...current,
      dockerMasteredFlashcards: current.dockerMasteredFlashcards.includes(id)
        ? current.dockerMasteredFlashcards.filter((cardId) => cardId !== id)
        : [...current.dockerMasteredFlashcards, id],
    }));
  }

  function saveQuizScore(score) {
    setProgress((current) => ({
      ...current,
      dockerQuizScore: Math.max(current.dockerQuizScore, score),
    }));
  }

  function saveCommand(id) {
    setProgress((current) => ({
      ...current,
      dockerCompletedCommands: current.dockerCompletedCommands.includes(id)
        ? current.dockerCompletedCommands
        : [...current.dockerCompletedCommands, id],
    }));
  }

  function savePractice(id) {
    setProgress((current) => ({
      ...current,
      dockerCompletedPractices: current.dockerCompletedPractices.includes(id)
        ? current.dockerCompletedPractices
        : [...current.dockerCompletedPractices, id],
    }));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">module 02 / containers</span>
          <h1>Docker workflows</h1>
          <p>Build, run, inspect, and ship containers with repeatable commands and lean images.</p>
        </div>
        <div className="module-badge">
          <span>runtime</span>
          <code>docker</code>
        </div>
      </section>

      <nav className="mode-tabs" aria-label="Docker learning modes">
        {modes.map((item) => (
          <button
            className={mode === item.id ? "active" : ""}
            type="button"
            key={item.id}
            aria-label={item.label}
            onClick={() => setMode(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <section className="mode-content">
        {mode === "reference" && <Reference sections={dockerReference} />}
        {mode === "flashcards" && (
          <Flashcards
            cards={dockerFlashcards}
            mastered={progress.dockerMasteredFlashcards}
            onToggleMastered={toggleMastered}
          />
        )}
        {mode === "quiz" && (
          <MultipleChoiceQuiz
            questions={dockerMultipleChoice}
            savedScore={progress.dockerQuizScore}
            onComplete={saveQuizScore}
            onWrong={onWrong}
          />
        )}
        {mode === "commands" && (
          <CommandQuiz
            questions={dockerCommandQuiz}
            completedIds={progress.dockerCompletedCommands}
            onCorrect={saveCommand}
            onWrong={onWrong}
            shellPrompt="lab@docker:~$"
          />
        )}
        {mode === "files" && (
          <FilePractice
            tasks={dockerFilePractice}
            completedIds={progress.dockerCompletedPractices}
            onComplete={savePractice}
            labLabel="docker build lab"
            editorLabel="Docker file answer"
            resultNoun="File"
          />
        )}
      </section>
    </>
  );
}
