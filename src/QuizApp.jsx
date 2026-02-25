import { useState, useEffect, useRef } from "react";

const questions = [
  {
    id: 1,
    type: "single",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: 1,
  },
  {
    id: 2,
    type: "multi",
    question: "Which of the following are programming languages? (Select all that apply)",
    options: ["Python", "Cobra", "JavaScript", "HTML"],
    answers: [0, 2],
  },
  {
    id: 3,
    type: "fill",
    question: "The powerhouse of the cell is the ___.",
    answer: "mitochondria",
  },
  {
    id: 4,
    type: "single",
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Core Processing Unit",
    ],
    answer: 0,
  },
  {
    id: 5,
    type: "multi",
    question: "Which are JavaScript frameworks? (Select all that apply)",
    options: ["React", "Laravel", "Vue", "Django"],
    answers: [0, 2],
  },
  {
    id: 6,
    type: "fill",
    question: "HTTP stands for HyperText Transfer ___.",
    answer: "protocol",
  },
  {
    id: 7,
    type: "single",
    question: "Who invented the World Wide Web?",
    options: ["Bill Gates", "Linus Torvalds", "Tim Berners-Lee", "Steve Jobs"],
    answer: 2,
  },
];

const COLORS = {
  bg: "#12131a",
  panel: "#1a1d2e",
  border: "#2a2d3e",
  accent: "#00e5ff",
  accent2: "#ff2d78",
  accent3: "#a259ff",
  text: "#e8eaf6",
  muted: "#7b8299",
  correct: "#00e676",
  wrong: "#ff1744",
  warn: "#ffab00",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    font-family: 'Rajdhani', sans-serif;
    color: ${COLORS.text};
    min-height: 100vh;
    overflow-x: hidden;
  }

  .quiz-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .orb-1 { width: 400px; height: 400px; background: rgba(162,89,255,0.12); top: -100px; right: -100px; }
  .orb-2 { width: 300px; height: 300px; background: rgba(0,229,255,0.1); bottom: -80px; left: -80px; }

  .card {
    position: relative;
    z-index: 1;
    background: ${COLORS.panel};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    width: 100%;
    max-width: 720px;
    padding: 40px;
    box-shadow: 0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,255,0.05);
    animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  .tag-single { background: rgba(0,229,255,0.1); color: ${COLORS.accent}; border: 1px solid rgba(0,229,255,0.25); }
  .tag-multi  { background: rgba(162,89,255,0.1); color: ${COLORS.accent3}; border: 1px solid rgba(162,89,255,0.25); }
  .tag-fill   { background: rgba(255,171,0,0.1);  color: ${COLORS.warn};    border: 1px solid rgba(255,171,0,0.25); }

  .q-number {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    color: ${COLORS.muted};
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  .q-text {
    font-size: 22px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 32px;
    color: ${COLORS.text};
  }

  .progress-bar {
    width: 100%;
    height: 3px;
    background: ${COLORS.border};
    border-radius: 99px;
    margin-bottom: 36px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent3});
    border-radius: 99px;
    transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 28px;
  }

  .opt-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    color: ${COLORS.text};
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  .opt-btn:hover:not(:disabled) {
    border-color: rgba(0,229,255,0.4);
    background: rgba(0,229,255,0.06);
    transform: translateX(3px);
  }
  .opt-btn.selected {
    border-color: ${COLORS.accent};
    background: rgba(0,229,255,0.1);
    color: ${COLORS.accent};
  }
  .opt-btn.selected-multi {
    border-color: ${COLORS.accent3};
    background: rgba(162,89,255,0.1);
    color: ${COLORS.accent3};
  }
  .opt-btn.correct {
    border-color: ${COLORS.correct};
    background: rgba(0,230,118,0.1);
    color: ${COLORS.correct};
  }
  .opt-btn.wrong {
    border-color: ${COLORS.wrong};
    background: rgba(255,23,68,0.1);
    color: ${COLORS.wrong};
  }
  .opt-btn:disabled { cursor: default; }

  .opt-label {
    width: 26px; height: 26px;
    border-radius: 6px;
    background: rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .fill-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 14px 18px;
    color: ${COLORS.text};
    font-family: 'Rajdhani', sans-serif;
    font-size: 17px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 28px;
  }
  .fill-input:focus { border-color: rgba(255,171,0,0.5); }
  .fill-input.correct { border-color: ${COLORS.correct}; background: rgba(0,230,118,0.07); }
  .fill-input.wrong   { border-color: ${COLORS.wrong};   background: rgba(255,23,68,0.07); }

  .feedback {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .feedback.correct { background: rgba(0,230,118,0.1); border: 1px solid rgba(0,230,118,0.25); color: ${COLORS.correct}; }
  .feedback.wrong   { background: rgba(255,23,68,0.1);  border: 1px solid rgba(255,23,68,0.25);  color: ${COLORS.wrong}; }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn-primary {
    font-family: 'Orbitron', monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 12px 28px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent3});
    color: #000;
  }
  .btn-primary:hover { transform: scale(1.04); box-shadow: 0 0 24px rgba(0,229,255,0.3); }
  .btn-primary:disabled { opacity: 0.4; cursor: default; transform: none; box-shadow: none; }

  .btn-ghost {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 12px 20px;
    border-radius: 8px;
    border: 1px solid ${COLORS.border};
    background: transparent;
    color: ${COLORS.muted};
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: ${COLORS.accent}; color: ${COLORS.accent}; }

  /* Score screen */
  .score-screen { text-align: center; }
  .score-circle {
    width: 160px; height: 160px;
    border-radius: 50%;
    border: 3px solid ${COLORS.border};
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    margin: 0 auto 32px;
    position: relative;
    background: radial-gradient(circle, rgba(0,229,255,0.07), transparent 70%);
  }
  .score-circle::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: conic-gradient(${COLORS.accent} var(--pct), transparent var(--pct));
    z-index: -1;
  }
  .score-num {
    font-family: 'Orbitron', monospace;
    font-size: 44px;
    font-weight: 900;
    color: ${COLORS.accent};
    line-height: 1;
  }
  .score-total {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    color: ${COLORS.muted};
    margin-top: 4px;
  }
  .score-title {
    font-family: 'Orbitron', monospace;
    font-size: 28px;
    font-weight: 900;
    margin-bottom: 10px;
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent3});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .score-msg {
    color: ${COLORS.muted};
    font-size: 17px;
    margin-bottom: 40px;
  }

  .result-list { text-align: left; margin-bottom: 36px; }
  .result-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid ${COLORS.border};
    font-size: 14px;
  }
  .result-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .result-q { font-weight: 600; margin-bottom: 2px; }
  .result-ans { color: ${COLORS.muted}; font-size: 13px; }

  /* Start screen */
  .start-screen { text-align: center; }
  .start-logo {
    font-family: 'Orbitron', monospace;
    font-size: 34px;
    font-weight: 900;
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent3});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }
  .start-sub {
    color: ${COLORS.muted};
    font-size: 16px;
    margin-bottom: 40px;
    line-height: 1.6;
  }
  .type-badges {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }
  .badge {
    padding: 8px 20px;
    border-radius: 99px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .hint { font-size: 13px; color: ${COLORS.muted}; }
`;

function getScoreMsg(pct) {
  if (pct === 100) return "🏆 Perfect Score! Absolute genius!";
  if (pct >= 80)  return "🚀 Excellent! You crushed it!";
  if (pct >= 60)  return "👍 Good job! Keep learning!";
  if (pct >= 40)  return "📚 Not bad. Study harder!";
  return "💡 Keep practicing, you'll get there!";
}

export default function QuizApp() {
  const [screen, setScreen] = useState("start"); // start | quiz | score
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [fillVal, setFillVal] = useState("");
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [selectedSingle, setSelectedSingle] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const q = questions[qIdx];
  const total = questions.length;

  function startQuiz() {
    setQIdx(0);
    setAnswers({});
    setSubmitted(false);
    setFillVal("");
    setSelectedMulti([]);
    setSelectedSingle(null);
    setFeedback(null);
    setScreen("quiz");
  }

  function checkAnswer() {
    let correct = false;
    let recordedAnswer;
    if (q.type === "single") {
      correct = selectedSingle === q.answer;
      recordedAnswer = { type: "single", selected: selectedSingle, correct };
    } else if (q.type === "multi") {
      const sorted = [...selectedMulti].sort();
      const answerSorted = [...q.answers].sort();
      correct = sorted.length === answerSorted.length && sorted.every((v, i) => v === answerSorted[i]);
      recordedAnswer = { type: "multi", selected: selectedMulti, correct };
    } else {
      correct = fillVal.trim().toLowerCase() === q.answer.toLowerCase();
      recordedAnswer = { type: "fill", value: fillVal, correct };
    }
    setAnswers((prev) => ({ ...prev, [qIdx]: recordedAnswer }));
    setFeedback(correct ? "correct" : "wrong");
    setSubmitted(true);
  }

  function nextQuestion() {
    if (qIdx + 1 < total) {
      setQIdx(qIdx + 1);
      setSubmitted(false);
      setFeedback(null);
      setFillVal("");
      setSelectedMulti([]);
      setSelectedSingle(null);
    } else {
      setScreen("score");
    }
  }

  const score = Object.values(answers).filter((a) => a.correct).length;
  const pct = Math.round((score / total) * 100);

  const canSubmit =
    (q?.type === "single" && selectedSingle !== null) ||
    (q?.type === "multi" && selectedMulti.length > 0) ||
    (q?.type === "fill" && fillVal.trim().length > 0);

  return (
    <>
      <style>{styles}</style>
      <div className="quiz-root">
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="card" key={screen + qIdx}>
          {screen === "start" && (
            <div className="start-screen">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
              <div className="start-logo">QUIZ GAME</div>
              <p className="start-sub">
                Test your knowledge with {total} questions across multiple formats.<br />
                Answer carefully — every point counts!
              </p>
              <div className="type-badges">
                <span className="badge tag-single">Single Choice</span>
                <span className="badge tag-multi">Multi Select</span>
                <span className="badge tag-fill">Fill in Blank</span>
              </div>
              <button className="btn-primary" onClick={startQuiz}>
                Start Quiz
              </button>
            </div>
          )}

          {screen === "quiz" && (
            <>
              <div className="q-number">Question {qIdx + 1} of {total}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((qIdx) / total) * 100}%` }} />
              </div>

              {q.type === "single" && <span className="tag tag-single">● Single Choice</span>}
              {q.type === "multi"  && <span className="tag tag-multi">◆ Multi Select</span>}
              {q.type === "fill"   && <span className="tag tag-fill">✎ Fill in the Blank</span>}

              <div className="q-text">{q.question}</div>

              {q.type === "fill" && (
                <input
                  className={`fill-input${submitted ? (answers[qIdx]?.correct ? " correct" : " wrong") : ""}`}
                  placeholder="Type your answer here..."
                  value={fillVal}
                  onChange={(e) => setFillVal(e.target.value)}
                  disabled={submitted}
                  onKeyDown={(e) => { if (e.key === "Enter" && canSubmit && !submitted) checkAnswer(); }}
                />
              )}

              {(q.type === "single" || q.type === "multi") && (
                <div className="options-grid">
                  {q.options.map((opt, i) => {
                    const labels = ["A", "B", "C", "D"];
                    let cls = "opt-btn";
                    if (!submitted) {
                      if (q.type === "single" && selectedSingle === i) cls += " selected";
                      if (q.type === "multi" && selectedMulti.includes(i)) cls += " selected-multi";
                    } else {
                      const isCorrectOpt = q.type === "single" ? q.answer === i : q.answers.includes(i);
                      const wasSelected = q.type === "single" ? selectedSingle === i : selectedMulti.includes(i);
                      if (isCorrectOpt) cls += " correct";
                      else if (wasSelected && !isCorrectOpt) cls += " wrong";
                    }
                    return (
                      <button
                        key={i}
                        className={cls}
                        disabled={submitted}
                        onClick={() => {
                          if (q.type === "single") setSelectedSingle(i);
                          else setSelectedMulti((prev) =>
                            prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                          );
                        }}
                      >
                        <span className="opt-label">{labels[i]}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === "multi" && !submitted && (
                <p className="hint" style={{ marginBottom: 16 }}>Select all that apply</p>
              )}

              {feedback && (
                <div className={`feedback ${feedback}`}>
                  {feedback === "correct" ? "✓ Correct!" : "✗ Incorrect"}
                  {feedback === "wrong" && q.type === "fill" && (
                    <span style={{ marginLeft: 8, opacity: 0.8 }}>
                      — Answer: <strong>{q.answer}</strong>
                    </span>
                  )}
                </div>
              )}

              <div className="actions">
                <button className="btn-ghost" onClick={() => setScreen("start")}>← Exit</button>
                {!submitted ? (
                  <button className="btn-primary" onClick={checkAnswer} disabled={!canSubmit}>
                    Submit
                  </button>
                ) : (
                  <button className="btn-primary" onClick={nextQuestion}>
                    {qIdx + 1 < total ? "Next →" : "See Results"}
                  </button>
                )}
              </div>
            </>
          )}

          {screen === "score" && (
            <div className="score-screen">
              <div
                className="score-circle"
                style={{ "--pct": `${pct}%` }}
              >
                <div className="score-num">{score}</div>
                <div className="score-total">/ {total}</div>
              </div>
              <div className="score-title">{pct}% Score</div>
              <div className="score-msg">{getScoreMsg(pct)}</div>

              <div className="result-list">
                {questions.map((question, i) => {
                  const ans = answers[i];
                  const isCorrect = ans?.correct;
                  return (
                    <div className="result-item" key={i}>
                      <span className="result-icon">{isCorrect ? "✅" : "❌"}</span>
                      <div>
                        <div className="result-q">{question.question}</div>
                        <div className="result-ans">
                          {question.type === "fill" && `Your answer: ${ans?.value || "—"}`}
                          {question.type === "single" && ans?.selected !== undefined &&
                            `You chose: ${question.options[ans.selected]}`}
                          {question.type === "multi" && ans?.selected &&
                            `You chose: ${ans.selected.map((s) => question.options[s]).join(", ") || "—"}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="btn-primary" onClick={startQuiz}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}