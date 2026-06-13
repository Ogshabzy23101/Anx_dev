export default function PracticeResultModal({
  result,
  userAnswer,
  expectedAnswer,
  onClose,
}) {
  if (!result) return null;

  const isSuccess = result.type === "success";

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`practice-modal ${isSuccess ? "is-success" : "is-error"}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="practice-result-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-status">
          {isSuccess ? "validation_passed" : "validation_failed"}
        </div>
        <h2 id="practice-result-title">
          {isSuccess ? "Script accepted." : "The script needs another pass."}
        </h2>
        <p>
          {isSuccess
            ? "Your answer contains all required parts."
            : `Missing: ${result.missing.join(", ")}.`}
        </p>

        <div className="answer-comparison">
          <div>
            <span>your answer</span>
            <pre>{userAnswer || "(empty)"}</pre>
          </div>
          <div>
            <span>expected answer</span>
            <pre>{expectedAnswer}</pre>
          </div>
        </div>

        <button className="primary-button" type="button" onClick={onClose} autoFocus>
          {isSuccess ? "Continue" : "Return to editor"}
        </button>
      </section>
    </div>
  );
}
