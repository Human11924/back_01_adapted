import "../styles/home.css";

import Container from "../layout/Container";

function IconBook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.5 4.5c3.8 0 5.5 1.2 6.5 2.3 1-1.1 2.7-2.3 6.5-2.3h.9c.9 0 1.6.7 1.6 1.6v12.7c0 .9-.7 1.6-1.6 1.6H18c-3.6 0-5.2 1-6 2-.8-1-2.4-2-6-2H4.6c-.9 0-1.6-.7-1.6-1.6V6.1c0-.9.7-1.6 1.6-1.6h.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 6.8v14.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16.7 20.2c0-2.5-2.1-4.6-4.7-4.6s-4.7 2.1-4.7 4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 12.9c2 0 3.6-1.6 3.6-3.6S14 5.7 12 5.7 8.4 7.3 8.4 9.3s1.6 3.6 3.6 3.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.7 20.2c0-1.8-1.1-3.4-2.8-4.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.2 12.6c1.6-.5 2.7-2 2.7-3.7 0-2.1-1.7-3.8-3.8-3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.2 12.4 11 14.2 15.6 9.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21c5 0 9-4 9-9s-4-9-9-9-9 4-9 9 4 9 9 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconBolt(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function IconBulb(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.2 10a3.8 3.8 0 1 1 7.6 0c0 1.4-.7 2.6-1.7 3.4-.7.6-1.1 1.4-1.1 2.3v.4H11v-.4c0-.9-.4-1.7-1.1-2.3-1-.8-1.7-2-1.7-3.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10.2 20h3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconHeadset(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4.5 12a7.5 7.5 0 0 1 15 0v6.2c0 .9-.7 1.6-1.6 1.6h-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.2 12.2h-.1c-.9 0-1.6.7-1.6 1.6v3.3c0 .9.7 1.6 1.6 1.6h.1c.9 0 1.6-.7 1.6-1.6v-3.3c0-.9-.7-1.6-1.6-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M17.8 12.2h.1c.9 0 1.6.7 1.6 1.6v3.3c0 .9-.7 1.6-1.6 1.6h-.1c-.9 0-1.6-.7-1.6-1.6v-3.3c0-.9.7-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14.7 20.1c0 .9-.7 1.6-1.6 1.6h-1.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.6 18.4a7.8 7.8 0 1 0 0-15.6 7.8 7.8 0 0 0 0 15.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M16.2 16.2 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconCart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 7h15l-1.7 7.5a2 2 0 0 1-2 1.5H9.1a2 2 0 0 1-2-1.6L5.6 4.5H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 20.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M17.4 20.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconKey(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14.8 9.2a4.2 4.2 0 1 0-8.4 0 4.2 4.2 0 0 0 8.4 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M14.8 9.2h6.2l-1.8 1.8 1.8 1.8-1.8 1.8 1.8 1.8h-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCap(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 4 2.5 9l9.5 5 9.5-5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 11.1V16c0 1.9 3 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-4.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M21.5 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="home">
      <section className="homeHero" aria-label="Hero">
        <Container className="homeHero__inner">
          <div className="homeHero__copy">
            <h1 className="homeHero__title">
              <span className="homeHero__titleLine">Customized trainings.</span>
              <span className="homeHero__titleLine">Effective results.</span>
            </h1>

            <div className="homeHero__kicker">Transform Your Team&apos;s English Skills</div>

            <p className="homeHero__desc">
              Customizable English courses designed for businesses.
              <br />
              Choose from ready-made industry-specific programs or create tailored courses.
            </p>

            <div className="homeHero__actions">
              <a className="homeBtn homeBtn--primary" href="/courses">
                Explore Courses
              </a>
              <a className="homeBtn homeBtn--secondary" href="/pricing">
                View Pricing
              </a>
            </div>
          </div>

          <aside className="homeHero__stats" aria-label="Highlights">
            <div className="homeHero__stat">
              <span className="homeHero__statIcon" aria-hidden="true">
                <IconBook className="homeHero__svg" />
              </span>
              <div className="homeHero__statText">
                <div className="homeHero__statTitle">20+</div>
                <div className="homeHero__statSub">Online Courses</div>
              </div>
            </div>

            <div className="homeHero__stat">
              <span className="homeHero__statIcon" aria-hidden="true">
                <IconUsers className="homeHero__svg" />
              </span>
              <div className="homeHero__statText">
                <div className="homeHero__statTitle">Unlimited</div>
                <div className="homeHero__statSub">Team Members per Course</div>
              </div>
            </div>

            <div className="homeHero__stat">
              <span className="homeHero__statIcon" aria-hidden="true">
                <IconCheck className="homeHero__svg" />
              </span>
              <div className="homeHero__statText">
                <div className="homeHero__statTitle">5 levels</div>
                <div className="homeHero__statSub">From Beginner to Advanced</div>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      <section className="homeWhy" aria-label="Why Choose AdaptEd">
        <Container className="homeWhy__inner">
          <div className="homeWhy__head">
            <h2 className="homeWhy__title">Why Choose AdaptEd?</h2>
            <p className="homeWhy__subtitle">
              Everything you need to upskill your team&apos;s English proficiency in one
              <br />
              comprehensive platform.
            </p>
          </div>

          <div className="homeWhy__grid">
            <article className="homeWhyCard">
              <div className="homeWhyCard__icon homeWhyCard__icon--gold" aria-hidden="true">
                <IconBook className="homeWhyCard__svg" />
              </div>
              <h3 className="homeWhyCard__title">Ready-Made Courses</h3>
              <p className="homeWhyCard__desc">
                Industry-specific courses like English for Waiters, Front Desk, and Clerks
                ready to deploy.
              </p>
            </article>

            <article className="homeWhyCard">
              <div className="homeWhyCard__icon homeWhyCard__icon--dark" aria-hidden="true">
                <IconBolt className="homeWhyCard__svg" />
              </div>
              <h3 className="homeWhyCard__title">Custom Courses</h3>
              <p className="homeWhyCard__desc">
                Tailor courses to your business needs and industry requirements.
              </p>
            </article>

            <article className="homeWhyCard">
              <div className="homeWhyCard__icon homeWhyCard__icon--gold" aria-hidden="true">
                <IconUsers className="homeWhyCard__svg" />
              </div>
              <h3 className="homeWhyCard__title">Team Access</h3>
              <p className="homeWhyCard__desc">
                Enroll any amount of team members per course with secure code access.
              </p>
            </article>

            <article className="homeWhyCard">
              <div className="homeWhyCard__icon homeWhyCard__icon--dark" aria-hidden="true">
                <IconClock className="homeWhyCard__svg" />
              </div>
              <h3 className="homeWhyCard__title">Flexible Learning</h3>
              <p className="homeWhyCard__desc">
                Choose between online self-paced courses or offline sessions with teachers.
              </p>
            </article>

            <article className="homeWhyCard">
              <div className="homeWhyCard__icon homeWhyCard__icon--gold" aria-hidden="true">
                <IconBulb className="homeWhyCard__svg" />
              </div>
              <h3 className="homeWhyCard__title">5 Proficiency Levels</h3>
              <p className="homeWhyCard__desc">
                From Beginner to Advanced, courses for every skill level.
              </p>
            </article>

            <article className="homeWhyCard">
              <div className="homeWhyCard__icon homeWhyCard__icon--dark" aria-hidden="true">
                <IconHeadset className="homeWhyCard__svg" />
              </div>
              <h3 className="homeWhyCard__title">Expert Support</h3>
              <p className="homeWhyCard__desc">
                Professional teachers for offline courses and ongoing support.
              </p>
            </article>
          </div>
        </Container>
      </section>

      <section className="homeHow" aria-label="How It Works">
        <Container className="homeHow__inner">
          <div className="homeHow__head">
            <h2 className="homeHow__title">
              How It <span className="homeHow__titleAccent">Works</span>
            </h2>
            <p className="homeHow__subtitle">Get your team started with AdaptEd in four simple steps.</p>
          </div>

          <div className="homeHow__steps" role="list" aria-label="Steps">
            <div className="homeHowStep" role="listitem">
              <div className="homeHowStep__iconWrap">
                <div className="homeHowStep__icon" aria-hidden="true">
                  <IconSearch className="homeHowStep__svg" />
                </div>
                <div className="homeHowStep__num" aria-hidden="true">
                  1
                </div>
              </div>
              <div className="homeHowStep__title">Choose Your Course</div>
              <div className="homeHowStep__desc">
                Browse ready-made industry courses or customize your own based on your team&apos;s needs.
              </div>
            </div>

            <div className="homeHowStep" role="listitem">
              <div className="homeHowStep__iconWrap">
                <div className="homeHowStep__icon" aria-hidden="true">
                  <IconCart className="homeHowStep__svg" />
                </div>
                <div className="homeHowStep__num" aria-hidden="true">
                  2
                </div>
              </div>
              <div className="homeHowStep__title">Select Your Plan</div>
              <div className="homeHowStep__desc">
                Pick your membership - either online course or offline sessions tailored to your business.
              </div>
            </div>

            <div className="homeHowStep" role="listitem">
              <div className="homeHowStep__iconWrap">
                <div className="homeHowStep__icon" aria-hidden="true">
                  <IconKey className="homeHowStep__svg" />
                </div>
                <div className="homeHowStep__num" aria-hidden="true">
                  3
                </div>
              </div>
              <div className="homeHowStep__title">Get Access Code</div>
              <div className="homeHowStep__desc">
                Receive a unique code for your team members to access the course.
              </div>
            </div>

            <div className="homeHowStep" role="listitem">
              <div className="homeHowStep__iconWrap">
                <div className="homeHowStep__icon" aria-hidden="true">
                  <IconCap className="homeHowStep__svg" />
                </div>
                <div className="homeHowStep__num" aria-hidden="true">
                  4
                </div>
              </div>
              <div className="homeHowStep__title">Start Learning</div>
              <div className="homeHowStep__desc">
                Your team enters the code and begins their English learning journey.
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="homeCta" aria-label="Explore Courses">
        <Container className="homeCta__inner">
          <h2 className="homeCta__title">
            Ready to Transform Your Team&apos;s
            <br />
            <span className="homeCta__accent">English Skills</span>?
          </h2>
          <p className="homeCta__subtitle">Join businesses that trust AdaptEd for their team&apos;s English learning journey.</p>
          <a className="homeCta__btn" href="/courses">
            Explore Courses
          </a>
        </Container>
      </section>
    </main>
  );
}