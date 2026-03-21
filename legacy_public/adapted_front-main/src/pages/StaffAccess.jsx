import "../styles/staffAccess.css";

import { useMemo, useState } from "react";
import Container from "../layout/Container";

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

function formatAccessCode(raw) {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const part1 = cleaned.slice(0, 4);
  const part2 = cleaned.slice(4, 8);
  const part3 = cleaned.slice(8, 12);
  return [part1, part2, part3].filter(Boolean).join(" - ");
}

export default function StaffAccess() {
  const [accessCode, setAccessCode] = useState("");

  const placeholder = useMemo(() => "XXXX - XXXX - XXXX", []);

  function onChange(e) {
    setAccessCode(formatAccessCode(e.target.value));
  }

  function onSubmit(e) {
    e.preventDefault();
    // UI-only: route/hook into real flow later.
  }

  return (
    <main className="staffAccess">
      <section className="staffAccessMain" aria-label="Staff Access">
        <Container className="staffAccessMain__inner">
          <header className="staffAccessMain__head">
            <h1 className="staffAccessMain__title">
              Staff <span className="staffAccessMain__accent">Access</span>
            </h1>
            <p className="staffAccessMain__subtitle">
              Enter the access code provided by your organization to start learning.
            </p>
          </header>

          <div className="staffCard" aria-label="Access code entry">
            <form className="staffCard__form" onSubmit={onSubmit}>
              <label className="staffCard__label" htmlFor="accessCode">
                Access Code
              </label>

              <div className="staffCard__inputRow">
                <input
                  id="accessCode"
                  className="staffCard__input"
                  value={accessCode}
                  onChange={onChange}
                  inputMode="text"
                  autoComplete="one-time-code"
                  placeholder={placeholder}
                  aria-describedby="accessCodeHelp"
                />
                <span className="staffCard__inputIcon" aria-hidden="true">
                  <IconKey className="staffCard__keySvg" />
                </span>
              </div>

              <div className="staffCard__hint" id="accessCodeHelp">
                Enter the code exactly as provided by your organization.
              </div>

              <button className="staffCard__btn" type="submit">
                Access Course
              </button>

              <div className="staffCard__divider" role="separator" aria-hidden="true" />

              <div className="staffHelp" aria-label="Need Help">
                <div className="staffHelp__title">Need Help?</div>
                <ul className="staffHelp__list" aria-label="Help items">
                  <li className="staffHelp__li">
                    <span className="staffHelp__dot" aria-hidden="true" />
                    Contact your organization&apos;s administrator if you haven&apos;t received an access
                    code.
                  </li>
                  <li className="staffHelp__li">
                    <span className="staffHelp__dot" aria-hidden="true" />
                    Each code can be used by up to 15 team members.
                  </li>
                  <li className="staffHelp__li">
                    <span className="staffHelp__dot" aria-hidden="true" />
                    Make sure to enter the code exactly as shown, including hyphens.
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </main>
  );
}
