import { useState } from "react";
import {
  linuxCommandQuiz,
  linuxFlashcards,
  linuxMultipleChoice,
  linuxReference,
} from "../data/linux";
import { linuxShellPractice } from "../data/linuxPractice";
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
  { id: "files", label: "File practice", icon: "05" },
];

export default function LinuxLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("reference");

  function toggleMastered(id) {
    setProgress((current) => ({
      ...current,
      masteredFlashcards: current.masteredFlashcards.includes(id)
        ? current.masteredFlashcards.filter((cardId) => cardId !== id)
        : [...current.masteredFlashcards, id],
    }));
  }

  function saveQuizScore(score) {
    setProgress((current) => ({
      ...current,
      quizScore: Math.max(current.quizScore, score),
    }));
  }

  function saveCommand(id) {
    setProgress((current) => ({
      ...current,
      completedCommands: current.completedCommands.includes(id)
        ? current.completedCommands
        : [...current.completedCommands, id],
    }));
  }

  function savePractice(id) {
    setProgress((current) => ({
      ...current,
      completedPractices: current.completedPractices.includes(id)
        ? current.completedPractices
        : [...current.completedPractices, id],
    }));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">module 01 / foundation</span>
          <h1>Linux operations</h1>
          <p>Build fluency at the command line, one deliberate repetition at a time.</p>
        </div>
        <div className="module-badge">
          <span>current shell</span>
          <code>bash</code>
        </div>
      </section>

      <nav className="mode-tabs" aria-label="Linux learning modes">
        {modes.map((item) => (
          <button
            className={mode === item.id ? "active" : ""}
            type="button"
            key={item.id}
            onClick={() => setMode(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <section className="mode-content">
        {mode === "reference" && <Reference sections={linuxReference} />}
        {mode === "flashcards" && (
          <Flashcards
            cards={linuxFlashcards}
            mastered={progress.masteredFlashcards}
            onToggleMastered={toggleMastered}
          />
        )}
        {mode === "quiz" && (
          <MultipleChoiceQuiz
            questions={linuxMultipleChoice}
            savedScore={progress.quizScore}
            onComplete={saveQuizScore}
            onWrong={onWrong}
          />
        )}
        {mode === "commands" && (
          <CommandQuiz
            questions={linuxCommandQuiz}
            completedIds={progress.completedCommands}
            onCorrect={saveCommand}
            onWrong={onWrong}
          />
        )}
        {mode === "files" && (
          <FilePractice
            tasks={linuxShellPractice}
            completedIds={progress.completedPractices}
            onComplete={savePractice}
          />
        )}
      </section>
    </>
  );
}
