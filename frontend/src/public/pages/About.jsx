import "../styles/about.css";

import Container from "../layout/Container";

export default function About() {
  return (
    <main className="about">
      <section className="aboutHero" aria-label="About AdaptEd">
        <Container className="aboutHero__inner">
          <h1 className="aboutHero__title">
            About <span className="aboutHero__accent">AdaptEd</span>
          </h1>
          <p className="aboutHero__subtitle">
            We help companies build confident English communication across teams with practical,
            role-specific training.
          </p>
        </Container>
      </section>

      <section className="aboutSection" aria-label="Mission and approach">
        <Container className="aboutSection__inner">
          <article className="aboutCard">
            <h2 className="aboutCard__title">Our Mission</h2>
            <p className="aboutCard__text">
              AdaptEd was created to make business English training measurable, relevant, and easy to
              roll out. Instead of generic lessons, we align content to real workplace scenarios.
            </p>
          </article>

          <article className="aboutCard">
            <h2 className="aboutCard__title">How We Work</h2>
            <p className="aboutCard__text">
              Companies can start with ready-made tracks such as hospitality and front desk English,
              or request custom programs designed around internal workflows and vocabulary.
            </p>
          </article>

          <article className="aboutCard">
            <h2 className="aboutCard__title">What Teams Get</h2>
            <p className="aboutCard__text">
              Structured learning paths, clear progress visibility, and practical language outcomes
              that improve day-to-day communication with customers and partners.
            </p>
          </article>
        </Container>
      </section>
    </main>
  );
}
