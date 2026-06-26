export default function EmptyState({
  eyebrow = "nothing here yet",
  prompt = "$ search",
  title,
  children,
}) {
  return (
    <section className="empty-tool">
      <div className="terminal-card">
        <span className="eyebrow">{eyebrow}</span>
        <div className="large-prompt">{prompt}</div>
        {title && <h1>{title}</h1>}
        {children}
      </div>
    </section>
  );
}
