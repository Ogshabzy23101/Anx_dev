import { useState } from "react";

export default function InterviewFeedback({ result, question }) {
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  if (!result) return null;

  return (
    <section className={`terminal-card practice-modal ${result.isCorrect ? "is-success" : "is-error"}`}>
      <div className="modal-status">{result.isCorrect ? "answer_covers_it" : "answer_needs_work"}</div>
      <h2>{result.isCorrect ? "That covers the key points." : "A few things to add."}</h2>

      <div className="validation-feedback">
        <div className="feedback-column is-correct">
          <span>you hit</span>
          <ul>
            {result.passed.length
              ? result.passed.map((item) => <li key={item}>✓ {item}</li>)
              : <li>Nothing yet</li>}
          </ul>
        </div>
        <div className="feedback-column is-missing">
          <span>still missing</span>
          <ul>
            {result.missing.length
              ? result.missing.map((item) => <li key={item}>✗ {item}</li>)
              : <li>Nothing missing</li>}
          </ul>
        </div>
      </div>

      <section className="mistake-panel">
        <h3>Common mistake</h3>
        <p>{question.commonMistake}</p>
      </section>

      <details className="model-answer-reveal" onToggle={(event) => setShowModelAnswer(event.currentTarget.open)}>
        <summary>{showModelAnswer ? "Hide model answer" : "Show model answer"}</summary>
        <p>{question.modelAnswer}</p>
      </details>
    </section>
  );
}
