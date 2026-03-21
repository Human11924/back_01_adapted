import "../styles/login.css";

import Container from "../layout/Container";

function IconUser(props) {
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
    </svg>
  );
}

function IconBriefcase(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 7V6.2c0-1.2 1-2.2 2.2-2.2h3.6C15 4 16 5 16 6.2V7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4.6 7h14.8c.9 0 1.6.7 1.6 1.6v9.6c0 .9-.7 1.6-1.6 1.6H4.6c-.9 0-1.6-.7-1.6-1.6V8.6c0-.9.7-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M3 12h18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Login() {
  return (
    <main className="login">
      <section className="loginMain" aria-label="Choose account type">
        <Container className="loginMain__inner">
          <header className="loginMain__head">
            <h1 className="loginMain__title">
              Log In to <span className="loginMain__accent">AdaptEd</span>
            </h1>
            <p className="loginMain__subtitle">Choose your account type to continue.</p>
          </header>

          <div className="loginCards" role="list" aria-label="Account types">
            <article className="loginCard" role="listitem" aria-label="Employee Account">
              <div className="loginCard__icon" aria-hidden="true">
                <IconUser className="loginCard__svg" />
              </div>

              <h2 className="loginCard__title">Employee Account</h2>
              <p className="loginCard__desc">
                Access your assigned courses using the code provided by your organization.
              </p>

              <ul className="loginCard__bullets" aria-label="Employee features">
                <li className="loginCard__bullet">
                  <span className="loginDot" aria-hidden="true" />
                  Access courses with code
                </li>
                <li className="loginCard__bullet">
                  <span className="loginDot" aria-hidden="true" />
                  Track your progress
                </li>
              </ul>

              <a className="loginCard__btn" href="/login/staff">
                Continue as Employee
              </a>
            </article>

            <article className="loginCard loginCard--dark" role="listitem" aria-label="Business Account">
              <div className="loginCard__icon" aria-hidden="true">
                <IconBriefcase className="loginCard__svg" />
              </div>

              <h2 className="loginCard__title">Business Account</h2>
              <p className="loginCard__desc">
                Manage your team&apos;s courses, track progress, and view analytics.
              </p>

              <ul className="loginCard__bullets" aria-label="Business features">
                <li className="loginCard__bullet">
                  <span className="loginDot" aria-hidden="true" />
                  Manage purchased courses
                </li>
                <li className="loginCard__bullet">
                  <span className="loginDot" aria-hidden="true" />
                  View team progress
                </li>
                <li className="loginCard__bullet">
                  <span className="loginDot" aria-hidden="true" />
                  Generate access codes
                </li>
              </ul>

              <a className="loginCard__btn" href="/login/business">
                Continue as Business
              </a>
            </article>
          </div>
        </Container>
      </section>
    </main>
  );
}
