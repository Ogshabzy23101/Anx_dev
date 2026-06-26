export default function InterviewFeedbackModal({ feedback, onClose }) {
  if (!feedback) return null;

  const success = feedback.type === "success";

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`practice-modal ${success ? "is-success" : "is-error"}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="interview-feedback-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-status">{success ? "answer_ready" : "answer_needs_work"}</div>
        <h2 id="interview-feedback-title">
          {success ? "Strong interview answer." : "Tighten this answer."}
        </h2>
        <p>{feedback.improvementSuggestion}</p>
        <div className="validation-feedback">
          <div className="feedback-column is-correct">
            <span>covered points</span>
            <ul>
              {feedback.passed.length ? feedback.passed.map((item) => (
                <li key={item}>✓ {item}</li>
              )) : <li>None yet</li>}
            </ul>
          </div>
          <div className="feedback-column is-missing">
            <span>missing points</span>
            <ul>
              {feedback.missing.length ? feedback.missing.map((item) => (
                <li key={item}>✗ {item}</li>
              )) : <li>Nothing missing</li>}
            </ul>
          </div>
          <div className="feedback-values">
            <div><span>expected answer</span><pre>{feedback.expectedAnswer}</pre></div>
            <div><span>user answer</span><pre>{feedback.userAnswer || "(empty)"}</pre></div>
          </div>
        </div>
        <button className="primary-button" type="button" onClick={onClose} autoFocus>
          Continue
        </button>
      </section>
    </div>
  );
}
