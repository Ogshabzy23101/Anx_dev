export default function WeakAreaPanel({ recommendedPracticeAreas }) {
  return (
    <section className="recommended-panel terminal-card">
      <span className="eyebrow">recommended practice areas</span>
      <p>
        You should practice:{" "}
        {recommendedPracticeAreas.length
          ? recommendedPracticeAreas.join(", ")
          : "Keep going. No weak areas detected yet."}
      </p>
    </section>
  );
}
