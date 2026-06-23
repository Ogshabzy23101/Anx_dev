import { useState } from "react";
import {
  ansibleCategories,
  ansibleCommandCatalog,
  ansibleCommandQuiz,
  ansibleFlashcards,
  ansibleMultipleChoice,
  ansiblePractice,
} from "../data/ansible";
import CommandQuiz from "./CommandQuiz";
import FilePractice from "./FilePractice";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";

const modes = [
  { id: "reference", label: "Reference", icon: "01" },
  { id: "flashcards", label: "Flashcards", icon: "02" },
  { id: "quiz", label: "Quiz", icon: "03" },
  { id: "commands", label: "Write Ansible commands", icon: "04" },
  { id: "playbooks", label: "Playbook practice", icon: "05" },
];

export default function AnsibleLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("reference");

  function toggleMastered(id) {
    setProgress((current) => ({
      ...current,
      ansibleMasteredFlashcards: current.ansibleMasteredFlashcards.includes(id)
        ? current.ansibleMasteredFlashcards.filter((cardId) => cardId !== id)
        : [...current.ansibleMasteredFlashcards, id],
    }));
  }

  function saveQuizScore(score) {
    setProgress((current) => ({
      ...current,
      ansibleQuizScore: Math.max(current.ansibleQuizScore, score),
    }));
  }

  function saveCommand(id) {
    setProgress((current) => {
      const completed = current.ansibleCompletedCommands.includes(id)
        ? current.ansibleCompletedCommands
        : [...current.ansibleCompletedCommands, id];

      return {
        ...current,
        ansibleCompletedCommands: completed,
        ansibleCommandScore: Math.round(
          completed.length / ansibleCommandQuiz.length * 100,
        ),
      };
    });
  }

  function savePractice(id) {
    setProgress((current) => ({
      ...current,
      ansibleCompletedPractices: current.ansibleCompletedPractices.includes(id)
        ? current.ansibleCompletedPractices
        : [...current.ansibleCompletedPractices, id],
    }));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">module 06 / configuration management</span>
          <h1>Ansible automation</h1>
          <p>Target inventories, compose idempotent plays, and coordinate safe configuration changes.</p>
        </div>
        <div className="module-badge">
          <span>automation engine</span>
          <code>ansible</code>
        </div>
      </section>

      <nav className="mode-tabs" aria-label="Ansible learning modes">
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
            commands={ansibleCommandCatalog}
            categories={ansibleCategories}
            searchLabel="search Ansible topics and explanations"
            searchPlaceholder="inventory, handlers, vault, roles..."
            itemNoun="Ansible topics"
            emptyMessage="No Ansible topics match these filters."
            syntaxLabel="YAML or command example"
            flagsLabel="Common options"
            examplesLabel="YAML or command examples"
            relatedLabel="Related concepts"
          />
        )}
        {mode === "flashcards" && (
          <LinuxFlashcards
            cards={ansibleFlashcards}
            mastered={progress.ansibleMasteredFlashcards}
            onToggleMastered={toggleMastered}
            categories={ansibleCategories}
            searchPlaceholder="inventory, roles, handlers, vault..."
            flipLabel="Flip Ansible flashcard"
            emptyMessage="No Ansible flashcards match these filters."
          />
        )}
        {mode === "quiz" && (
          <MultipleChoiceQuiz
            questions={ansibleMultipleChoice}
            savedScore={progress.ansibleQuizScore}
            onComplete={saveQuizScore}
            onWrong={onWrong}
          />
        )}
        {mode === "commands" && (
          <CommandQuiz
            questions={ansibleCommandQuiz}
            completedIds={progress.ansibleCompletedCommands}
            onCorrect={saveCommand}
            onWrong={onWrong}
            shellPrompt="lab@ansible:~$"
          />
        )}
        {mode === "playbooks" && (
          <FilePractice
            tasks={ansiblePractice}
            completedIds={progress.ansibleCompletedPractices}
            onComplete={savePractice}
            labLabel="ansible playbook lab"
            editorLabel="Ansible YAML answer"
            resultNoun="Playbook"
            submitLabel="Validate playbook"
          />
        )}
      </section>
    </>
  );
}
