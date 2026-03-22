import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import "./TirGame.css";

const ROUND_MS = 15000;
const FAST_MS = 5000;

const FALLBACK_ITEMS = [
  { prompt_ru: "меню", answer_en: "menu", order_index: 1 },
  { prompt_ru: "счёт", answer_en: "bill", order_index: 2 },
  { prompt_ru: "заказ", answer_en: "order", order_index: 3 },
  { prompt_ru: "столик", answer_en: "table", order_index: 4 },
  { prompt_ru: "вода", answer_en: "water", order_index: 5 },
  { prompt_ru: "кофе", answer_en: "coffee", order_index: 6 },
  { prompt_ru: "чай", answer_en: "tea", order_index: 7 },
  { prompt_ru: "гость", answer_en: "guest", order_index: 8 },
];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function sanitizeItems(activity) {
  const raw = activity?.content_json?.vocabulary_items;
  const source = Array.isArray(raw) && raw.length > 0 ? raw : FALLBACK_ITEMS;

  return [...source]
    .sort((a, b) => (a?.order_index ?? 0) - (b?.order_index ?? 0))
    .map((item, idx) => ({
      prompt_ru: String(item?.prompt_ru || ""),
      answer_en: String(item?.answer_en || "").trim(),
      order_index: Number(item?.order_index ?? idx + 1),
    }))
    .filter((item) => item.prompt_ru && item.answer_en);
}

function playSuccessBeep() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;

  const ctx = new Context();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.value = 860;

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

