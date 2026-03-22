import { Link } from "react-router-dom";
import Container from "../layout/Container";

export default function PublicFooter() {
  return (
    <footer className="footer">
      <Container className="footer__inner">
        <section className="footer__col footer__brand" aria-label="Brand">
          <div className="footer__brandTop">
            <img className="footer__logo" src="/logo_white.svg" alt="AdaptEd logo" width="66" height="66" />
            <span className="footer__brandTitle">AdaptEd</span>
          </div>

          <p className="footer__desc">
            Transforming business English education with customizable courses for teams.
          </p>
        </section>

        <nav className="footer__col footer__links" aria-label="Quick Links">
          <div className="footer__title">Quick Links</div>
          <div className="footer__linksList">
            <Link className="footer__link" to="/">
              Home
            </Link>
            <Link className="footer__link" to="/about">
              About
            </Link>
            <Link className="footer__link" to="/courses">
              Courses
            </Link>
            <Link className="footer__link" to="/pricing">
              Pricing
            </Link>
            <Link className="footer__link" to="/login">
              Log In
            </Link>
          </div>
        </nav>

        <section className="footer__col footer__contacts" aria-label="Contact Us">
          <div className="footer__title">Contact Us</div>

          <div className="footer__contactsList">
            <div className="footer__contactRow">
              <span className="footer__iconMask" aria-hidden="true">
                <img className="footer__icon" src="/sms.svg" alt="" width="23" height="23" />
              </span>
              <span className="footer__contactText">adapted@gmail.com</span>
            </div>

            <div className="footer__contactRow">
              <span className="footer__iconMask" aria-hidden="true">
                <img className="footer__icon" src="/call.svg" alt="" width="23" height="23" />
              </span>
              <span className="footer__contactText">adapted.kg</span>
            </div>

            <div className="footer__contactRow">
              <span className="footer__iconMask" aria-hidden="true">
                <img className="footer__icon" src="/insta.svg" alt="" width="23" height="23" />
              </span>
              <span className="footer__contactText">+996508603600</span>
            </div>
          </div>
        </section>
      </Container>
    </footer>
  );
}
