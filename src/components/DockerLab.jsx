import { useState } from "react";
import {
  dockerCommandQuiz,
  dockerCategories,
  dockerCommandCatalog,
  dockerFilePractice,
  dockerFlashcards,
  dockerMultipleChoice,
} from "../data/docker";
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

const dockerReferenceContent = splitReferenceContent(dockerCommandCatalog, "Docker");

export default function DockerLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("notes");

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
        {mode === "notes" && (
          <LectureNotes
            notes={dockerReferenceContent.notes}
            categories={dockerCategories}
            searchLabel="search Docker notes"
            searchPlaceholder="engine, images, Compose, security..."
            emptyMessage="No Docker notes match these filters."
          />
        )}
        {mode === "command-reference" && (
          <LinuxReference
            commands={dockerReferenceContent.commands}
            categories={dockerCategories}
            searchLabel="search Docker commands and explanations"
            searchPlaceholder="build, volumes, Compose, debugging..."
            itemNoun="Docker commands"
            emptyMessage="No Docker commands match these filters."
          />
        )}
        {mode === "flashcards" && (
          <LinuxFlashcards
            cards={dockerFlashcards}
            mastered={progress.dockerMasteredFlashcards}
            onToggleMastered={toggleMastered}
            categories={dockerCategories}
            searchPlaceholder="images, networks, multi-stage builds..."
            flipLabel="Flip Docker flashcard"
            emptyMessage="No Docker flashcards match these filters."
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
            labLabel="Dockerfile and Compose lab"
            editorLabel="Docker file answer"
            resultNoun="File"
          />
        )}
      </section>
    </>
  );
}
