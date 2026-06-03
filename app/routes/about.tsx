import type { CSSProperties } from "react";
import { Page } from "../components/ui";
import background from "../images/about-1.jpg";
import aboutPhoto from "../images/about_2.jpg";
import { styles } from "../styles";
import { JoinUsBanner } from "../components/JoinUsBanner";
import { PeopleCarousel } from "../components/PeopleCarousel";
import Footer from "../components/Footer";

export default function About() {
  return (
    <Page className={styles.about.page}>
      <div className={styles.about.canvas}>
        <section
          className={styles.about.hero}
          aria-label="Self-defence about"
          style={{ "--about-hero-image": `url(${background})` } as CSSProperties}
        />

        <section className={styles.about.intro} aria-labelledby="about-intro-title">
          <h1 id="about-intro-title" className={styles.about.title}>
            WHY WE<br />STARTED
          </h1>
          <div>
            <p className={styles.about.introMain}>
              We know a lot of people don’t feel safe and most options out there don’t feel accessible. We wanted to create something different. Something affordable, welcoming and grounded in real life.
            </p>
            <div className={styles.about.introNotes}>
              <p>
               This isn’t about becoming a fighter. It’s about feeling more like yourself when you move through the world. And in doing so, supporting a registered Scottish charity.
              </p>
              <p>
                Our people are all volunteers who believe in our mission. Everyone involved with our charity wants to better the world we live in.
              </p>
            </div>
          </div>
        </section>

         <img
            src={aboutPhoto}
            alt=""
            className={styles.about.peopleImage}
          />
          <div className={styles.about.peoplePanel}>
            <h2 id="about-people-title" className={styles.about.title}>
              MEET OUR <br />PEOPLE
            </h2>
            <PeopleCarousel />
          </div>

        <JoinUsBanner />

        <Footer />
      </div>
    </Page>
  );
}
