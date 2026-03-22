import { useState } from "react";

function sortByOrderIndex(items = []) {
  return [...items].sort((a, b) => (a?.order_index ?? 0) - (b?.order_index ?? 0));
}

export default function VocabularyIntroActivity({ activity, onComplete }) {
  const vocabularyItems = sortByOrderIndex(activity?.content_json?.vocabulary_items || []);
  const phrases = activity?.content_json?.key_phrases || [];
  const [reviewed, setReviewed] = useState(false);

  if (vocabularyItems.length === 0 && phrases.length === 0) {
    return (
      <div style={{ fontSize: 14, color: "var(--text)" }}>
        No vocabulary content configured.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {vocabularyItems.length > 0 ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-h)" }}>
            Vocabulary Flashcards
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: 8,
            }}
          >
            {vocabularyItems.map((item) => (
              <div
                key={`${item.prompt_ru}-${item.answer_en}`}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 10,
                  background: "#fff",
                  display: "grid",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>
                  {item.prompt_ru}
                </div>
                <div style={{ fontSize: 16, color: "var(--text-h)", fontWeight: 700 }}>
                  {item.answer_en}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {phrases.length > 0 ? (
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-h)" }}>
            Useful Service Phrases
          </div>

          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text)", fontSize: 14 }}>
            {phrases.map((phrase) => (
              <li key={phrase} style={{ marginBottom: 4 }}>
                {phrase}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: "var(--text)" }}>
          Step status: {reviewed ? "Reviewed" : "Not reviewed yet"}
        </div>

        <button
          type="button"
          onClick={() => {
            if (reviewed) return;
            setReviewed(true);
            onComplete?.({ kind: "vocabulary_intro" });
          }}
          disabled={reviewed}
          style={{
            cursor: reviewed ? "not-allowed" : "pointer",
            borderRadius: 10,
            padding: "10px 12px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-h)",
            fontSize: 14,
          }}
        >
          {reviewed ? "Reviewed" : "Mark as reviewed"}
        </button>
      </div>
    </div>
  );
}
