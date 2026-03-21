import "../styles/courses.css";

import Container from "../layout/Container";

function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 21c5 0 9-4 9-9s-4-9-9-9-9 4-9 9 4 9 9 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7v5.2l3.6 2.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconModules(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7 4.7h10c1 0 1.8.8 1.8 1.8v11c0 1-.8 1.8-1.8 1.8H7c-1 0-1.8-.8-1.8-1.8v-11c0-1 .8-1.8 1.8-1.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M9 8h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.7 12.2 10.2 15.7 17.5 8.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Courses() {
  return (
    <main className="courses">
      <section className="coursesHero" aria-label="Choose Your Learning Path">
        <Container className="coursesHero__inner">
          <h1 className="coursesHero__title">
            Choose Your <span className="coursesHero__accent">Learning</span> Path
          </h1>
          <p className="coursesHero__subtitle">
            Choose from our ready-made industry-specific courses or create a custom course
            <br />
            tailored to your business needs. All courses support up to 15 team members.
          </p>

          <div className="coursesFilters" aria-label="Filters">
            <div className="coursesFilters__col">
              <div className="coursesFilters__label">Course Type</div>
              <div className="coursesFilters__chips" role="list" aria-label="Course Type">
                <button className="chip chip--gold" type="button">
                  All Courses
                </button>
                <button className="chip chip--gray" type="button">
                  Ready-Made
                </button>
                <button className="chip chip--gray" type="button">
                  Custom
                </button>
              </div>
            </div>

            <div className="coursesFilters__col">
              <div className="coursesFilters__label">Level</div>
              <div className="coursesFilters__chips" role="list" aria-label="Level">
                <button className="chip chip--dark" type="button">
                  All
                </button>
                <button className="chip chip--gray" type="button">
                  Beginner
                </button>
                <button className="chip chip--gray" type="button">
                  Elementary
                </button>
                <button className="chip chip--gray" type="button">
                  Intermediate
                </button>
                <button className="chip chip--gray" type="button">
                  Upper-Intermediate
                </button>
                <button className="chip chip--gray" type="button">
                  Advanced
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="coursesSection" aria-label="Ready-Made Courses">
        <Container className="coursesSection__inner">
          <h2 className="coursesSection__title">Ready-Made Courses</h2>

          <div className="readyGrid" role="list">
            <article className="readyCard" role="listitem">
              <div className="pill pill--light">Elementary</div>
              <h3 className="readyCard__title">English for Waiters</h3>
              <p className="readyCard__desc">
                Master restaurant vocabulary, customer service phrases, and menu descriptions.
              </p>

              <div className="readyCard__meta" aria-label="Duration and modules">
                <span className="metaItem">
                  <IconClock className="metaIcon" aria-hidden="true" />
                  <span>8 weeks</span>
                </span>
                <span className="metaItem">
                  <IconModules className="metaIcon" aria-hidden="true" />
                  <span>24 modules</span>
                </span>
              </div>

              <ul className="readyCard__list" aria-label="Topics">
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Taking orders
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Handling complaints
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Menu terminology
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Table service
                </li>
              </ul>

              <button className="readyCard__btn" type="button">
                Get Started
              </button>
            </article>

            <article className="readyCard" role="listitem">
              <div className="pill pill--light">Intermediate</div>
              <h3 className="readyCard__title">English for Front Desk</h3>
              <p className="readyCard__desc">
                Perfect for reception staff handling guest inquiries and check-ins.
              </p>

              <div className="readyCard__meta" aria-label="Duration and modules">
                <span className="metaItem">
                  <IconClock className="metaIcon" aria-hidden="true" />
                  <span>10 weeks</span>
                </span>
                <span className="metaItem">
                  <IconModules className="metaIcon" aria-hidden="true" />
                  <span>30 modules</span>
                </span>
              </div>

              <ul className="readyCard__list" aria-label="Topics">
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Guest communication
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Reservation management
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Problem resolution
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Professional etiquette
                </li>
              </ul>

              <button className="readyCard__btn" type="button">
                Get Started
              </button>
            </article>

            <article className="readyCard" role="listitem">
              <div className="pill pill--light">Elementary</div>
              <h3 className="readyCard__title">English for Clerks</h3>
              <p className="readyCard__desc">
                Office communication and administrative English essentials.
              </p>

              <div className="readyCard__meta" aria-label="Duration and modules">
                <span className="metaItem">
                  <IconClock className="metaIcon" aria-hidden="true" />
                  <span>8 weeks</span>
                </span>
                <span className="metaItem">
                  <IconModules className="metaIcon" aria-hidden="true" />
                  <span>24 modules</span>
                </span>
              </div>

              <ul className="readyCard__list" aria-label="Topics">
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Email writing
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Phone calls
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Filing &amp; documentation
                </li>
                <li className="readyCard__li">
                  <IconCheck className="liIcon" aria-hidden="true" />
                  Office vocabulary
                </li>
              </ul>

              <button className="readyCard__btn" type="button">
                Get Started
              </button>
            </article>
          </div>
        </Container>
      </section>

      <section className="coursesSection coursesSection--custom" aria-label="Custom Courses">
        <Container className="coursesSection__inner">
          <h2 className="coursesSection__title">Custom Courses</h2>

          <div className="customGrid" role="list">
            <article className="customCard" role="listitem">
              <div className="pill pill--gold">Beginner</div>
              <h3 className="customCard__title">Beginner Custom Course</h3>
              <p className="customCard__desc">Build a foundation in English tailored to your industry.</p>
              <div className="customCard__note">Flexible (6-12 weeks)</div>
              <button className="customCard__btn" type="button">
                Customize Course
              </button>
            </article>

            <article className="customCard" role="listitem">
              <div className="pill pill--gold">Elementary</div>
              <h3 className="customCard__title">Elementary Custom Course</h3>
              <p className="customCard__desc">Develop practical English skills specific to your business needs.</p>
              <div className="customCard__note">Flexible (6-12 weeks)</div>
              <button className="customCard__btn" type="button">
                Customize Course
              </button>
            </article>

            <article className="customCard" role="listitem">
              <div className="pill pill--gold">Intermediate</div>
              <h3 className="customCard__title">Intermediate Custom Course</h3>
              <p className="customCard__desc">Enhance communication skills for your industry context.</p>
              <div className="customCard__note">Flexible (6-12 weeks)</div>
              <button className="customCard__btn" type="button">
                Customize Course
              </button>
            </article>

            <article className="customCard" role="listitem">
              <div className="pill pill--gold">Upper-Intermediate</div>
              <h3 className="customCard__title">Upper-Intermediate Custom Course</h3>
              <p className="customCard__desc">Advanced business English customized to your requirements.</p>
              <div className="customCard__note">Flexible (6-12 weeks)</div>
              <button className="customCard__btn" type="button">
                Customize Course
              </button>
            </article>

            <article className="customCard" role="listitem">
              <div className="pill pill--gold">Advanced</div>
              <h3 className="customCard__title">Advanced Custom Course</h3>
              <p className="customCard__desc">Master sophisticated English for executive-level communication.</p>
              <div className="customCard__note">Flexible (6-12 weeks)</div>
              <button className="customCard__btn" type="button">
                Customize Course
              </button>
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}
