import { useMemo, useState } from "react";
import {
  linuxLabCategories,
  linuxPracticeLabs,
  practiceLabDifficulties,
  practiceRepository,
} from "../data/practiceLabs";
import { calculatePracticeLabStats } from "../utils/practiceLabProgress";

export default function PracticeLabs({ progress, setProgress }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const stats = useMemo(
    () => calculatePracticeLabStats(progress, linuxPracticeLabs),
    [progress],
  );

  const filteredLabs = useMemo(() => {
    const search = query.trim().toLowerCase();
    return linuxPracticeLabs.filter((lab) => {
      const text = [
        lab.title,
        lab.category,
        lab.scenario,
        lab.objectives.join(" "),
        lab.expectedCommands.join(" "),
        lab.realWorldExplanation,
        lab.relatedLinuxTopics.join(" "),
      ].join(" ").toLowerCase();
      return (!search || text.includes(search))
        && (category === "all" || lab.category === category)
        && (difficulty === "all" || lab.difficulty === difficulty);
    });
  }, [category, difficulty, query]);

  const activeIndex = Math.min(selectedIndex, Math.max(filteredLabs.length - 1, 0));
  const activeLab = filteredLabs[activeIndex];

  function resetLabView(nextIndex = activeIndex) {
    setSelectedIndex(nextIndex);
    setHintLevel(0);
    setShowSolution(false);
  }

  function saveStarted(lab) {
    setProgress((current) => ({
      ...current,
      practiceLabStartedIds: current.practiceLabStartedIds.includes(lab.id)
        ? current.practiceLabStartedIds
        : [...current.practiceLabStartedIds, lab.id],
    }));
  }

  function markComplete(lab) {
    setProgress((current) => ({
      ...current,
      practiceLabStartedIds: current.practiceLabStartedIds.includes(lab.id)
        ? current.practiceLabStartedIds
        : [...current.practiceLabStartedIds, lab.id],
      practiceLabCompletedIds: current.practiceLabCompletedIds.includes(lab.id)
        ? current.practiceLabCompletedIds
        : [...current.practiceLabCompletedIds, lab.id],
    }));
  }

  function logFailure(lab) {
    setProgress((current) => ({
      ...current,
      practiceLabStartedIds: current.practiceLabStartedIds.includes(lab.id)
        ? current.practiceLabStartedIds
        : [...current.practiceLabStartedIds, lab.id],
      practiceLabFailures: {
        ...current.practiceLabFailures,
        [lab.category]: (current.practiceLabFailures[lab.category] || 0) + 1,
      },
    }));
  }

  function resetProgress() {
    setProgress((current) => ({
      ...current,
      practiceLabStartedIds: [],
      practiceLabCompletedIds: [],
      practiceLabFailures: {},
    }));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">phase 15 / hands-on labs</span>
          <h1>Practice Labs</h1>
          <p>Work through realistic Linux DevOps tasks with guided objectives, hints, solutions, and production context.</p>
        </div>
        <div className="module-badge">
          <span>linux labs</span>
          <code>{linuxPracticeLabs.length} tasks</code>
        </div>
      </section>

      <section className="interview-progress terminal-card">
        <span>{stats.startedCount} started</span>
        <span>{stats.completedCount} complete</span>
        <span>{stats.completionPercentage}% done</span>
        <span>{stats.difficultyCompletion.Beginner?.percentage || 0}% beginner</span>
        <span>{stats.difficultyCompletion.Advanced?.percentage || 0}% advanced</span>
      </section>

      <div className="library-toolbar terminal-card">
        <label>
          <span>search labs</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetLabView(0);
            }}
            placeholder="grep, logs, permissions, services..."
          />
        </label>
        <label>
          <span>category</span>
          <select value={category} onChange={(event) => {
            setCategory(event.target.value);
            resetLabView(0);
          }}>
            <option value="all">All categories</option>
            {linuxLabCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>difficulty</span>
          <select value={difficulty} onChange={(event) => {
            setDifficulty(event.target.value);
            resetLabView(0);
          }}>
            <option value="all">All levels</option>
            {practiceLabDifficulties.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <section className="recommended-panel terminal-card">
        <span className="eyebrow">recommended practice areas</span>
        <p>
          You should practice:{" "}
          {stats.recommendedPracticeAreas.length
            ? stats.recommendedPracticeAreas.join(", ")
            : "Keep going. No weak areas detected yet."}
        </p>
      </section>

      {activeLab ? (
        <section className="practice-lab-layout">
          <aside className="terminal-card practice-lab-list">
            <div className="study-meta">
              <span>{filteredLabs.length} labs shown</span>
              <span>{activeIndex + 1}/{filteredLabs.length}</span>
            </div>
            {filteredLabs.map((lab, index) => (
              <details
                className="linux-command-card"
                key={lab.id}
                open={index === activeIndex}
              >
                <summary onClick={(event) => {
                  event.preventDefault();
                  saveStarted(lab);
                  resetLabView(index);
                }}>
                  <span>
                    <code>{lab.category}</code>
                    <small>{lab.title}</small>
                  </span>
                  <span className={`difficulty-badge ${lab.difficulty.toLowerCase()}`}>
                    {lab.difficulty}
                  </span>
                </summary>
              </details>
            ))}
          </aside>

          <article className="terminal-card practice-lab-detail">
            <div className="study-meta">
              <span>{activeLab.category}</span>
              <span>{activeLab.difficulty}</span>
            </div>
            <h2>{activeLab.title}</h2>
            <section>
              <h3>Scenario</h3>
              <p>{activeLab.scenario}</p>
            </section>
            <section>
              <h3>Objectives</h3>
              <ol>
                {activeLab.objectives.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </section>
            <section>
              <h3>Expected commands</h3>
              {activeLab.expectedCommands.map((command) => <code key={command}>{command}</code>)}
            </section>
            <section className="hint-box">
              <h3>Hints</h3>
              {activeLab.hints.slice(0, hintLevel).map((hint, index) => (
                <p key={hint}><b>Level {index + 1}:</b> {hint}</p>
              ))}
              {hintLevel === 0 && <p>No hints revealed yet.</p>}
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  saveStarted(activeLab);
                  setHintLevel((value) => Math.min(value + 1, activeLab.hints.length));
                }}
                disabled={hintLevel === activeLab.hints.length}
              >
                Reveal hint
              </button>
            </section>
            {showSolution && (
              <section className="solution-box">
                <h3>Solution</h3>
                <pre>{activeLab.solution}</pre>
              </section>
            )}
            <section className="use-case-panel">
              <h3>Real world explanation</h3>
              <p>{activeLab.realWorldExplanation}</p>
            </section>
            <section>
              <h3>Related Linux topics</h3>
              <p>{activeLab.relatedLinuxTopics.join(", ")}</p>
            </section>

            <div className="button-row">
              <button
                className="ghost-button"
                type="button"
                onClick={() => resetLabView(Math.max(activeIndex - 1, 0))}
                disabled={activeIndex === 0}
              >
                Previous Lab
              </button>
              <button className="ghost-button" type="button" onClick={() => {
                saveStarted(activeLab);
                setShowSolution((value) => !value);
              }}>
                {showSolution ? "Hide Solution" : "Reveal Solution"}
              </button>
              <button className="ghost-button" type="button" onClick={() => logFailure(activeLab)}>
                Log blocker
              </button>
              <button className="primary-button" type="button" onClick={() => markComplete(activeLab)}>
                Mark Complete
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => resetLabView(Math.min(activeIndex + 1, filteredLabs.length - 1))}
                disabled={activeIndex === filteredLabs.length - 1}
              >
                Next Lab
              </button>
            </div>
            <button className="ghost-button reset-progress-button" type="button" onClick={resetProgress}>
              Reset Progress
            </button>
          </article>
        </section>
      ) : (
        <div className="terminal-card empty-filter-result">No Practice Labs match these filters.</div>
      )}

      <section className="terminal-card practice-repo-panel">
        <div>
          <span className="eyebrow">practice repository</span>
          <h2>Download Linux Practice Repo</h2>
          <p>Zip generation is planned for a future phase. This static scaffold defines the folder structure the downloadable repo will use.</p>
        </div>
        <code>{practiceRepository.root}</code>
        <code>{practiceRepository.publicPath}</code>
        <ul>
          {practiceRepository.files.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </>
  );
}
