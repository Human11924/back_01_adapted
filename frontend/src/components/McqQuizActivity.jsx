import { useMemo, useState } from "react";
import api from "../services/api";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function sortByOrderIndex(items = []) {
  return [...items].sort((a, b) => (a?.order_index ?? 0) - (b?.order_index ?? 0));
}

export default function McqQuizActivity({ activity, onComplete }) {
  const questions = useMemo(
    () => sortByOrderIndex(activity?.content_json?.questions || []),
    [activity]
  );

  const [selectedByIndex, setSelectedByIndex] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (questions.length === 0) {
    return <div style={{ fontSize: 14, color: "var(--text)" }}>No quiz questions configured.</div>;
  }

  const answeredCount = Object.keys(selectedByIndex).length;

  const handleSubmit = async () => {
    if (submitted || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const answers = questions.map((q, idx) => {
        const userAnswer = selectedByIndex[idx] || "";
        const isCorrect = normalize(userAnswer) === normalize(q.correct_answer);

        return {
          question: q.question,
          expected_answer: q.correct_answer,
          user_answer: userAnswer,
          is_correct: isCorrect,
        };
      });

      const correctCount = answers.filter((a) => a.is_correct).length;
      const score = correctCount * 10;

      await api.post(`/activities/${activity.id}/attempt`, {
        score,
        answers_json: answers,
      });

      setResult({ correctCount, total: questions.length, score });
      setSubmitted(true);
      onComplete?.({ kind: "mcq_quiz", score, correctCount, total: questions.length });
    } catch (err) {
      const message = err?.response?.data?.detail || err?.message || "Failed to submit quiz attempt";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {questions.map((q, idx) => {
        const selected = selectedByIndex[idx] || "";
        const isAnswered = Boolean(selected);

        return (
          <div
            key={`${q.question}-${idx}`}
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              background: "#fff",
              padding: 10,
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-h)" }}>
              {idx + 1}. {q.question}
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              {(q.options || []).map((option) => (
                <label
                  key={option}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    color: "var(--text-h)",
                    opacity: submitted ? 0.85 : 1,
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={option}
                    checked={selected === option}
                    disabled={submitted}
                    onChange={(e) => {
                      setSelectedByIndex((prev) => ({
                        ...prev,
                        [idx]: e.target.value,
                      }));
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>

            {submitted ? (
              <div style={{ fontSize: 13, color: "var(--text)" }}>
                Correct: <strong>{q.correct_answer}</strong>
                {isAnswered && normalize(selected) === normalize(q.correct_answer)
                  ? "  (your answer is correct)"
                  : ""}
              </div>
            ) : null}
          </div>
        );
      })}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: "var(--text)" }}>
          Answered: {answeredCount}/{questions.length}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || submitting || answeredCount < questions.length}
          style={{
            cursor:
              submitted || submitting || answeredCount < questions.length
                ? "not-allowed"
                : "pointer",
            borderRadius: 10,
            padding: "10px 12px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-h)",
            fontSize: 14,
          }}
        >
          {submitting ? "Submitting..." : submitted ? "Submitted" : "Submit quiz"}
        </button>
      </div>

      {result ? (
        <div style={{ fontSize: 14, color: "var(--text-h)", fontWeight: 600 }}>
          Quiz result: {result.correctCount}/{result.total} correct, score {result.score}
        </div>
      ) : null}

      {error ? (
        <div
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid var(--accent-border)",
            background: "var(--accent-bg)",
            color: "var(--text-h)",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}

