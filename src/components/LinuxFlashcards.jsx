import { useEffect, useMemo, useState } from "react";
import { linuxCategories } from "../data/linux";

export default function LinuxFlashcards({ cards, mastered, onToggleMastered }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return cards.filter((card) => {
      const text = [
        card.front,
        card.basicExplanation,
        card.professionalExplanation,
        card.example,
        card.useCase,
        card.relatedConcepts.join(" "),
      ].join(" ").toLowerCase();
      return (!search || text.includes(search))
        && (category === "all" || card.category === category)
        && (difficulty === "all" || card.difficulty === difficulty);
    });
  }, [cards, category, difficulty, query]);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [query, category, difficulty]);

  const card = filtered[index];

  function move(direction) {
    setIndex((current) => (current + direction + filtered.length) % filtered.length);
    setFlipped(false);
  }

  return (
    <div className="linux-flashcard-library">
      <div className="library-toolbar terminal-card">
        <label>
          <span>search flashcards</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="pipes, permissions, services..."
          />
        </label>
        <label>
          <span>category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {linuxCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>difficulty</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="all">All levels</option>
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
          </select>
        </label>
      </div>

      {!card ? (
        <div className="terminal-card empty-filter-result">No flashcards match these filters.</div>
      ) : (
        <div className="study-layout">
          <div className="study-meta">
            <span>card {index + 1}/{filtered.length}</span>
            <span>{mastered.length}/{cards.length} mastered</span>
          </div>
          <button
            className={`flashcard linux-flashcard ${flipped ? "is-flipped" : ""}`}
            type="button"
            onClick={() => setFlipped((value) => !value)}
            aria-label="Flip Linux flashcard"
          >
            <span className="flashcard-header">
              <span className="card-side-label">{flipped ? "answer" : "question"}</span>
              <span className={`difficulty-badge ${card.difficulty}`}>{card.difficulty}</span>
            </span>
            {!flipped ? (
              <span className="flashcard-content">{card.front}</span>
            ) : (
              <span className="flashcard-reveal">
                <span><strong>Basic explanation</strong>{card.basicExplanation}</span>
                <span><strong>Professional explanation</strong>{card.professionalExplanation}</span>
                <span><strong>Example</strong><code>{card.example}</code></span>
                <span><strong>DevOps use case</strong>{card.useCase}</span>
                <span><strong>Related concepts</strong>{card.relatedConcepts.join(", ")}</span>
              </span>
            )}
            <span className="flip-hint">click to {flipped ? "see prompt" : "reveal"}</span>
          </button>
          <div className="button-row">
            <button className="ghost-button" type="button" onClick={() => move(-1)}>Previous</button>
            <button
              className={mastered.includes(card.id) ? "mastered-button" : "primary-button"}
              type="button"
              onClick={() => onToggleMastered(card.id)}
            >
              {mastered.includes(card.id) ? "Mastered" : "Mark mastered"}
            </button>
            <button className="ghost-button" type="button" onClick={() => move(1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
