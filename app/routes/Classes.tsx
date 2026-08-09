import { Page } from "../components/UI";
import classPhoto from "../images/classes-image-2.webp";
import { styles } from "../styles";

export default function Classes() {
  return (
    <Page className={styles.classes.page}>
        <section className={styles.classes.hero} aria-label="Self-defence classes" />

        <section className={styles.classes.intro} aria-labelledby="classes-intro-title">
          <h1 id="classes-intro-title" className={styles.classes.introTitle}>
            SIMPLE <br />+ FLEXIBLE
          </h1>
          <div>
            <p className={styles.classes.introMain}>
              We take safeguarding seriously.<br />
              We keep classes small and focus on consent, control, and comfort.
              <br /><br />
              This is a space where you can learn without feeling judged.
            </p>
            <div className={styles.classes.introNotes}>
              <p>
                We also offer £35 monthly plans for those who want to come on a regular basis.
                <br />
                And if cost is a barrier, just let us know. We&apos;ll sort it.
              </p>
              <p>
                We offer your first class for free as a trial to see if it&apos;s right for you.
                And all our classes can be booked individual for £5 each, giving you the flexibility you need.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.classes.schedule} aria-labelledby="classes-schedule-title">
          <div className={styles.classes.schedulePanel}>
            <h2 id="classes-schedule-title" className={styles.classes.scheduleTitle}>
              Our schedule<br />and what to bring
            </h2>
            <div>
              <p className={styles.classes.scheduleDetails}>
                Tuesdays — 7pm<br />
                Thursdays — 7pm<br />
                Location: [venue TBC]
              </p>
              <p className={styles.classes.scheduleNote}>
                Just wear something comfortable*.
              </p>
              <p className={styles.classes.scheduleSmall}>
                *We recommend our regulars to buy their own safety gear.
                <br />
                You can enquire in class if you&apos;ve been joining our classes for a while.
              </p>
            </div>
          </div>
          <img
            src={classPhoto}
            alt=""
            className={styles.classes.scheduleImage}
          />
        </section>
      </Page>
  );
}
