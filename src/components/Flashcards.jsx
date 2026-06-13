import { useState } from "react";

export default function Flashcards({ cards, mastered, onToggleMastered }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];
  const isMastered = mastered.includes(card.id);

  function move(direction) {
    setIndex((current) => (current + direction + cards.length) % cards.length);
    setFlipped(false);
  }

  return (
    <div className="study-layout">
      <div className="study-meta">
        <span>card {index + 1}/{cards.length}</span>
        <span>{mastered.length} mastered</span>
      </div>
      <button
        className={`flashcard ${flipped ? "is-flipped" : ""}`}
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-label="Flip flashcard"
      >
        <span className="card-side-label">{flipped ? "answer" : "question"}</span>
        <span className="flashcard-content">{flipped ? card.back : card.front}</span>
        <span className="flip-hint">click to {flipped ? "see prompt" : "reveal"}</span>
      </button>
      <div className="button-row">
        <button className="ghost-button" type="button" onClick={() => move(-1)}>← Previous</button>
        <button
          className={isMastered ? "mastered-button" : "primary-button"}
          type="button"
          onClick={() => onToggleMastered(card.id)}
        >
          {isMastered ? "✓ Mastered" : "Mark mastered"}
        </button>
        <button className="ghost-button" type="button" onClick={() => move(1)}>Next →</button>
      </div>
    </div>
  );
}
