export default function ModuleHeader({ eyebrow, title, description, badgeLabel, badgeValue }) {
  return (
    <section className="linux-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="module-badge">
        <span>{badgeLabel}</span>
        <code>{badgeValue}</code>
      </div>
    </section>
  );
}
