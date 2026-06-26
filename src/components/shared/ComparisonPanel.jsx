export default function ComparisonPanel({ leftTitle, left, rightTitle, right }) {
  return (
    <div className="comparison-grid">
      <div>
        <h4>{leftTitle}</h4>
        <pre>{left}</pre>
      </div>
      <div>
        <h4>{rightTitle}</h4>
        <pre>{right}</pre>
      </div>
    </div>
  );
}
