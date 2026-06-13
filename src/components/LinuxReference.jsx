import { useMemo, useState } from "react";
import { linuxCategories } from "../data/linux";

const difficulties = ["all", "beginner", "intermediate", "advanced"];

export default function LinuxReference({
  commands,
  categories = linuxCategories,
  searchLabel = "search commands and explanations",
  searchPlaceholder = "grep, networking, disk space...",
  itemNoun = "commands",
  emptyMessage = "No Linux commands match these filters.",
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return commands.filter((item) => {
      const matchesSearch = !search || [
        item.command,
        item.fullMeaning,
        item.basicExplanation,
        item.professionalExplanation,
        item.devOpsUseCase,
        item.examples.join(" "),
      ].join(" ").toLowerCase().includes(search);
      return matchesSearch
        && (category === "all" || item.category === category)
        && (difficulty === "all" || item.difficulty === difficulty);
    });
  }, [category, commands, difficulty, query]);

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
        <span>{filtered.length} of {commands.length} {itemNoun}</span>
        <span>select an item to expand</span>
      </div>

      <div className="linux-command-grid">
        {filtered.map((item) => (
          <details className="terminal-card linux-command-card" key={`${item.category}-${item.command}`}>
            <summary>
              <span>
                <code>{item.command}</code>
                <small>{item.fullMeaning}</small>
              </span>
              <span className={`difficulty-badge ${item.difficulty}`}>{item.difficulty}</span>
            </summary>
            <div className="command-detail">
              <section>
                <h3>Basic explanation</h3>
                <p>{item.basicExplanation}</p>
              </section>
              <section>
                <h3>Professional explanation</h3>
                <p>{item.professionalExplanation}</p>
              </section>
              <section>
                <h3>Common syntax</h3>
                <code>{item.commonSyntax}</code>
              </section>
              <section>
                <h3>Common flags</h3>
                <p>{item.commonFlags.length ? item.commonFlags.map((flag) => `\`${flag}\``).join(", ") : "No common flags for this shell form."}</p>
              </section>
              <section className="command-examples">
                <h3>Examples</h3>
                {item.examples.map((example) => <code key={example}>{example}</code>)}
              </section>
              <section className="use-case-panel">
                <h3>DevOps use case</h3>
                <p>{item.devOpsUseCase}</p>
              </section>
              <section className="mistake-panel">
                <h3>Common mistake</h3>
                <p>{item.commonMistake}</p>
              </section>
              <section>
                <h3>Related commands</h3>
                <p>{item.relatedCommands.join(", ")}</p>
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
