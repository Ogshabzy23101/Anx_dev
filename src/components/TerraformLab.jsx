import { useState } from "react";
import {
  terraformCommandQuiz,
  terraformCategories,
  terraformCommandCatalog,
  terraformFlashcards,
  terraformMultipleChoice,
  terraformPractice,
} from "../data/terraform";
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
  { id: "commands", label: "Write Terraform commands", icon: "05" },
  { id: "hcl", label: "HCL practice", icon: "06" },
];

const terraformReferenceContent = splitReferenceContent(terraformCommandCatalog, "Terraform");

export default function TerraformLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("notes");

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
        {mode === "notes" && (
          <LectureNotes
            notes={terraformReferenceContent.notes}
            categories={terraformCategories}
            searchLabel="search Terraform notes"
            searchPlaceholder="state, modules, backend, lifecycle..."
            emptyMessage="No Terraform notes match these filters."
          />
        )}
        {mode === "command-reference" && (
          <LinuxReference
            commands={terraformReferenceContent.commands}
            categories={terraformCategories}
            searchLabel="search Terraform commands and explanations"
            searchPlaceholder="state, modules, backend, EC2..."
            itemNoun="Terraform commands"
            emptyMessage="No Terraform commands match these filters."
            syntaxLabel="Syntax or HCL example"
            flagsLabel="Common fields or flags"
            examplesLabel="Terraform command examples"
            relatedLabel="Related commands"
          />
        )}
        {mode === "flashcards" && (
          <LinuxFlashcards
            cards={terraformFlashcards}
            mastered={progress.terraformMasteredFlashcards}
            onToggleMastered={toggleMastered}
            categories={terraformCategories}
            searchPlaceholder="providers, state, modules, workspaces..."
            flipLabel="Flip Terraform flashcard"
            emptyMessage="No Terraform flashcards match these filters."
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
