export default function LoadingState({ message = "Loading learning module..." }) {
  return (
    <section className="empty-tool" aria-live="polite">
      <div className="terminal-card">
        <span className="eyebrow">loading</span>
        <div className="large-prompt">$ import module</div>
        <h1>{message}</h1>
        <p>Preparing the lab workspace and restoring your saved progress.</p>
      </div>
    </section>
  );
}
