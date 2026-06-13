import { useState } from "react";
import { getCommandFeedback, isCommandCorrect } from "../utils/answerValidation";

export default function CommandQuiz({
  questions,
  completedIds,
  onCorrect,
  onWrong,
  shellPrompt = "lab@linux:~$",
}) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const question = questions[index];

  function submit(event) {
    event.preventDefault();
    const isCorrect = isCommandCorrect(input, question.answers);

    if (isCorrect) {
      onCorrect(question.id);
      setStatus("accepted");
    } else {
      setStatus("");
      onWrong({
        explanation: question.explanation,
        answer: question.answers[0],
        feedback: getCommandFeedback(input, question.answers[0]),
      });
    }
  }

  function next() {
    setIndex((value) => (value + 1) % questions.length);
    setInput("");
    setStatus("");
  }

  return (
    <div className="quiz-panel terminal-card">
      <div className="study-meta">
        <span>challenge {index + 1}/{questions.length}</span>
        <span>{completedIds.length} solved</span>
      </div>
      <h2>{question.prompt}</h2>
      <form onSubmit={submit}>
        <label className="command-input">
          <span>{shellPrompt}</span>
          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setStatus("");
            }}
            placeholder="type your command"
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
        </label>
        <div className="command-actions">
          <button className="primary-button" type="submit" disabled={!input.trim()}>
            Run command
          </button>
          {status === "accepted" && (
            <button className="success-button" type="button" onClick={next}>
              accepted ✓ Next
            </button>
          )}
        </div>
      </form>
      <p className="quiz-note">Equivalent commands and documented alternatives are accepted.</p>
    </div>
  );
}
