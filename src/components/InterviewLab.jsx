import { useEffect, useMemo, useState } from "react";
import { interviewFormulas, interviewQuestions } from "../data/interview";
import { validatePracticeAnswer } from "../utils/answerValidation";
import InterviewFeedback from "./interview/InterviewFeedback";
import InterviewFilters from "./interview/InterviewFilters";

const modes = [
  { id: "practice", label: "Practice", icon: "01" },
  { id: "reference", label: "Reference", icon: "02" },
];

function toRules(checklist) {
  return checklist.map((item) => ({ label: item.label, test: (answer) => item.pattern.test(answer) }));
}

function FormulaStrip({ formulaType }) {
  const formula = interviewFormulas[formulaType];
  return (
    <div className="formula-strip">
      <span>{formula.label} formula</span>
      <ol>
        {formula.stages.map((stage) => <li key={stage}>{stage}</li>)}
      </ol>
      <p>{formula.hint}</p>
    </div>
  );
}

export default function InterviewLab({ progress, setProgress }) {
  const [mode, setMode] = useState("practice");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const filteredQuestions = useMemo(() => {
    const search = query.trim().toLowerCase();
    return interviewQuestions.filter((item) => {
      const text = [item.question, item.modelAnswer, item.category].join(" ").toLowerCase();
      return (!search || text.includes(search))
        && (category === "all" || item.category === category)
        && (difficulty === "all" || item.difficulty === difficulty);
    });
  }, [category, difficulty, query]);

  const boundedIndex = Math.min(index, Math.max(filteredQuestions.length - 1, 0));
  const question = filteredQuestions[boundedIndex];

  useEffect(() => {
    setAnswer("");
    setResult(null);
  }, [question?.id]);

  const practicedIds = progress.interviewPracticedIds;

  function checkAnswer() {
    if (!question) return;
    const validation = validatePracticeAnswer(answer, toRules(question.checklist));
    setResult(validation);
    setProgress((current) => ({
      ...current,
      interviewPracticedIds: current.interviewPracticedIds.includes(question.id)
        ? current.interviewPracticedIds
        : [...current.interviewPracticedIds, question.id],
    }));
  }

  function selectQuestion(event) {
    setIndex(Number(event.target.value));
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">interview prep</span>
          <h1>DevOps Interview Practice</h1>
          <p>
            Every question follows a fixed formula so you can build an answer in your own words,
            not memorize a script. Write it like you&apos;d say it out loud, then check it against
            what a strong answer actually needs to hit.
          </p>
        </div>
        <div className="module-badge">
          <span>question bank</span>
          <code>{interviewQuestions.length} questions</code>
        </div>
      </section>

      <section className="interview-progress terminal-card">
        <span>{practicedIds.length}/{interviewQuestions.length} practiced</span>
      </section>

      <nav className="mode-tabs" aria-label="Interview modes">
        {modes.map((item) => (
          <button
            className={mode === item.id ? "active" : ""}
            type="button"
            key={item.id}
            aria-label={item.label}
            onClick={() => setMode(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <section className="mode-content">
        <InterviewFilters
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />

        {mode === "practice" && question && (
          <div className="practice-workspace">
            <section className="practice-instructions terminal-card">
              <div className="study-meta">
                <span>question {boundedIndex + 1}/{filteredQuestions.length}</span>
                <span>{practicedIds.includes(question.id) ? "practiced" : "not practiced yet"}</span>
              </div>
              <label className="task-selector">
                <span>question</span>
                <select value={boundedIndex} onChange={selectQuestion}>
                  {filteredQuestions.map((item, itemIndex) => (
                    <option value={itemIndex} key={item.id}>{itemIndex + 1}. {item.question}</option>
                  ))}
                </select>
              </label>
              <span className="eyebrow">{question.category} · {question.difficulty}</span>
              <h2>{question.question}</h2>
              <FormulaStrip formulaType={question.formulaType} />
            </section>

            <section className="practice-editor terminal-card">
              <div className="editor-chrome"><span /><span /><span /><code>interview-answer.md</code></div>
              <label className="sr-only" htmlFor="interview-answer">Your interview answer</label>
              <textarea
                id="interview-answer"
                value={answer}
                onChange={(event) => {
                  setAnswer(event.target.value);
                  setResult(null);
                }}
                placeholder="Type your answer like you'd actually say it out loud..."
                aria-label="Your interview answer"
              />
              <div className="editor-actions">
                <button className="primary-button" type="button" onClick={checkAnswer} disabled={!answer.trim()}>
                  Check my answer
                </button>
                <button className="ghost-button" type="button" onClick={() => { setAnswer(""); setResult(null); }}>
                  Clear
                </button>
              </div>
              <InterviewFeedback result={result} question={question} />
            </section>
          </div>
        )}

        {mode === "practice" && !question && (
          <div className="terminal-card empty-filter-result">No questions match these filters.</div>
        )}

        {mode === "reference" && (
          <div className="linux-command-grid interview-bank">
            {filteredQuestions.map((item) => (
              <details className="terminal-card linux-command-card" key={item.id}>
                <summary>
                  <span>
                    <code>{item.category}</code>
                    <small>{item.question}</small>
                  </span>
                  <span className="difficulty-badge intermediate">{item.difficulty}</span>
                </summary>
                <div className="command-detail">
                  <FormulaStrip formulaType={item.formulaType} />
                  <section><h3>Model answer</h3><p>{item.modelAnswer}</p></section>
                  <section>
                    <h3>A strong answer should</h3>
                    <ul>{item.checklist.map((check) => <li key={check.label}>{check.label}</li>)}</ul>
                  </section>
                  <section className="mistake-panel"><h3>Common mistake</h3><p>{item.commonMistake}</p></section>
                </div>
              </details>
            ))}
            {!filteredQuestions.length && (
              <div className="terminal-card empty-filter-result">No questions match these filters.</div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
