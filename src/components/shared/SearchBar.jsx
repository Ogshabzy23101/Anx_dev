export default function SearchBar({
  id,
  value,
  onChange,
  label = "Search",
  placeholder = "Search...",
}) {
  return (
    <label htmlFor={id}>
      {label}
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
