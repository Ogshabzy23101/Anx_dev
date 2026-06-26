import CategoryFilter from "./CategoryFilter";
import DifficultyFilter from "./DifficultyFilter";
import SearchBar from "./SearchBar";

export default function FilterBar({
  idPrefix,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
  difficulty,
  onDifficultyChange,
  difficulties,
  searchLabel,
  searchPlaceholder,
}) {
  return (
    <div className="library-toolbar">
      <SearchBar
        id={`${idPrefix}-search`}
        value={query}
        onChange={onQueryChange}
        label={searchLabel}
        placeholder={searchPlaceholder}
      />
      <CategoryFilter
        id={`${idPrefix}-category`}
        value={category}
        onChange={onCategoryChange}
        categories={categories}
      />
      <DifficultyFilter
        id={`${idPrefix}-difficulty`}
        value={difficulty}
        onChange={onDifficultyChange}
        difficulties={difficulties}
      />
    </div>
  );
}
