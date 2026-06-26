const defaultDifficulties = ["Beginner", "Intermediate", "Advanced"];

export default function DifficultyFilter({
  id,
  value,
  onChange,
  difficulties = defaultDifficulties,
  label = "Difficulty",
}) {
  return (
    <label htmlFor={id}>
      {label}
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">All difficulties</option>
        {difficulties.map((difficulty) => (
          <option key={difficulty} value={difficulty}>
            {difficulty}
          </option>
        ))}
      </select>
    </label>
  );
}
