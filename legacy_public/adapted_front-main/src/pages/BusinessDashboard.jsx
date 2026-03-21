import "../styles/businessDashboard.css";

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
    </svg>
  );
}

function IconChart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4 20V4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 20h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 16.2V12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 16.2V8.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 16.2V10.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19 16.2V6.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7 4.8V3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 4.8V3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5.6 6.2h12.8c1 0 1.8.8 1.8 1.8v11c0 1-.8 1.8-1.8 1.8H5.6c-1 0-1.8-.8-1.8-1.8V8c0-1 .8-1.8 1.8-1.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M3.8 10.2h16.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 13.4h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 16.6h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 13.4h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEye(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2.8 12s3.4-6.2 9.2-6.2S21.2 12 21.2 12s-3.4 6.2-9.2 6.2S2.8 12 2.8 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconReport(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 3v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8.5 8.7 12 12.2l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6.6 14.2v3c0 1 .8 1.8 1.8 1.8h7.2c1 0 1.8-.8 1.8-1.8v-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BusinessDashboard() {
  return (
    <main className="bizDash">
      <section className="bizDashMain" aria-label="Business dashboard">
        <Container className="bizDashMain__inner">
          <header className="bizDashHead">
            <h1 className="bizDashHead__title">Business Dashboard</h1>
            <p className="bizDashHead__subtitle">
              Welcome back! Here&apos;s an overview of your team&apos;s learning progress.
            </p>
          </header>

          <div className="bizStats" role="list" aria-label="Statistics">
            <article className="bizStat" role="listitem">
              <div className="bizStat__icon" aria-hidden="true">
                <IconBook className="bizStat__svg" />
              </div>
              <div className="bizStat__num">3</div>
              <div className="bizStat__label">Active Courses</div>
            </article>

            <article className="bizStat" role="listitem">
              <div className="bizStat__icon" aria-hidden="true">
                <IconUsers className="bizStat__svg" />
              </div>
              <div className="bizStat__num">35</div>
              <div className="bizStat__label">Total Employees</div>
            </article>

            <article className="bizStat" role="listitem">
              <div className="bizStat__icon" aria-hidden="true">
                <IconChart className="bizStat__svg" />
              </div>
              <div className="bizStat__num">64%</div>
              <div className="bizStat__label">Avg. Progress</div>
            </article>

            <article className="bizStat" role="listitem">
              <div className="bizStat__icon" aria-hidden="true">
                <IconCalendar className="bizStat__svg" />
              </div>
              <div className="bizStat__num">28</div>
              <div className="bizStat__label">Active this Month</div>
            </article>
          </div>

          <section className="bizSection" aria-label="Purchased Courses">
            <h2 className="bizSection__title">Purchased Courses</h2>

            <div className="bizCourseList" role="list">
              <article className="bizCourse" role="listitem">
                <div className="bizCourse__top">
                  <div className="bizCourse__left">
                    <div className="bizCourse__name">English for Waiters</div>
                    <div className="bizCourse__pills" aria-label="Tags">
                      <span className="bizPill bizPill--gray">Ready-Made</span>
                      <span className="bizPill bizPill--goldLight">Elementary</span>
                    </div>
                    <div className="bizCourse__date">11/1/2024</div>

                    <div className="bizCourse__fieldLabel">Access Code</div>
                    <div className="bizCourse__codeRow">
                      <div className="bizCode">WAIT-2024-A98</div>
                      <button className="bizIconBtn" type="button" aria-label="Copy access code">
                        <img className="bizIconBtn__svg" src="/copy.svg" alt="" />
                      </button>
                    </div>

                    <div className="bizCourse__fieldLabel bizCourse__fieldLabel--mt">Seats Used</div>
                    <div className="bizSeats">
                      <div className="bizSeats__bar" aria-hidden="true">
                        <div className="bizSeats__fill" style={{ width: "80%" }} />
                      </div>
                      <div className="bizSeats__meta">12/15</div>
                    </div>
                  </div>

                  <div className="bizCourse__right" aria-label="Average progress">
                    <div className="bizProgHead">
                      <div className="bizProgHead__label">Average progress</div>
                      <div className="bizProgHead__pct">67%</div>
                    </div>
                    <div className="bizProgBar" aria-hidden="true">
                      <div className="bizProgBar__fill" style={{ width: "67%" }} />
                    </div>
                    <div className="bizProgSub">
                      <span className="bizProgSub__label">Expires:</span>
                      <span className="bizProgSub__value">5/1/2025</span>
                    </div>

                    <div className="bizActions" aria-label="Actions">
                      <button className="bizActionBtn" type="button">
                        <IconEye className="bizActionBtn__svg" aria-hidden="true" />
                        View
                      </button>
                      <button className="bizActionBtn" type="button">
                        <IconReport className="bizActionBtn__svg" aria-hidden="true" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              <article className="bizCourse" role="listitem">
                <div className="bizCourse__top">
                  <div className="bizCourse__left">
                    <div className="bizCourse__name">Custom Sales Course</div>
                    <div className="bizCourse__pills" aria-label="Tags">
                      <span className="bizPill bizPill--gray">Custom</span>
                      <span className="bizPill bizPill--goldLight">Intermediate</span>
                    </div>
                    <div className="bizCourse__date">10/15/2024</div>

                    <div className="bizCourse__fieldLabel">Access Code</div>
                    <div className="bizCourse__codeRow">
                      <div className="bizCode">POHT-2809-L7I</div>
                      <button className="bizIconBtn" type="button" aria-label="Copy access code">
                        <img className="bizIconBtn__svg" src="/copy.svg" alt="" />
                      </button>
                    </div>

                    <div className="bizCourse__fieldLabel bizCourse__fieldLabel--mt">Seats Used</div>
                    <div className="bizSeats">
                      <div className="bizSeats__bar" aria-hidden="true">
                        <div className="bizSeats__fill" style={{ width: "53%" }} />
                      </div>
                      <div className="bizSeats__meta">8/15</div>
                    </div>
                  </div>

                  <div className="bizCourse__right" aria-label="Average progress">
                    <div className="bizProgHead">
                      <div className="bizProgHead__label">Average progress</div>
                      <div className="bizProgHead__pct">45%</div>
                    </div>
                    <div className="bizProgBar" aria-hidden="true">
                      <div className="bizProgBar__fill" style={{ width: "45%" }} />
                    </div>
                    <div className="bizProgSub">
                      <span className="bizProgSub__label">Expires:</span>
                      <span className="bizProgSub__value">4/15/2025</span>
                    </div>

                    <div className="bizActions" aria-label="Actions">
                      <button className="bizActionBtn" type="button">
                        <IconEye className="bizActionBtn__svg" aria-hidden="true" />
                        View
                      </button>
                      <button className="bizActionBtn" type="button">
                        <IconReport className="bizActionBtn__svg" aria-hidden="true" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              <article className="bizCourse" role="listitem">
                <div className="bizCourse__top">
                  <div className="bizCourse__left">
                    <div className="bizCourse__name">Custom Course</div>
                    <div className="bizCourse__pills" aria-label="Tags">
                      <span className="bizPill bizPill--gold">Subscription</span>
                      <span className="bizPill bizPill--goldLight">All Courses</span>
                    </div>
                    <div className="bizCourse__date">11/10/2024</div>

                    <div className="bizCourse__fieldLabel">Access Code</div>
                    <div className="bizCourse__codeRow">
                      <div className="bizCode">FJOS-4821-88M</div>
                      <button className="bizIconBtn" type="button" aria-label="Copy access code">
                        <img className="bizIconBtn__svg" src="/copy.svg" alt="" />
                      </button>
                    </div>

                    <div className="bizCourse__fieldLabel bizCourse__fieldLabel--mt">Seats Used</div>
                    <div className="bizSeats">
                      <div className="bizSeats__bar" aria-hidden="true">
                        <div className="bizSeats__fill" style={{ width: "100%" }} />
                      </div>
                      <div className="bizSeats__meta">15/15</div>
                    </div>
                  </div>

                  <div className="bizCourse__right" aria-label="Average progress">
                    <div className="bizProgHead">
                      <div className="bizProgHead__label">Average progress</div>
                      <div className="bizProgHead__pct">82%</div>
                    </div>
                    <div className="bizProgBar" aria-hidden="true">
                      <div className="bizProgBar__fill" style={{ width: "82%" }} />
                    </div>
                    <div className="bizProgSub">
                      <span className="bizProgSub__label">Renews:</span>
                      <span className="bizProgSub__value">12/10/2024</span>
                    </div>

                    <div className="bizActions" aria-label="Actions">
                      <button className="bizActionBtn" type="button">
                        <IconEye className="bizActionBtn__svg" aria-hidden="true" />
                        View
                      </button>
                      <button className="bizActionBtn" type="button">
                        <IconReport className="bizActionBtn__svg" aria-hidden="true" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="bizSection" aria-label="Connected Team Members">
            <h2 className="bizSection__title">Connected Team Members</h2>

            <div className="bizTableWrap" role="region" aria-label="Team table">
              <table className="bizTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Progress</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bizName">
                      <span className="bizAvatar">JS</span>
                      John Smith
                    </td>
                    <td>john.s@company.com</td>
                    <td>English for Waiters</td>
                    <td>
                      <div className="bizRowProg">
                        <div className="bizRowProg__bar" aria-hidden="true">
                          <div className="bizRowProg__fill" style={{ width: "85%" }} />
                        </div>
                        <div className="bizRowProg__pct">85%</div>
                      </div>
                    </td>
                    <td>2 hours ago</td>
                  </tr>

                  <tr>
                    <td className="bizName">
                      <span className="bizAvatar">SW</span>
                      Sarah Willson
                    </td>
                    <td>sarah.w@company.com</td>
                    <td>English for Waiters</td>
                    <td>
                      <div className="bizRowProg">
                        <div className="bizRowProg__bar" aria-hidden="true">
                          <div className="bizRowProg__fill" style={{ width: "92%" }} />
                        </div>
                        <div className="bizRowProg__pct">92%</div>
                      </div>
                    </td>
                    <td>1 day ago</td>
                  </tr>

                  <tr>
                    <td className="bizName">
                      <span className="bizAvatar">JS</span>
                      Jason Sofia
                    </td>
                    <td>sofia.j@company.com</td>
                    <td>English for Waiters</td>
                    <td>
                      <div className="bizRowProg">
                        <div className="bizRowProg__bar" aria-hidden="true">
                          <div className="bizRowProg__fill" style={{ width: "56%" }} />
                        </div>
                        <div className="bizRowProg__pct">56%</div>
                      </div>
                    </td>
                    <td>3 hours ago</td>
                  </tr>

                  <tr>
                    <td className="bizName">
                      <span className="bizAvatar">BW</span>
                      Bruce Wayne
                    </td>
                    <td>bruce.w@company.com</td>
                    <td>English for Waiters</td>
                    <td>
                      <div className="bizRowProg">
                        <div className="bizRowProg__bar" aria-hidden="true">
                          <div className="bizRowProg__fill" style={{ width: "38%" }} />
                        </div>
                        <div className="bizRowProg__pct">38%</div>
                      </div>
                    </td>
                    <td>5 hours ago</td>
                  </tr>

                  <tr>
                    <td className="bizName">
                      <span className="bizAvatar">TS</span>
                      Tony Stark
                    </td>
                    <td>tony.s@company.com</td>
                    <td>English for Waiters</td>
                    <td>
                      <div className="bizRowProg">
                        <div className="bizRowProg__bar" aria-hidden="true">
                          <div className="bizRowProg__fill" style={{ width: "77%" }} />
                        </div>
                        <div className="bizRowProg__pct">77%</div>
                      </div>
                    </td>
                    <td>30 mins ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </Container>
      </section>
    </main>
  );
}
