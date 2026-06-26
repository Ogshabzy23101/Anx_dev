export default function ModuleNavigation({ label, modes, activeMode, onChange }) {
  return (
    <nav className="mode-tabs" aria-label={label}>
      {modes.map((item) => (
        <button
          className={activeMode === item.id ? "active" : ""}
          type="button"
          key={item.id}
          aria-label={item.label}
          aria-pressed={activeMode === item.id}
          onClick={() => onChange(item.id)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
