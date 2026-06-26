export default function PracticeFilters({
  query,
  setQuery,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  labConfig,
  difficulties,
  resetLabView,
}) {
  return (
    <div className="library-toolbar terminal-card">
      <label>
        <span>search labs</span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            resetLabView(0);
          }}
          placeholder={labConfig.placeholder}
        />
      </label>
      <label>
        <span>category</span>
        <select value={category} onChange={(event) => {
          setCategory(event.target.value);
          resetLabView(0);
        }}>
          <option value="all">All categories</option>
          {labConfig.categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span>difficulty</span>
        <select value={difficulty} onChange={(event) => {
          setDifficulty(event.target.value);
          resetLabView(0);
        }}>
          <option value="all">All levels</option>
          {difficulties.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}
