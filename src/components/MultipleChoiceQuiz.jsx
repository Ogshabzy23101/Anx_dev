import { useState } from "react";
import { isMultipleChoiceCorrect } from "../utils/answerValidation";

export default function MultipleChoiceQuiz({ questions, savedScore, onComplete, onWrong }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  function submit() {
    if (selected === null) return;
    const isCorrect = isMultipleChoiceCorrect(question, selected);
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);

    if (!isCorrect) {
      onWrong({
        explanation: question.explanation,
        answer: question.options[question.answer],
      });
    }

    if (index === questions.length - 1) {
      const score = Math.round((nextCorrect / questions.length) * 100);
      setCorrectCount(nextCorrect);
      setFinished(true);
      onComplete(score);
      return;
    }

    setCorrectCount(nextCorrect);
    setIndex((value) => value + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="result-panel terminal-card">
        <span className="eyebrow">session complete</span>
        <strong>{score}%</strong>
        <h2>{score >= 80 ? "Production ready." : "A few logs to inspect."}</h2>
        <p>Your best saved score is {Math.max(score, savedScore)}%.</p>
        <button className="primary-button" type="button" onClick={restart}>Run quiz again</button>
      </div>
    );
  }

  return (
    <div className="quiz-panel terminal-card">
      <div className="study-meta">
        <span>question {index + 1}/{questions.length}</span>
        <span>{correctCount} correct</span>
      </div>
      <h2>{question.question}</h2>
      <div className="option-list">
        {question.options.map((option, optionIndex) => (
          <button
            className={selected === optionIndex ? "quiz-option selected" : "quiz-option"}
            type="button"
            key={option}
            onClick={() => setSelected(optionIndex)}
          >
            <span>{String.fromCharCode(65 + optionIndex)}</span>
            {option}
          </button>
        ))}
      </div>
      <button className="primary-button submit-button" type="button" onClick={submit} disabled={selected === null}>
        Execute answer
      </button>
    </div>
  );
}
