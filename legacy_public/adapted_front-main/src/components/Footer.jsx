import Container from "../layout/Container";

export default function Footer() {
  return (
    <footer className="footer">
      <Container className="footer__inner">
        <section className="footer__col footer__brand" aria-label="Brand">
          <div className="footer__brandTop">
            <img
              className="footer__logo"
              src="/logo_white.svg"
              alt="AdaptEd logo"
              width="66"
              height="66"
            />
            <span className="footer__brandTitle">AdaptEd</span>
          </div>

          <p className="footer__desc">
            Transforming business English education with customizable courses for teams.
          </p>
        </section>

        <nav className="footer__col footer__links" aria-label="Quick Links">
          <div className="footer__title">Quick Links</div>
          <div className="footer__linksList">
            <a className="footer__link" href="/">Home</a>
            <a className="footer__link" href="/courses">Courses</a>
            <a className="footer__link" href="/pricing">Pricing</a>
            <a className="footer__link" href="/login">Log In</a>
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