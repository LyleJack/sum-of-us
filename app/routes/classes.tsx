import type { CSSProperties } from "react";
import { Link } from "react-router";
import { Page, PageStack } from "../components/ui";
import background from "../images/welcome-background.svg";
import bigLogo from "../images/big-logo.svg";
import communityPhoto from "../images/welcome-community.jpg";
import beachPhoto from "../images/welcome-beach.jpg";
import { styles } from "../styles";
import Footer from "../components/Footer";

export default function Classes() {
  return (
    <Page className={styles.welcome.page}>
      <PageStack className={styles.welcome.stack}>
        <div
          className={styles.generic.background}
          style={{ "--generic-background-image": `url(${background})` } as CSSProperties}
        >
          <div className={styles.welcome.classMeta}>
            <p>
              <br />Self-defence classes<br />built for real life.
            </p>
            <p>
              £5 per class<br />Tuesdays + Thursdays<br />7-8pm
            </p>
          </div>
          <img src={bigLogo} alt="Sum of Us" className={styles.welcome.classLogo} />
        </div>
        <section className={styles.welcome.intro} aria-labelledby="welcome-intro-title">
          <h1 id="welcome-intro-title" className={styles.welcome.introTitle}>
            SIMPLE<br />+ FLEXIBLE
          </h1>
          <div className={styles.welcome.introCopy}>
            <p>
              We take safeguarding seriously.
              <br />We keep classes small and focus on consent, control, and comfort.
              <br /><br />This is a space where you can learn without feeling judged.
            </p>
            <div>
              <div>
                We also offer £35 monthly plans for those who want to come on a regular basis.
                <br />And if cost is a barrier, just let us know. We’ll sort it.
              </div>
              <div>
                We offer your first class for free as a trial to see if it’s right for you. And all our classes can be booked individual for £5 each, giving you the flexibility you need.
              </div>
            </div>
          </div>
        </section>
        <img
          src={communityPhoto}
          alt="A group of people standing together outside"
          className={styles.welcome.photoBanner}
        />
        <section className={styles.welcome.featureGrid} aria-label="Class values">
          <article className={styles.welcome.featureCard}>
            <h2>This isn&apos;t about fighting</h2>
            <p>
              It&apos;s about feeling more comfortable in your body, and in the
              world around you. We run small, supportive self-defence classes
              that focus on awareness, boundaries and simple, practical
              techniques.
            </p>
            <p>
              You don&apos;t need to be strong or fit.<br />
              You just need to show up.
            </p>
          </article>
          <article className={styles.welcome.featureCard} style={{  "background": "#faf7f2" }}>
            <h2>A fun space for everyone</h2>
            <p>
              Each class is simple and structured so you know what to expect.
              Warm ups are short (and fun). We learn a few practical techniques
              and talk you through real-life situations.
            </p>
            <p>
              We go at a pace that feels right for you. You can sit out at any
              time. No pressure. And you never have to do anything that makes
              you feel uncomfortable.
            </p>
          </article>
          <article className={styles.welcome.featureCard}>
            <h2>A place to be yourself</h2>
            <p>
              These classes are for anyone who wants to feel safer. Especially
              if you&apos;ve never done anything like this before. Or gyms and
              martial arts spaces don&apos;t feel like your thing. You want
              something low-pressure and welcoming. This is it.
            </p>
            <p>(Also, you won&apos;t be the only beginner.)</p>
          </article>
          <img
            src={beachPhoto}
            alt="Friends walking together by the water"
            className={styles.welcome.featureImage}
          />
        </section>
        <Link to="/booking" className={styles.welcome.joinBanner}>
        </Link>
        <Footer />
      </PageStack>
    </Page>
  );
}
