export default function ProgressBar({ value, label }) {
  return (
    <div className="progress-group">
      <div className="progress-label">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="progress-track">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
