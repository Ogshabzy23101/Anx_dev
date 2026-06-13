import { useEffect, useState } from "react";
import { validatePracticeAnswer } from "../utils/answerValidation";
import PracticeResultModal from "./PracticeResultModal";

export default function FilePractice({
  tasks,
  completedIds,
  onComplete,
  labLabel = "shell script lab",
  editorLabel = "Shell script answer",
  resultNoun = "Script",
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(tasks[0].starter);
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const task = tasks[index];

  useEffect(() => {
    setAnswer(task.starter);
    setResult(null);
    setShowSolution(false);
  }, [task]);

  function submit() {
    const validation = validatePracticeAnswer(answer, task.rules);
    const nextResult = {
      type: validation.isCorrect ? "success" : "error",
      missing: validation.missing,
    };

    setResult(nextResult);
    if (validation.isCorrect) onComplete(task.id);
  }

  function retry() {
    setAnswer(task.starter);
    setResult(null);
    setShowSolution(false);
  }

  function selectTask(event) {
    setIndex(Number(event.target.value));
  }

  return (
    <div className="practice-workspace">
      <section className="practice-instructions terminal-card">
        <div className="study-meta">
          <span>{labLabel}</span>
          <span>{completedIds.length}/{tasks.length} solved</span>
        </div>
        <label className="task-selector">
          <span>challenge</span>
          <select value={index} onChange={selectTask}>
            {tasks.map((item, taskIndex) => (
              <option value={taskIndex} key={item.id}>
                {taskIndex + 1}. {item.title}
              </option>
            ))}
          </select>
        </label>
        <span className="eyebrow">instruction</span>
        <h2>{task.instruction}</h2>
        <div className="requirement-list">
          <span>validator checks</span>
          <ul>
            {task.rules.map((rule) => <li key={rule.label}>{rule.label}</li>)}
          </ul>
        </div>
      </section>

      <section className="practice-editor terminal-card">
        <div className="editor-chrome">
          <span />
          <span />
          <span />
          <code>{task.filename}</code>
        </div>
        <label className="sr-only" htmlFor="practice-answer">{editorLabel}</label>
        <textarea
          id="practice-answer"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setResult(null);
          }}
          spellCheck="false"
          aria-label={editorLabel}
        />
        <div className="editor-actions">
          <button className="primary-button" type="button" onClick={submit} disabled={!answer.trim()}>
            Validate script
          </button>
          <button className="ghost-button" type="button" onClick={retry}>
            Retry
          </button>
          <button className="ghost-button" type="button" onClick={() => setShowSolution((value) => !value)}>
            {showSolution ? "Hide solution" : "Show solution"}
          </button>
        </div>
        {showSolution && (
          <div className="inline-solution">
            <span>reference solution</span>
            <pre>{task.solution}</pre>
          </div>
        )}
      </section>

      <PracticeResultModal
        result={result}
        userAnswer={answer}
        expectedAnswer={task.solution}
        onClose={() => setResult(null)}
        onRetry={retry}
        onShowSolution={() => {
          setShowSolution(true);
          setResult(null);
        }}
        resultNoun={resultNoun}
      />
    </div>
  );
}
