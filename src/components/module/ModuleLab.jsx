import { useState } from "react";
import CommandQuiz from "../CommandQuiz";
import FilePractice from "../FilePractice";
import LectureNotes from "../LectureNotes";
import LinuxFlashcards from "../LinuxFlashcards";
import LinuxReference from "../LinuxReference";
import MultipleChoiceQuiz from "../MultipleChoiceQuiz";
import ModuleHeader from "./ModuleHeader";
import ModuleNavigation from "./ModuleNavigation";

function progressList(progress, key) {
  return progress[key] || [];
}

function toggleListItem(list, id) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function addListItem(list, id) {
  return list.includes(id) ? list : [...list, id];
}

export default function ModuleLab({ module, progress, setProgress, onWrong }) {
  const [mode, setMode] = useState(module.modes[0].id);
  const keys = module.progressKeys;

  function toggleMastered(id) {
    setProgress((current) => ({
      ...current,
      [keys.masteredFlashcards]: toggleListItem(progressList(current, keys.masteredFlashcards), id),
    }));
  }

  function saveQuizScore(score) {
    setProgress((current) => ({
      ...current,
      [keys.quizScore]: Math.max(current[keys.quizScore] || 0, score),
    }));
  }

  function saveCommand(id) {
    setProgress((current) => {
      const completed = addListItem(progressList(current, keys.completedCommands), id);
      const next = {
        ...current,
        [keys.completedCommands]: completed,
      };

      if (keys.commandScore) {
        next[keys.commandScore] = Math.round(completed.length / module.commandQuiz.length * 100);
      }

      return next;
    });
  }

  function savePractice(id) {
    setProgress((current) => ({
      ...current,
      [keys.completedPractices]: addListItem(progressList(current, keys.completedPractices), id),
    }));
  }

  return (
    <>
      <ModuleHeader {...module.header} />
      <ModuleNavigation
        label={`${module.displayName} learning modes`}
        modes={module.modes}
        activeMode={mode}
        onChange={setMode}
      />

      <section className="mode-content">
        {mode === "notes" && (
          <LectureNotes
            notes={module.reference.notes}
            categories={module.categories}
            {...module.notesProps}
          />
        )}
        {mode === "command-reference" && (
          <LinuxReference
            commands={module.reference.commands}
            categories={module.categories}
            {...module.commandReferenceProps}
          />
        )}
        {mode === "flashcards" && (
          <LinuxFlashcards
            cards={module.flashcards}
            mastered={progressList(progress, keys.masteredFlashcards)}
            onToggleMastered={toggleMastered}
            categories={module.categories}
            {...module.flashcardProps}
          />
        )}
        {mode === "quiz" && (
          <MultipleChoiceQuiz
            questions={module.multipleChoice}
            savedScore={progress[keys.quizScore] || 0}
            onComplete={saveQuizScore}
            onWrong={onWrong}
          />
        )}
        {mode === "commands" && (
          <CommandQuiz
            questions={module.commandQuiz}
            completedIds={progressList(progress, keys.completedCommands)}
            onCorrect={saveCommand}
            onWrong={onWrong}
            {...module.commandQuizProps}
          />
        )}
        {mode === module.practice.modeId && (
          <FilePractice
            tasks={module.practice.tasks}
            completedIds={progressList(progress, keys.completedPractices)}
            onComplete={savePractice}
            {...module.practice.props}
          />
        )}
      </section>
    </>
  );
}
