import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { useAuthModal } from "../components/AuthModal";
import { Page, PageStack, Panel } from "../components/ui";
import joinLogo from "../sum-of-us-logo.svg";
import background from "../images/welcome-background.svg";
import bigLogo from "../images/big-logo.svg";
import { styles } from "../styles";


export function Welcome() {
  const { openAuthModal } = useAuthModal();
  // let sumArray = ["fight", "train", "protect", "learn", "defend", "empower", "unite", "support", "grow", "inspire", "transform", "challenge", "overcome", "resist", "prevail"];
  // const [sumOfUsVerb, setSumOfUsVerb] = useState(sumArray[0]);
  // const [sumOfUsVerbCount, setSumOfUsVerbCount] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSumOfUsVerb(sumArray[sumOfUsVerbCount % sumArray.length]);
  //     setSumOfUsVerbCount((prev) => prev + 1);
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, [sumOfUsVerbCount]);
  return (
    <Page>
      <PageStack>
        <div
          className={styles.welcome.background}
          style={{ "--welcome-background-image": `url(${background})` } as CSSProperties}
        >
          {/* <header className={styles.welcome.header}>
            <div className={styles.welcome.titleBox}>
              <h1 className={styles.text.title}>
                Sum Of Us{" "}
                <span className={styles.text.soft}>
                  {sumOfUsVerb}
                </span>
              </h1>
            </div>
          </header>
          <div className={styles.welcome.actions}>
            <Panel as="nav" className={styles.welcome.panel}>
              <p className={styles.welcome.prompt}>
                What&apos;s next?
              </p>
              <ul>
                {resources.map(({ href, text, icon }) => (
                  <li key={href}>
                    <button
                      className={styles.text.action}
                      onClick={() => openAuthModal("signup")}
                      type="button"
                    >
                      {icon}
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          </div> */}
          <div
            style={{
              position: "absolute",
              bottom: "30%",
              left: "5%",
              display: "flex",
              alignItems: "flex-start",
              gap: "2vw",
              fontSize: "2vmin",
              lineHeight: 1.2,
            }}
          >
            <p style={{ margin: 0, whiteSpace: "nowrap" }}>
              <br/>Self-defence classes<br />built for real life.
            </p>
            <p style={{ margin: 0, whiteSpace: "nowrap" }}>
              £5 per class<br />Tuesdays + Thursdays<br />7-8pm
            </p>
          </div>
          <img src={bigLogo} alt="Sum of Us" style={{position: 'absolute', bottom: '0', left: '5%', maxHeight: '25%'}}/>
        </div>
        <div>
          NEXT SECTION
        </div>
      </PageStack>
    </Page>
  );
}

const resources = [
  {
    href: "/booking",
    text: "Join now",
    icon: (
      <img src={joinLogo} alt="Join us now" className={styles.welcome.icon} />
    ),
  },
];
