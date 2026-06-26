import { interviewCategories, interviewDifficulties } from "../../data/interview";

const reviewStatusOptions = [
  { value: "all", label: "All" },
  { value: "needs-review", label: "Needs Review" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
];

export default function InterviewFilters({
  query,
  setQuery,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  reviewStatus,
  setReviewStatus,
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
      <label>
        <span>review status</span>
        <select value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value)}>
          {reviewStatusOptions.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
