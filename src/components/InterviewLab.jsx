import { useMemo, useState } from "react";
import {
  interviewCategories,
  interviewDifficulties,
  interviewFlashcards,
  interviewMultipleChoice,
  interviewQuestions,
} from "../data/interview";
import { isMultipleChoiceCorrect } from "../utils/answerValidation";
import { scoreMockInterview, validateWrittenAnswer } from "../utils/interviewValidation";

const modes = [
  { id: "bank", label: "Q&A Bank", icon: "01" },
  { id: "flashcards", label: "Interview Flashcards", icon: "02" },
  { id: "quiz", label: "Interview Quiz", icon: "03" },
  { id: "written", label: "Written Practice", icon: "04" },
  { id: "mock", label: "Mock Interview", icon: "05" },
];

function Filters({ query, setQuery, category, setCategory, difficulty, setDifficulty }) {
  return (
    <div className="library-toolbar terminal-card">
      <label>
        <span>search interview questions</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="pods, state, outage, pipeline..."
        />
      </label>
      <label>
        <span>category</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {interviewCategories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span>difficulty</span>
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option value="all">All levels</option>
          {interviewDifficulties.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}

function FeedbackModal({ feedback, onClose }) {
  if (!feedback) return null;

  const success = feedback.type === "success";

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`practice-modal ${success ? "is-success" : "is-error"}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="interview-feedback-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-status">{success ? "answer_ready" : "answer_needs_work"}</div>
        <h2 id="interview-feedback-title">
          {success ? "Strong interview answer." : "Tighten this answer."}
        </h2>
        <p>{feedback.improvementSuggestion}</p>
        <div className="validation-feedback">
          <div className="feedback-column is-correct">
            <span>covered points</span>
            <ul>
              {feedback.passed.length ? feedback.passed.map((item) => (
                <li key={item}>✓ {item}</li>
              )) : <li>None yet</li>}
            </ul>
          </div>
          <div className="feedback-column is-missing">
            <span>missing points</span>
            <ul>
              {feedback.missing.length ? feedback.missing.map((item) => (
                <li key={item}>✗ {item}</li>
              )) : <li>Nothing missing</li>}
            </ul>
          </div>
          <div className="feedback-values">
            <div><span>expected answer</span><pre>{feedback.expectedAnswer}</pre></div>
            <div><span>user answer</span><pre>{feedback.userAnswer || "(empty)"}</pre></div>
          </div>
        </div>
        <button className="primary-button" type="button" onClick={onClose} autoFocus>
          Continue
        </button>
      </section>
    </div>
  );
}

export default function InterviewLab({ progress, setProgress, onWrong }) {
  const [mode, setMode] = useState("bank");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [writtenIndex, setWrittenIndex] = useState(0);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [mockQuestions, setMockQuestions] = useState([]);
  const [mockIndex, setMockIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState({});
  const [mockAnswer, setMockAnswer] = useState("");
  const [mockResult, setMockResult] = useState(null);

  const filteredQuestions = useMemo(() => {
    const search = query.trim().toLowerCase();
    return interviewQuestions.filter((item) => {
      const text = [
        item.question,
        item.shortAnswer,
        item.detailedAnswer,
        item.example,
        item.commonMistake,
        item.interviewTip,
      ].join(" ").toLowerCase();
      return (!search || text.includes(search))
        && (category === "all" || item.category === category)
        && (difficulty === "all" || item.difficulty === difficulty);
    });
  }, [category, difficulty, query]);

  const filteredFlashcards = useMemo(() => (
    interviewFlashcards.filter((card) => filteredQuestions.some((item) => `flashcard-${item.id}` === card.id))
  ), [filteredQuestions]);

  const visibleQuiz = useMemo(() => (
    interviewMultipleChoice.filter((question) => (
      filteredQuestions.some((item) => `mcq-${item.id}` === question.id)
    ))
  ), [filteredQuestions]);

  const flashcard = filteredFlashcards[flashcardIndex % Math.max(filteredFlashcards.length, 1)];
  const quizQuestion = visibleQuiz[quizIndex % Math.max(visibleQuiz.length, 1)];
  const writtenQuestion = filteredQuestions[writtenIndex % Math.max(filteredQuestions.length, 1)];

  function saveReviewed(id) {
    setProgress((current) => ({
      ...current,
      interviewReviewedQuestions: current.interviewReviewedQuestions.includes(id)
        ? current.interviewReviewedQuestions
        : [...current.interviewReviewedQuestions, id],
    }));
  }

  function toggleMastered(id) {
    setProgress((current) => ({
      ...current,
      interviewMasteredFlashcards: current.interviewMasteredFlashcards.includes(id)
        ? current.interviewMasteredFlashcards.filter((cardId) => cardId !== id)
        : [...current.interviewMasteredFlashcards, id],
    }));
  }

  function submitQuiz() {
    if (selected === null || !quizQuestion) return;
    const correct = isMultipleChoiceCorrect(quizQuestion, selected);
    const nextCorrect = quizCorrect + (correct ? 1 : 0);

    if (!correct) {
      onWrong({
        explanation: quizQuestion.explanation,
        answer: quizQuestion.options[quizQuestion.answer],
      });
    }

    if (quizIndex === visibleQuiz.length - 1) {
      const score = Math.round((nextCorrect / visibleQuiz.length) * 100);
      setProgress((current) => ({
        ...current,
        interviewQuizScore: Math.max(current.interviewQuizScore, score),
      }));
      setQuizIndex(0);
      setQuizCorrect(0);
      setSelected(null);
      return;
    }

    setQuizCorrect(nextCorrect);
    setQuizIndex((value) => value + 1);
    setSelected(null);
  }

  function submitWritten() {
    if (!writtenQuestion) return;
    const validation = validateWrittenAnswer(writtenAnswer, writtenQuestion.requiredKeywords);
    const completed = validation.isCorrect;

    if (completed) {
      setProgress((current) => ({
        ...current,
        interviewCompletedWritten: current.interviewCompletedWritten.includes(writtenQuestion.id)
          ? current.interviewCompletedWritten
          : [...current.interviewCompletedWritten, writtenQuestion.id],
      }));
    }

    setFeedback({
      type: completed ? "success" : "error",
      passed: validation.passed,
      missing: validation.missing,
      expectedAnswer: `${writtenQuestion.shortAnswer}\n\n${writtenQuestion.detailedAnswer}`,
      userAnswer: writtenAnswer,
      improvementSuggestion: completed
        ? "You covered the key interview points. Add a real incident or project example for extra polish."
        : `Add the missing concepts: ${validation.missing.join(", ")}. Keep the answer structured and specific.`,
    });
  }

  function startMockInterview() {
    const shuffled = [...interviewQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setMockQuestions(shuffled);
    setMockIndex(0);
    setMockAnswers({});
    setMockAnswer("");
    setMockResult(null);
  }

  function submitMockAnswer() {
    const question = mockQuestions[mockIndex];
    const nextAnswers = { ...mockAnswers, [question.id]: mockAnswer };

    if (mockIndex === mockQuestions.length - 1) {
      const result = scoreMockInterview(nextAnswers, mockQuestions);
      setMockAnswers(nextAnswers);
      setMockResult(result);
      setProgress((current) => ({
        ...current,
        interviewCompletedMocks: current.interviewCompletedMocks + 1,
        interviewWeakCategories: result.weakAreas,
      }));
      return;
    }

    setMockAnswers(nextAnswers);
    setMockIndex((value) => value + 1);
    setMockAnswer("");
  }

  return (
    <>
      <section className="linux-heading">
        <div>
          <span className="eyebrow">phase 14 / interview prep</span>
          <h1>Interview Mode</h1>
          <p>Practice DevOps interview answers with question banks, flashcards, quizzes, written feedback, and mock sessions.</p>
        </div>
        <div className="module-badge">
          <span>question bank</span>
          <code>{interviewQuestions.length} prompts</code>
        </div>
      </section>

      <section className="interview-progress terminal-card">
        <span>{progress.interviewReviewedQuestions.length} reviewed</span>
        <span>{progress.interviewMasteredFlashcards.length} mastered</span>
        <span>{progress.interviewQuizScore}% quiz</span>
        <span>{progress.interviewCompletedWritten.length} written</span>
        <span>{progress.interviewCompletedMocks} mocks</span>
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
        {mode !== "mock" && (
          <Filters
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        )}

        {mode === "bank" && (
          <div className="linux-command-grid interview-bank">
            {filteredQuestions.map((item) => (
              <details
                className="terminal-card linux-command-card"
                key={item.id}
                onToggle={(event) => {
                  if (event.currentTarget.open) saveReviewed(item.id);
                }}
              >
                <summary>
                  <span>
                    <code>{item.category}</code>
                    <small>{item.question}</small>
                  </span>
                  <span className="difficulty-badge intermediate">{item.difficulty}</span>
                </summary>
                <div className="command-detail">
                  <section><h3>Short answer</h3><p>{item.shortAnswer}</p></section>
                  <section><h3>Detailed answer</h3><p>{item.detailedAnswer}</p></section>
                  <section><h3>Example</h3><p>{item.example}</p></section>
                  <section className="mistake-panel"><h3>Common mistake</h3><p>{item.commonMistake}</p></section>
                  <section className="use-case-panel"><h3>Interview tip</h3><p>{item.interviewTip}</p></section>
                  <button className="ghost-button" type="button" onClick={() => saveReviewed(item.id)}>
                    Mark reviewed
                  </button>
                </div>
              </details>
            ))}
          </div>
        )}

        {mode === "flashcards" && flashcard && (
          <div className="study-layout">
            <div className="study-meta">
              <span>card {flashcardIndex + 1}/{filteredFlashcards.length}</span>
              <span>{progress.interviewMasteredFlashcards.length}/{interviewFlashcards.length} mastered</span>
            </div>
            <button
              className={`flashcard linux-flashcard ${flipped ? "is-flipped" : ""}`}
              type="button"
              aria-label="Flip interview flashcard"
              onClick={() => setFlipped((value) => !value)}
            >
              <span className="flashcard-header">
                <span className="card-side-label">{flipped ? "answer" : "question"}</span>
                <span className="difficulty-badge beginner">{flashcard.difficulty}</span>
              </span>
              {!flipped ? (
                <span className="flashcard-content">{flashcard.front}</span>
              ) : (
                <span className="flashcard-reveal">
                  <span><strong>Short answer</strong>{flashcard.shortAnswer}</span>
                  <span><strong>Deeper explanation</strong>{flashcard.deeperExplanation}</span>
                  <span><strong>Example</strong><code>{flashcard.example}</code></span>
                  <span><strong>Interview tip</strong>{flashcard.interviewTip}</span>
                </span>
              )}
              <span className="flip-hint">click to {flipped ? "see prompt" : "reveal"}</span>
            </button>
            <div className="button-row">
              <button className="ghost-button" type="button" onClick={() => setFlashcardIndex((value) => Math.max(value - 1, 0))}>Previous</button>
              <button className="primary-button" type="button" onClick={() => toggleMastered(flashcard.id)}>
                {progress.interviewMasteredFlashcards.includes(flashcard.id) ? "Mastered" : "Mark mastered"}
              </button>
              <button className="ghost-button" type="button" onClick={() => setFlashcardIndex((value) => (value + 1) % filteredFlashcards.length)}>Next</button>
            </div>
          </div>
        )}

        {mode === "quiz" && quizQuestion && (
          <div className="quiz-panel terminal-card">
            <div className="study-meta">
              <span>question {quizIndex + 1}/{visibleQuiz.length}</span>
              <span>{quizCorrect} correct</span>
            </div>
            <h2>{quizQuestion.question}</h2>
            <div className="option-list">
              {quizQuestion.options.map((option, optionIndex) => (
                <button
                  className={selected === optionIndex ? "quiz-option selected" : "quiz-option"}
                  type="button"
                  key={option}
                  onClick={() => setSelected(optionIndex)}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>
                  {option}
                </button>
              ))}
            </div>
            <button className="primary-button submit-button" type="button" onClick={submitQuiz} disabled={selected === null}>
              Submit interview answer
            </button>
          </div>
        )}

        {mode === "written" && writtenQuestion && (
          <div className="practice-workspace">
            <section className="practice-instructions terminal-card">
              <div className="study-meta">
                <span>written answer practice</span>
                <span>{progress.interviewCompletedWritten.length}/{interviewQuestions.length} complete</span>
              </div>
              <label className="task-selector">
                <span>question</span>
                <select value={writtenIndex} onChange={(event) => {
                  setWrittenIndex(Number(event.target.value));
                  setWrittenAnswer("");
                }}>
                  {filteredQuestions.map((item, index) => (
                    <option value={index} key={item.id}>{index + 1}. {item.question}</option>
                  ))}
                </select>
              </label>
              <span className="eyebrow">prompt</span>
              <h2>{writtenQuestion.question}</h2>
              <div className="requirement-list">
                <span>important concepts</span>
                <ul>{writtenQuestion.requiredKeywords.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </section>
            <section className="practice-editor terminal-card">
              <div className="editor-chrome"><span /><span /><span /><code>interview-answer.md</code></div>
              <textarea
                aria-label="Written interview answer"
                value={writtenAnswer}
                onChange={(event) => setWrittenAnswer(event.target.value)}
                placeholder="Type your answer like you would say it in an interview..."
              />
              <div className="editor-actions">
                <button className="primary-button" type="button" onClick={submitWritten} disabled={!writtenAnswer.trim()}>
                  Validate answer
                </button>
                <button className="ghost-button" type="button" onClick={() => setWrittenAnswer("")}>
                  Retry
                </button>
              </div>
            </section>
          </div>
        )}

        {mode === "mock" && (
          <section className="terminal-card mock-panel">
            {!mockQuestions.length && (
              <>
                <span className="eyebrow">mock interview</span>
                <h2>Run a five-question DevOps mock interview.</h2>
                <p>Questions are selected across the interview bank. Your result highlights strong areas, weak areas, and modules to review.</p>
                <button className="primary-button" type="button" onClick={startMockInterview}>Start mock interview</button>
              </>
            )}
            {!!mockQuestions.length && !mockResult && (
              <>
                <div className="study-meta">
                  <span>mock question {mockIndex + 1}/{mockQuestions.length}</span>
                  <span>{mockQuestions[mockIndex].category}</span>
                </div>
                <h2>{mockQuestions[mockIndex].question}</h2>
                <textarea
                  aria-label="Mock interview answer"
                  value={mockAnswer}
                  onChange={(event) => setMockAnswer(event.target.value)}
                  placeholder="Answer out loud first, then capture the key points here..."
                />
                <button className="primary-button" type="button" onClick={submitMockAnswer} disabled={!mockAnswer.trim()}>
                  {mockIndex === mockQuestions.length - 1 ? "Finish mock interview" : "Next question"}
                </button>
              </>
            )}
            {mockResult && (
              <div className="mock-result">
                <span className="eyebrow">mock complete</span>
                <strong>{mockResult.score}%</strong>
                <h2>{mockResult.score >= 70 ? "Solid interview pass." : "Review pass recommended."}</h2>
                <p><b>Strong areas:</b> {mockResult.strongAreas.join(", ") || "None yet"}</p>
                <p><b>Weak areas:</b> {mockResult.weakAreas.join(", ") || "None"}</p>
                <p><b>Suggested modules:</b> {mockResult.suggestedModules.join(", ") || "Keep practicing mixed interview prompts"}</p>
                <button className="primary-button" type="button" onClick={startMockInterview}>Run another mock</button>
              </div>
            )}
          </section>
        )}
      </section>

      <FeedbackModal feedback={feedback} onClose={() => setFeedback(null)} />
    </>
  );
}
