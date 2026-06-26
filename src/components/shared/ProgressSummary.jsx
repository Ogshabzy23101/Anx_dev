import ProgressBar from "../ProgressBar";

export default function ProgressSummary({ value, label, children }) {
  return (
    <div className="sidebar-progress">
      <ProgressBar value={value} label={label} />
      {children}
    </div>
  );
}
