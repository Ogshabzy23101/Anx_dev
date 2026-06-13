export default function CorrectionModal({ correction, onClose }) {
  if (!correction) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="correction-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="correction-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-status">command_failed</div>
        <h2 id="correction-title">Not quite. Debug this one.</h2>
        <p>{correction.explanation}</p>
        {correction.feedback && (
          <div className="validation-feedback">
            <div className="feedback-column is-correct">
              <span>correct sections</span>
              <ul>
                {correction.feedback.passed.length ? correction.feedback.passed.map((item) => (
                  <li key={item}>✓ {item}</li>
                )) : <li>None yet</li>}
              </ul>
            </div>
            <div className="feedback-column is-missing">
              <span>missing sections</span>
              <ul>
                {correction.feedback.missing.map((item) => (
                  <li key={item}>✗ {item}</li>
                ))}
              </ul>
            </div>
            <div className="feedback-values">
              <div><span>expected value</span><code>{correction.feedback.expectedValue}</code></div>
              <div><span>user value</span><code>{correction.feedback.userValue}</code></div>
            </div>
          </div>
        )}
        {correction.answer && (
          <div className="answer-line">
            <span>expected</span>
            <code>{correction.answer}</code>
          </div>
        )}
        <button className="primary-button" type="button" onClick={onClose} autoFocus>
          Try the next step
        </button>
      </section>
    </div>
  );
}
