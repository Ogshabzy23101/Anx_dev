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
