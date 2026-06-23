import { useState } from "react";
import {
  helmCommandQuiz,
  helmCategories,
  helmCommandCatalog,
  helmFlashcards,
  helmMultipleChoice,
  helmPractice,
} from "../data/helm";
import CommandQuiz from "./CommandQuiz";
import FilePractice from "./FilePractice";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";

const modes = [
  { id: "reference", label: "Reference", icon: "01" },
  { id: "flashcards", label: "Flashcards", icon: "02" },
  { id: "quiz", label: "Quiz", icon: "03" },
  { id: "commands", label: "Write Helm commands", icon: "04" },
  { id: "charts", label: "Chart practice", icon: "05" },
];

export default function HelmLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("reference");

  function toggleMastered(id) {
    setProgress((current) => ({
      ...current,
      helmMasteredFlashcards: current.helmMasteredFlashcards.includes(id)
        ? current.helmMasteredFlashcards.filter((cardId) => cardId !== id)
        : [...current.helmMasteredFlashcards, id],
    }));
  }

  function saveQuizScore(score) {
    setProgress((current) => ({
      ...current,
      helmQuizScore: Math.max(current.helmQuizScore, score),
    }));
  }

  function saveCommand(id) {
    setProgress((current) => {
      const completed = current.helmCompletedCommands.includes(id)
        ? current.helmCompletedCommands
        : [...current.helmCompletedCommands, id];

      return {
        ...current,
        helmCompletedCommands: completed,
        helmCommandScore: Math.round(completed.length / helmCommandQuiz.length * 100),
      };
    });
  }

  function savePractice(id) {
    setProgress((current) => ({
      ...current,
      helmCompletedPractices: current.helmCompletedPractices.includes(id)
        ? current.helmCompletedPractices
        : [...current.helmCompletedPractices, id],
    }));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">module 04 / packaging</span>
          <h1>Helm charts</h1>
          <p>Package Kubernetes applications, parameterize manifests, and manage release history.</p>
        </div>
        <div className="module-badge">
          <span>package manager</span>
          <code>helm</code>
        </div>
      </section>

      <nav className="mode-tabs" aria-label="Helm learning modes">
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
        {mode === "reference" && (
          <LinuxReference
            commands={helmCommandCatalog}
            categories={helmCategories}
            searchLabel="search Helm topics and explanations"
            searchPlaceholder="templates, values, rollback, lint..."
            itemNoun="Helm topics"
            emptyMessage="No Helm topics match these filters."
            syntaxLabel="Syntax or chart example"
            flagsLabel="Common fields or flags"
            examplesLabel="Chart or command examples"
            relatedLabel="Related concepts"
          />
        )}
        {mode === "flashcards" && (
          <LinuxFlashcards
            cards={helmFlashcards}
            mastered={progress.helmMasteredFlashcards}
            onToggleMastered={toggleMastered}
            categories={helmCategories}
            searchPlaceholder="install, values, helpers, pipelines..."
            flipLabel="Flip Helm flashcard"
            emptyMessage="No Helm flashcards match these filters."
          />
        )}
        {mode === "quiz" && (
          <MultipleChoiceQuiz
            questions={helmMultipleChoice}
            savedScore={progress.helmQuizScore}
            onComplete={saveQuizScore}
            onWrong={onWrong}
          />
        )}
        {mode === "commands" && (
          <CommandQuiz
            questions={helmCommandQuiz}
            completedIds={progress.helmCompletedCommands}
            onCorrect={saveCommand}
            onWrong={onWrong}
            shellPrompt="lab@helm:~$"
          />
        )}
        {mode === "charts" && (
          <FilePractice
            tasks={helmPractice}
            completedIds={progress.helmCompletedPractices}
            onComplete={savePractice}
            labLabel="helm chart lab"
            editorLabel="Helm chart answer"
            resultNoun="Chart file"
            submitLabel="Validate chart"
          />
        )}
      </section>
    </>
  );
}
