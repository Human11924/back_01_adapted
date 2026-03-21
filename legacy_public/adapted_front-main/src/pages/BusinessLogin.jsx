import "../styles/businessLogin.css";

import { useState } from "react";
import Container from "../layout/Container";

export default function BusinessLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // UI-only: navigate to dashboard (replace with real auth later).
    window.location.href = "/business/dashboard";
  }

  return (
    <main className="businessLogin">
      <section className="businessLoginMain" aria-label="Business login">
        <Container className="businessLoginMain__inner">
          <header className="businessLoginMain__head">
            <h1 className="businessLoginMain__title">
              Business <span className="businessLoginMain__accent">Login</span>
            </h1>
            <p className="businessLoginMain__subtitle">Sign in to manage your team&apos;s learning.</p>
          </header>

          <div className="businessLoginCard" aria-label="Email and password">
            <form className="businessLoginCard__form" onSubmit={onSubmit}>
              <label className="businessField">
                <span className="businessField__label">Email</span>
                <input
                  className="businessField__input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="name@company.com"
                  required
                />
              </label>

              <label className="businessField">
                <span className="businessField__label">Password</span>
                <input
                  className="businessField__input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                />
              </label>

              <button className="businessLoginCard__btn" type="submit">
                Log In
              </button>
            </form>
          </div>
        </Container>
      </section>
    </main>
  );
}
