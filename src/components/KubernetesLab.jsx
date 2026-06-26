import { useState } from "react";
import {
  kubernetesCommandQuiz,
  kubernetesCategories,
  kubernetesCommandCatalog,
  kubernetesFlashcards,
  kubernetesManifestPractice,
  kubernetesMultipleChoice,
} from "../data/kubernetes";
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
  { id: "commands", label: "Write kubectl", icon: "05" },
  { id: "manifests", label: "Manifest practice", icon: "06" },
];

const kubernetesReferenceContent = splitReferenceContent(kubernetesCommandCatalog, "Kubernetes");

export default function KubernetesLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("notes");

  function toggleMastered(id) {
    setProgress((current) => ({
      ...current,
      kubernetesMasteredFlashcards: current.kubernetesMasteredFlashcards.includes(id)
        ? current.kubernetesMasteredFlashcards.filter((cardId) => cardId !== id)
        : [...current.kubernetesMasteredFlashcards, id],
    }));
  }

  function saveQuizScore(score) {
    setProgress((current) => ({
      ...current,
      kubernetesQuizScore: Math.max(current.kubernetesQuizScore, score),
    }));
  }

  function saveCommand(id) {
    setProgress((current) => {
      const completed = current.kubernetesCompletedCommands.includes(id)
        ? current.kubernetesCompletedCommands
        : [...current.kubernetesCompletedCommands, id];

      return {
        ...current,
        kubernetesCompletedCommands: completed,
        kubernetesCommandScore: Math.round(
          completed.length / kubernetesCommandQuiz.length * 100,
        ),
      };
    });
  }

  function saveManifest(id) {
    setProgress((current) => ({
      ...current,
      kubernetesCompletedManifests: current.kubernetesCompletedManifests.includes(id)
        ? current.kubernetesCompletedManifests
        : [...current.kubernetesCompletedManifests, id],
    }));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">module 03 / orchestration</span>
          <h1>Kubernetes operations</h1>
          <p>Operate workloads, debug clusters, and write clear manifests one resource at a time.</p>
        </div>
        <div className="module-badge">
          <span>client</span>
          <code>kubectl</code>
        </div>
      </section>

      <nav className="mode-tabs" aria-label="Kubernetes learning modes">
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
            notes={kubernetesReferenceContent.notes}
            categories={kubernetesCategories}
            searchLabel="search Kubernetes lecture notes"
            searchPlaceholder="architecture, RBAC, services, networking..."
            emptyMessage="No Kubernetes notes match these filters."
          />
        )}
        {mode === "command-reference" && (
          <LinuxReference
            commands={kubernetesReferenceContent.commands}
            categories={kubernetesCategories}
            searchLabel="search kubectl commands and explanations"
            searchPlaceholder="deployments, RBAC, probes, troubleshooting..."
            itemNoun="kubectl commands"
            emptyMessage="No kubectl commands match these filters."
            syntaxLabel="Syntax or manifest example"
            flagsLabel="Common fields or flags"
            examplesLabel="kubectl examples"
            relatedLabel="Related commands"
          />
        )}
        {mode === "flashcards" && (
          <LinuxFlashcards
            cards={kubernetesFlashcards}
            mastered={progress.kubernetesMasteredFlashcards}
            onToggleMastered={toggleMastered}
            categories={kubernetesCategories}
            searchPlaceholder="pods, storage, rollouts, scheduling..."
            flipLabel="Flip Kubernetes flashcard"
            emptyMessage="No Kubernetes flashcards match these filters."
          />
        )}
        {mode === "quiz" && (
          <MultipleChoiceQuiz
            questions={kubernetesMultipleChoice}
            savedScore={progress.kubernetesQuizScore}
            onComplete={saveQuizScore}
            onWrong={onWrong}
          />
        )}
        {mode === "commands" && (
          <CommandQuiz
            questions={kubernetesCommandQuiz}
            completedIds={progress.kubernetesCompletedCommands}
            onCorrect={saveCommand}
            onWrong={onWrong}
            shellPrompt="lab@k8s:~$"
          />
        )}
        {mode === "manifests" && (
          <FilePractice
            tasks={kubernetesManifestPractice}
            completedIds={progress.kubernetesCompletedManifests}
            onComplete={saveManifest}
            labLabel="kubernetes manifest lab"
            editorLabel="Kubernetes YAML answer"
            resultNoun="Manifest"
            submitLabel="Validate manifest"
          />
        )}
      </section>
    </>
  );
}
