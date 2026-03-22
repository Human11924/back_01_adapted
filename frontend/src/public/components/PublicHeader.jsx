import { Link } from "react-router-dom";
import Container from "../layout/Container";

export default function PublicHeader() {
  return (
    <header className="header">
      <Container className="header__inner">
        <div className="header__brand">
          <img className="header__logo" src="/logo.svg" alt="AdaptEd logo" width="86" height="86" />
          <span className="header__title">AdaptEd</span>
        </div>

        <nav className="header__nav" aria-label="Primary">
          <Link className="header__link" to="/">
            Home
          </Link>
          <Link className="header__link" to="/about">
            About
          </Link>
          <Link className="header__link" to="/courses">
            Courses
          </Link>
          <Link className="header__link" to="/pricing">
            Pricing
          </Link>
          <Link className="header__link" to="/login">
            Log In
          </Link>
        </nav>

        <Link className="header__cta" to="/courses">
          Get Started
        </Link>
      </Container>
    </header>
  );
}
