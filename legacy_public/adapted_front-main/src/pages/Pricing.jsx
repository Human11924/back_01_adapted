import "../styles/pricing.css";

import Container from "../layout/Container";

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

export default function Pricing() {
  return (
    <main className="pricing">
      <section className="pricingMain" aria-label="Pricing">
        <Container className="pricingMain__inner">
          <header className="pricingMain__head">
            <h1 className="pricingMain__title">
              Simple, <span className="pricingMain__accent">Transparent</span> Pricing
            </h1>
            <p className="pricingMain__subtitle">
              Choose the plan that best fits your team&apos;s learning needs. All plans are monthly
              memberships that last up to 6 months.
            </p>
          </header>

          <div className="pricingPlans" role="list" aria-label="Plans">
            <article className="planCard" role="listitem" aria-label="Online Course plan">
              <div className="planCard__kicker">Online Course</div>
              <div className="planCard__sub">Purchase a single ready-made course</div>

              <div className="planCard__priceRow" aria-label="Price">
                <div className="planCard__price">$15</div>
                <div className="planCard__per">/pp, month</div>
              </div>

              <ul className="planCard__list" aria-label="Included features">
                <li className="planCard__li">
                  <IconCheck className="planCard__check" aria-hidden="true" />
                  Offline event
                </li>
                <li className="planCard__li">
                  <IconCheck className="planCard__check" aria-hidden="true" />
                  Email support
                </li>
                <li className="planCard__li">
                  <IconCheck className="planCard__check" aria-hidden="true" />
                  Progress tracking &amp; analytics
                </li>
              </ul>

              <button className="planCard__btn" type="button">
                Get Started
              </button>
            </article>

            <article className="planCard planCard--dark" role="listitem" aria-label="Offline Course plan">
              <div className="planCard__kicker">Offline Course</div>
              <div className="planCard__sub">Create a customized course</div>

              <div className="planCard__priceRow" aria-label="Price">
                <div className="planCard__price">$50</div>
                <div className="planCard__per">/pp, month</div>
              </div>

              <ul className="planCard__list" aria-label="Included features">
                <li className="planCard__li">
                  <IconCheck className="planCard__check" aria-hidden="true" />
                  Fully customized curriculum
                </li>
                <li className="planCard__li">
                  <IconCheck className="planCard__check" aria-hidden="true" />
                  2 lessons with a teacher per week
                </li>
                <li className="planCard__li">
                  <IconCheck className="planCard__check" aria-hidden="true" />
                  Priority support
                </li>
                <li className="planCard__li">
                  <IconCheck className="planCard__check" aria-hidden="true" />
                  Progress tracking &amp; analytics
                </li>
              </ul>

              <button className="planCard__btn" type="button">
                Get Started
              </button>
            </article>
          </div>

          <div className="pricingFaq" aria-label="Frequently Asked Questions">
            <h2 className="pricingFaq__title">Frequently Asked Questions</h2>

            <div className="pricingFaq__grid" role="list">
              <article className="faqItem" role="listitem">
                <div className="faqItem__qRow">
                  <span className="faqItem__badge" aria-hidden="true">
                    ?
                  </span>
                  <div className="faqItem__q">How does the access code work?</div>
                </div>
                <div className="faqItem__a">
                  After purchasing a course, you&apos;ll receive a unique code. Share this code with
                  your team members. Each person enters the code to create their account and access the
                  course.
                </div>
              </article>

              <article className="faqItem" role="listitem">
                <div className="faqItem__qRow">
                  <span className="faqItem__badge" aria-hidden="true">
                    ?
                  </span>
                  <div className="faqItem__q">Can I switch between courses?</div>
                </div>
                <div className="faqItem__a">
                  You can switch between any online courses, as long as they have been purchased and you
                  have access to them.
                </div>
              </article>

              <article className="faqItem" role="listitem">
                <div className="faqItem__qRow">
                  <span className="faqItem__badge" aria-hidden="true">
                    ?
                  </span>
                  <div className="faqItem__q">What if I need a lot of seats?</div>
                </div>
                <div className="faqItem__a">
                  That is not a problem as you can enroll and pay for any amount of staff members.
                </div>
              </article>

              <article className="faqItem" role="listitem">
                <div className="faqItem__qRow">
                  <span className="faqItem__badge" aria-hidden="true">
                    ?
                  </span>
                  <div className="faqItem__q">How long does course access last?</div>
                </div>
                <div className="faqItem__a">Both course purchases include 6 months of access.</div>
              </article>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
