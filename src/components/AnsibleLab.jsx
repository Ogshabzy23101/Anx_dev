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
  { id: "commands", label: "Write Ansible commands", icon: "05" },
  { id: "playbooks", label: "Playbook practice", icon: "06" },
];

const ansibleReferenceContent = splitReferenceContent(ansibleCommandCatalog, "Ansible");

export default function AnsibleLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("notes");

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
        {mode === "notes" && (
          <LectureNotes
            notes={ansibleReferenceContent.notes}
            categories={ansibleCategories}
            searchLabel="search Ansible notes"
            searchPlaceholder="inventory, roles, handlers, vault..."
            emptyMessage="No Ansible notes match these filters."
          />
        )}
        {mode === "command-reference" && (
          <LinuxReference
            commands={ansibleReferenceContent.commands}
            categories={ansibleCategories}
            searchLabel="search Ansible commands and explanations"
            searchPlaceholder="inventory, handlers, vault, roles..."
            itemNoun="Ansible commands"
            emptyMessage="No Ansible commands match these filters."
            syntaxLabel="YAML or command example"
            flagsLabel="Common options"
            examplesLabel="Ansible command examples"
            relatedLabel="Related commands"
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