export default function TirGame({ activity, onComplete }) {
  const items = useMemo(() => sanitizeItems(activity), [activity]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackKind, setFeedbackKind] = useState("neutral");
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(ROUND_MS);
  const [targetKey, setTargetKey] = useState(0);
  const [targetHit, setTargetHit] = useState(false);
  const [hitMarkers, setHitMarkers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [attemptSaved, setAttemptSaved] = useState(false);
  const [attemptError, setAttemptError] = useState("");
  const [completionNotified, setCompletionNotified] = useState(false);

  const startedAtRef = useRef(0);
  const resolvedRef = useRef(false);
  const scoreRef = useRef(0);
  const answersRef = useRef([]);
  const submittingRef = useRef(false);
  const arenaRef = useRef(null);
  const targetRef = useRef(null);
  const inputRef = useRef(null);

  const currentItem = items[currentIndex] || null;
  const wordsProgressPercent = items.length > 0 ? Math.round((answers.length / items.length) * 100) : 0;
  const timeProgressPercent = Math.max(0, Math.min(100, Math.round((timeLeftMs / ROUND_MS) * 100)));

  useEffect(() => {
    setCurrentIndex(0);
    setInputValue("");
    setScore(0);
    setAnswers([]);
    setFeedback("");
    setFeedbackKind("neutral");
    setHasStarted(false);
    setTimeLeftMs(ROUND_MS);
    setTargetKey(0);
    setTargetHit(false);
    setHitMarkers([]);
    setIsFinished(false);
    setAttemptSaved(false);
    setAttemptError("");
    setCompletionNotified(false);

    scoreRef.current = 0;
    answersRef.current = [];
    submittingRef.current = false;
  }, [activity?.id]);

  useEffect(() => {
    if (!hasStarted || !currentItem || isFinished) return;

    resolvedRef.current = false;
    startedAtRef.current = performance.now();
    setTimeLeftMs(ROUND_MS);
    setInputValue("");
    setFeedback("");
    setFeedbackKind("neutral");
    setTargetHit(false);

    const timeoutId = window.setTimeout(() => {
      if (resolvedRef.current) return;
      resolveRound({
        userAnswer: inputValue,
        isCorrect: false,
        timedOut: true,
        responseTimeMs: ROUND_MS,
        delta: -10,
      });
    }, ROUND_MS);

    const tickId = window.setInterval(() => {
      const elapsed = performance.now() - startedAtRef.current;
      const left = Math.max(0, ROUND_MS - elapsed);
      setTimeLeftMs(left);
    }, 100);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(tickId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, hasStarted, isFinished, currentItem, targetKey]);

  useEffect(() => {
    if (!hasStarted || isFinished) return;
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [hasStarted, currentIndex, isFinished]);

  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const keepTypingFocus = (event) => {
      const tagName = event.target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA") return;
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", keepTypingFocus);
    return () => window.removeEventListener("keydown", keepTypingFocus);
  }, [hasStarted, isFinished]);

  useEffect(() => {
    if (!isFinished || submittingRef.current || !activity?.id) return;

    const submitAttempt = async () => {
      submittingRef.current = true;
      setAttemptError("");

      try {
        await api.post(`/activities/${activity.id}/attempt`, {
          score: scoreRef.current,
          answers_json: answersRef.current,
        });
        setAttemptSaved(true);
      } catch (err) {
        const message = err?.response?.data?.detail || err?.message || "Failed to save game attempt";
        setAttemptError(message);
      }
    };

    submitAttempt();
  }, [activity?.id, isFinished]);

  useEffect(() => {
    if (!isFinished || completionNotified) return;
    if (!attemptSaved && !attemptError) return;

    setCompletionNotified(true);
    onComplete?.({ kind: "tir_game", score: scoreRef.current, answers: answersRef.current.length });
  }, [attemptError, attemptSaved, completionNotified, isFinished, onComplete]);

  const proceedNext = () => {
    if (currentIndex >= items.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setTargetKey((prev) => prev + 1);
  };

  const resolveRound = ({ userAnswer, isCorrect, timedOut, responseTimeMs, delta }) => {
    if (!currentItem || resolvedRef.current || isFinished) return;

    resolvedRef.current = true;

    const row = {
      prompt_ru: currentItem.prompt_ru,
      expected_en: currentItem.answer_en,
      user_answer: userAnswer,
      is_correct: isCorrect,
      timed_out: timedOut,
      response_time_ms: Math.max(0, Math.round(responseTimeMs)),
    };

    const nextScore = scoreRef.current + delta;
    scoreRef.current = nextScore;
    setScore(nextScore);

    const nextAnswers = [...answersRef.current, row];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    if (isCorrect) {
      const arenaRect = arenaRef.current?.getBoundingClientRect();
      const targetRect = targetRef.current?.getBoundingClientRect();

      if (arenaRect && targetRect) {
        const markerX = targetRect.left - arenaRect.left + targetRect.width / 2;
        const markerY = targetRect.top - arenaRect.top + targetRect.height / 2;

        setHitMarkers((prev) => [
          ...prev,
          {
            id: `${currentIndex}-${Date.now()}`,
            x: markerX,
            y: markerY,
          },
        ]);
      }

      setTargetHit(true);
      setFeedbackKind("ok");
      setFeedback(delta === 15 ? "Great hit! +15 (fast)" : "Hit! +10");
      playSuccessBeep();
    } else if (timedOut) {
      setTargetHit(false);
      setFeedbackKind("bad");
      setFeedback("Missed target. -10 (timeout)");
    } else {
      setTargetHit(false);
      setFeedbackKind("bad");
      setFeedback(`Wrong answer. Expected: ${currentItem.answer_en}. -5`);
    }

    window.setTimeout(() => {
      proceedNext();
    }, 900);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!currentItem || resolvedRef.current || isFinished) return;

    const userAnswer = inputValue.trim();
    const elapsed = performance.now() - startedAtRef.current;
    const responseTimeMs = Math.min(ROUND_MS, Math.max(0, elapsed));
    const isCorrect = normalize(userAnswer) === normalize(currentItem.answer_en);

    if (isCorrect) {
      const delta = responseTimeMs <= FAST_MS ? 15 : 10;
      resolveRound({
        userAnswer,
        isCorrect: true,
        timedOut: false,
        responseTimeMs,
        delta,
      });
      return;
    }

    resolveRound({
      userAnswer,
      isCorrect: false,
      timedOut: false,
      responseTimeMs,
      delta: -5,
    });
  };

  if (!currentItem && !isFinished) {
    return <div className="tirGame">No vocabulary configured for this TIR activity.</div>;
  }

  return (
    <div className="tirGame">
      <div className="tirGame__top">
        <div className="tirGame__stat">
          Word progress <strong>{Math.min(currentIndex + 1, items.length)}/{items.length}</strong>
        </div>
        <div className="tirGame__stat">
          Live score <strong>{score}</strong>
        </div>
        {!isFinished ? (
          <div className="tirGame__stat">
            Time left <strong>{(timeLeftMs / 1000).toFixed(1)}s</strong>
          </div>
        ) : null}
      </div>

      <div className="tirGame__bars">
        <div className="tirGame__barLabel">Words completed: {answers.length}/{items.length}</div>
        <div className="tirGame__barTrack">
          <div className="tirGame__barFill" style={{ width: `${wordsProgressPercent}%` }} />
        </div>

        {!isFinished ? (
          <>
            <div className="tirGame__barLabel">Round timer</div>
            <div className="tirGame__barTrack tirGame__barTrack--timer">
              <div className="tirGame__barFill tirGame__barFill--timer" style={{ width: `${timeProgressPercent}%` }} />
            </div>
          </>
        ) : null}
      </div>

        {!isFinished && !hasStarted ? (
          <div className="tirGame__done">
            <div className="tirGame__prompt">TIR Vocabulary Challenge</div>
            <div className="tirGame__stat">
              {items.length} words • 15s per target • Type the correct English translation.
            </div>
            <button
              className="tirGame__btn"
              type="button"
              onClick={() => {
                setHasStarted(true);
                window.requestAnimationFrame(() => inputRef.current?.focus());
              }}
            >
              Start Game
            </button>
          </div>
        ) : null}

        {!isFinished && hasStarted ? (
        <>
          <div className="tirGame__prompt">Translate: {currentItem.prompt_ru}</div>

          <div className="tirGame__arena" key={targetKey} ref={arenaRef}>
            <div ref={targetRef} className={`tirGame__target ${targetHit ? "tirGame__target--hit" : ""}`}>
            </div>
            {hitMarkers.map((marker) => (
              <span
                key={marker.id}
                className="tirGame__hole"
                style={{ left: `${marker.x}px`, top: `${marker.y}px` }}
              />
            ))}
          </div>

          <form className="tirGame__form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="tirGame__input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type English translation"
              autoComplete="off"
              autoFocus
              disabled={resolvedRef.current}
            />
            <button className="tirGame__btn" type="submit" disabled={resolvedRef.current}>
              Fire
            </button>
          </form>

          {feedback ? (
            <div className={`tirGame__feedback ${feedbackKind === "ok" ? "tirGame__feedback--ok" : "tirGame__feedback--bad"}`}>
              {feedback}
            </div>
          ) : null}
        </>
      ) : isFinished ? (
        <div className="tirGame__done">
          <div className="tirGame__prompt">Round complete. Final score: {score}</div>
          <div className="tirGame__stat">Answers saved: {answers.length}</div>
          {attemptSaved ? <div className="tirGame__feedback tirGame__feedback--ok">Attempt saved.</div> : null}
          {attemptError ? <div className="tirGame__feedback tirGame__feedback--bad">{attemptError}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
