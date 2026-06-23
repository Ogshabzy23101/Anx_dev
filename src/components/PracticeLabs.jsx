import { useMemo, useState } from "react";
import {
  dockerLabCategories,
  dockerPracticeLabs,
  dockerPracticeRepository,
} from "../data/dockerPracticeLabs";
import {
  linuxLabCategories,
  linuxPracticeLabs,
  practiceLabDifficulties,
  practiceRepository,
} from "../data/practiceLabs";
import { calculatePracticeLabStats } from "../utils/practiceLabProgress";

export default function PracticeLabs({ progress, setProgress }) {
  const [activeLabSet, setActiveLabSet] = useState("linux");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const labSets = {
    linux: {
      label: "Linux",
      eyebrow: "phase 15 / hands-on labs",
      intro: "Work through realistic Linux DevOps tasks with guided objectives, hints, solutions, and production context.",
      badge: "linux labs",
      placeholder: "grep, logs, permissions, services...",
      topicHeading: "Related Linux topics",
      categories: linuxLabCategories,
      labs: linuxPracticeLabs,
      repository: practiceRepository,
      startedKey: "practiceLabStartedIds",
      completedKey: "practiceLabCompletedIds",
      failuresKey: "practiceLabFailures",
    },
    docker: {
      label: "Docker",
      eyebrow: "phase 15.3 / docker labs",
      intro: "Practice realistic Docker operations with guided scenarios for images, containers, Dockerfiles, Compose, networking, security, and troubleshooting.",
      badge: "docker labs",
      placeholder: "compose, Dockerfile, networks, logs...",
      topicHeading: "Related Docker topics",
      categories: dockerLabCategories,
      labs: dockerPracticeLabs,
      repository: dockerPracticeRepository,
      startedKey: "dockerPracticeLabStartedIds",
      completedKey: "dockerPracticeLabCompletedIds",
      failuresKey: "dockerPracticeLabFailures",
    },
  };

  const labConfig = labSets[activeLabSet];
  const startedIds = progress[labConfig.startedKey] || [];
  const completedIds = progress[labConfig.completedKey] || [];
  const failures = progress[labConfig.failuresKey] || {};

  const stats = useMemo(
    () => calculatePracticeLabStats({
      practiceLabStartedIds: startedIds,
      practiceLabCompletedIds: completedIds,
      practiceLabFailures: failures,
    }, labConfig.labs),
    [failures, labConfig.labs, startedIds, completedIds],
  );

  const filteredLabs = useMemo(() => {
    const search = query.trim().toLowerCase();
    return labConfig.labs.filter((lab) => {
      const text = [
        lab.title,
        lab.category,
        lab.scenario,
        lab.objectives.join(" "),
        lab.expectedCommands.join(" "),
        lab.realWorldExplanation,
        (lab.relatedLinuxTopics || lab.relatedDockerTopics || []).join(" "),
      ].join(" ").toLowerCase();
      return (!search || text.includes(search))
        && (category === "all" || lab.category === category)
        && (difficulty === "all" || lab.difficulty === difficulty);
    });
  }, [category, difficulty, labConfig.labs, query]);

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
      [labConfig.startedKey]: (current[labConfig.startedKey] || []).includes(lab.id)
        ? current[labConfig.startedKey]
        : [...(current[labConfig.startedKey] || []), lab.id],
    }));
  }

  function markComplete(lab) {
    setProgress((current) => ({
      ...current,
      [labConfig.startedKey]: (current[labConfig.startedKey] || []).includes(lab.id)
        ? current[labConfig.startedKey]
        : [...(current[labConfig.startedKey] || []), lab.id],
      [labConfig.completedKey]: (current[labConfig.completedKey] || []).includes(lab.id)
        ? current[labConfig.completedKey]
        : [...(current[labConfig.completedKey] || []), lab.id],
    }));
  }

  function logFailure(lab) {
    setProgress((current) => ({
      ...current,
      [labConfig.startedKey]: (current[labConfig.startedKey] || []).includes(lab.id)
        ? current[labConfig.startedKey]
        : [...(current[labConfig.startedKey] || []), lab.id],
      [labConfig.failuresKey]: {
        ...(current[labConfig.failuresKey] || {}),
        [lab.category]: ((current[labConfig.failuresKey] || {})[lab.category] || 0) + 1,
      },
    }));
  }

  function resetProgress() {
    setProgress((current) => ({
      ...current,
      [labConfig.startedKey]: [],
      [labConfig.completedKey]: [],
      [labConfig.failuresKey]: {},
    }));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">{labConfig.eyebrow}</span>
          <h1>Practice Labs</h1>
          <p>{labConfig.intro}</p>
        </div>
        <div className="module-badge">
          <span>{labConfig.badge}</span>
          <code>{labConfig.labs.length} tasks</code>
        </div>
      </section>

      <nav className="mode-tabs" aria-label="Practice lab sets">
        {Object.entries(labSets).map(([id, item]) => (
          <button
            className={activeLabSet === id ? "active" : ""}
            type="button"
            key={id}
            aria-label={`${item.label} Practice Labs`}
            onClick={() => {
              setActiveLabSet(id);
              setQuery("");
              setCategory("all");
              setDifficulty("all");
              resetLabView(0);
            }}
          >
            <span>{id === "linux" ? "01" : "02"}</span>
            {item.label}
          </button>
        ))}
      </nav>

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
            placeholder={labConfig.placeholder}
          />
        </label>
        <label>
          <span>category</span>
          <select value={category} onChange={(event) => {
            setCategory(event.target.value);
            resetLabView(0);
          }}>
            <option value="all">All categories</option>
            {labConfig.categories.map((item) => <option key={item}>{item}</option>)}
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
              <h3>{labConfig.topicHeading}</h3>
              <p>{(activeLab.relatedLinuxTopics || activeLab.relatedDockerTopics || []).join(", ")}</p>
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
          <h2>Download {labConfig.label} Practice Repo</h2>
          <p>Zip generation is planned for a future phase. This static practice repository defines the folder structure and files the downloadable repo will use.</p>
        </div>
        <code>{labConfig.repository.root}</code>
        <code>{labConfig.repository.publicPath}</code>
        <ul>
          {labConfig.repository.files.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </>
  );
}
