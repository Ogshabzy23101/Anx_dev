export default function PracticeRepository({ labConfig }) {
  return (
    <section className="terminal-card practice-repo-panel">
      <div>
        <span className="eyebrow">practice repository</span>
        <h2>Download {labConfig.label} Practice Repo</h2>
        <p>Zip generation is planned for a future phase. This static practice repository defines the folder structure and files the downloadable repo will use.</p>
      </div>
      <code>{labConfig.repository.root}</code>
      <code>{labConfig.repository.publicPath}</code>
      <ul>
        {labConfig.repository.files.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
