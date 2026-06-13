import { useState } from "react";
import {
  terraformCommandQuiz,
  terraformFlashcards,
  terraformMultipleChoice,
  terraformPractice,
  terraformReference,
} from "../data/terraform";
import CommandQuiz from "./CommandQuiz";
import FilePractice from "./FilePractice";
import Flashcards from "./Flashcards";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import Reference from "./Reference";

const modes = [
  { id: "reference", label: "Reference", icon: "01" },
  { id: "flashcards", label: "Flashcards", icon: "02" },
  { id: "quiz", label: "Quiz", icon: "03" },
  { id: "commands", label: "Write Terraform commands", icon: "04" },
  { id: "hcl", label: "HCL practice", icon: "05" },
];

export default function TerraformLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("reference");

  function toggleMastered(id) {
    setProgress((current) => ({
      ...current,
      terraformMasteredFlashcards: current.terraformMasteredFlashcards.includes(id)
        ? current.terraformMasteredFlashcards.filter((cardId) => cardId !== id)
        : [...current.terraformMasteredFlashcards, id],
    }));
  }

  function saveQuizScore(score) {
    setProgress((current) => ({
      ...current,
      terraformQuizScore: Math.max(current.terraformQuizScore, score),
    }));
  }

  function saveCommand(id) {
    setProgress((current) => {
      const completed = current.terraformCompletedCommands.includes(id)
        ? current.terraformCompletedCommands
        : [...current.terraformCompletedCommands, id];

      return {
        ...current,
        terraformCompletedCommands: completed,
        terraformCommandScore: Math.round(
          completed.length / terraformCommandQuiz.length * 100,
        ),
      };
    });
  }

  function savePractice(id) {
    setProgress((current) => ({
      ...current,
      terraformCompletedPractices: current.terraformCompletedPractices.includes(id)
        ? current.terraformCompletedPractices
        : [...current.terraformCompletedPractices, id],
    }));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">module 05 / infrastructure as code</span>
          <h1>Terraform workflows</h1>
          <p>Model infrastructure, inspect plans, and manage state through reusable HCL.</p>
        </div>
        <div className="module-badge">
          <span>iac engine</span>
          <code>terraform</code>
        </div>
      </section>

      <nav className="mode-tabs" aria-label="Terraform learning modes">
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
        {mode === "reference" && <Reference sections={terraformReference} />}
        {mode === "flashcards" && (
          <Flashcards
            cards={terraformFlashcards}
            mastered={progress.terraformMasteredFlashcards}
            onToggleMastered={toggleMastered}
          />
        )}
        {mode === "quiz" && (
          <MultipleChoiceQuiz
            questions={terraformMultipleChoice}
            savedScore={progress.terraformQuizScore}
            onComplete={saveQuizScore}
            onWrong={onWrong}
          />
        )}
        {mode === "commands" && (
          <CommandQuiz
            questions={terraformCommandQuiz}
            completedIds={progress.terraformCompletedCommands}
            onCorrect={saveCommand}
            onWrong={onWrong}
            shellPrompt="lab@terraform:~$"
          />
        )}
        {mode === "hcl" && (
          <FilePractice
            tasks={terraformPractice}
            completedIds={progress.terraformCompletedPractices}
            onComplete={savePractice}
            labLabel="terraform hcl lab"
            editorLabel="Terraform HCL answer"
            resultNoun="HCL"
            submitLabel="Validate HCL"
          />
        )}
      </section>
    </>
  );
}
