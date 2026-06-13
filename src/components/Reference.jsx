export default function Reference({ sections }) {
  return (
    <div className="reference-grid">
      {sections.map((section) => (
        <article className="terminal-card reference-card" key={section.category}>
          <div className="card-title">
            <span className="prompt-mark">$</span> {section.category.toLowerCase()}
          </div>
          <div className="command-list">
            {section.commands.map((item) => (
              <div className="command-row" key={item.command}>
                <code>{item.command}</code>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
