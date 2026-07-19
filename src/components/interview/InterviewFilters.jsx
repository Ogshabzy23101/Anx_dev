import { interviewCategories, interviewDifficulties } from "../../data/interview";

export default function InterviewFilters({
  query,
  setQuery,
  category,
  setCategory,
  difficulty,
  setDifficulty,
}) {
  return (
    <div className="library-toolbar terminal-card">
      <label>
        <span>search interview questions</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="pods, state, outage, pipeline..."
        />
      </label>
      <label>
        <span>category</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {interviewCategories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span>difficulty</span>
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option value="all">All levels</option>
          {interviewDifficulties.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}
