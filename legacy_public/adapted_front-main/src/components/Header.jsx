import Container from "../layout/Container";

export default function Header() {
  return (
    <header className="header">
      <Container className="header__inner">
        <div className="header__brand">
          <img
            className="header__logo"
            src="/logo.svg"
            alt="AdaptEd logo"
            width="86"
            height="86"
          />
          <span className="header__title">AdaptEd</span>
        </div>

        <nav className="header__nav" aria-label="Primary">
          <a className="header__link" href="/">Home</a>
          <a className="header__link" href="/courses">Courses</a>
          <a className="header__link" href="/pricing">Pricing</a>
          <a className="header__link" href="/login">Log In</a>
        </nav>

        <a className="header__cta" href="/get-started">
          Get Started
        </a>
      </Container>
    </header>
  );
}