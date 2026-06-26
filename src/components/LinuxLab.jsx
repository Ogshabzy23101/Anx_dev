import { useState } from "react";
import {
  linuxCommandQuiz,
  linuxCategories,
  linuxCommandCatalog,
  linuxFlashcards,
  linuxMultipleChoice,
} from "../data/linux";
import { linuxShellPractice } from "../data/linuxPractice";
import CommandQuiz from "./CommandQuiz";
import FilePractice from "./FilePractice";
import LectureNotes from "./LectureNotes";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import { splitReferenceContent } from "../utils/referenceContent";

const modes = [
  { id: "notes", label: "Notes", icon: "01" },
  { id: "command-reference", label: "Commands", icon: "02" },
  { id: "flashcards", label: "Flashcards", icon: "03" },
  { id: "quiz", label: "Quiz", icon: "04" },
  { id: "commands", label: "Write commands", icon: "05" },
  { id: "files", label: "File practice", icon: "06" },
];

const linuxReferenceContent = splitReferenceContent(linuxCommandCatalog, "Linux");

export default function LinuxLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("notes");

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
            aria-label={item.label}
            onClick={() => setMode(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <section className="mode-content">
        {mode === "notes" && (
          <LectureNotes
            notes={linuxReferenceContent.notes}
            categories={linuxCategories}
            searchPlaceholder="permissions, processes, shell, networking..."
            emptyMessage="No Linux notes match these filters."
          />
        )}
        {mode === "command-reference" && <LinuxReference commands={linuxReferenceContent.commands} />}
        {mode === "flashcards" && (
          <LinuxFlashcards
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
            labLabel="shell script lab"
            editorLabel="Shell script answer"
            resultNoun="Script"
          />
        )}
      </section>
    </>
  );
}
