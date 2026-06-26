import { useMemo, useState } from "react";

const difficulties = ["all", "beginner", "intermediate", "advanced"];

export default function LectureNotes({
  notes,
  categories,
  searchLabel = "search lecture notes",
  searchPlaceholder = "architecture, networking, RBAC...",
  emptyMessage = "No lecture notes match these filters.",
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesSearch = !search || [
        note.title,
        note.category,
        note.summary,
        note.beginnerExplanation,
        note.professionalExplanation,
        note.example,
        note.useCase,
        note.commonMistakes,
        note.relatedTopics.join(" "),
      ].join(" ").toLowerCase().includes(search);
      return matchesSearch
        && (category === "all" || note.category === category)
        && (difficulty === "all" || note.difficulty === difficulty);
    });
  }, [category, difficulty, notes, query]);

  return (
    <div className="linux-library">
      <div className="library-toolbar terminal-card">
        <label>
          <span>{searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </label>
        <label>
          <span>category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>difficulty</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            {difficulties.map((item) => (
              <option value={item} key={item}>
                {item === "all" ? "All levels" : item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="library-summary" aria-live="polite">
        <span>{filtered.length} of {notes.length} notes</span>
        <span>select a note to expand</span>
      </div>

      <div className="linux-command-grid">
        {filtered.map((note) => (
          <details className="terminal-card linux-command-card" key={note.id}>
            <summary>
              <span>
                <code>{note.title}</code>
                <small>{note.summary}</small>
              </span>
              <span className={`difficulty-badge ${note.difficulty}`}>{note.difficulty}</span>
            </summary>
            <div className="command-detail">
              <section>
                <h3>Beginner explanation</h3>
                <p>{note.beginnerExplanation}</p>
              </section>
              <section>
                <h3>Professional explanation</h3>
                <p>{note.professionalExplanation}</p>
              </section>
              <section className="command-examples">
                <h3>Example</h3>
                <code>{note.example}</code>
              </section>
              <section className="use-case-panel">
                <h3>DevOps use case</h3>
                <p>{note.useCase}</p>
              </section>
              <section className="mistake-panel">
                <h3>Common mistakes</h3>
                <p>{note.commonMistakes}</p>
              </section>
              <section>
                <h3>Related topics</h3>
                <p>{note.relatedTopics.join(", ")}</p>
              </section>
            </div>
          </details>
        ))}
      </div>

      {!filtered.length && (
        <div className="terminal-card empty-filter-result">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
