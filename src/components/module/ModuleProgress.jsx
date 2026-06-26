import ProgressBar from "../ProgressBar";

export default function ModuleProgress({ value, label, detail }) {
  return (
    <div className="sidebar-progress">
      <ProgressBar value={value} label={label} />
      {detail && <p>{detail}</p>}
    </div>
  );
}
