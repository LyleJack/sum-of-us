import { useState, useEffect } from "react";
import { useAuthModal } from "../components/AuthModal";
import { Page, PageStack, Panel } from "../components/ui";
import joinLogo from "../placeholder_icon.png";
import { styles } from "../styles";


export function Welcome() {
  const { openAuthModal } = useAuthModal();
  let sumArray = ["fight", "train", "protect", "learn", "defend", "empower", "unite", "support", "grow", "inspire", "transform", "challenge", "overcome", "resist", "prevail"];
  const [sumOfUsVerb, setSumOfUsVerb] = useState(sumArray[0]);
  const [sumOfUsVerbCount, setSumOfUsVerbCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSumOfUsVerb(sumArray[sumOfUsVerbCount % sumArray.length]);
      setSumOfUsVerbCount((prev) => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [sumOfUsVerbCount]);
  return (
    <Page>
      <PageStack>
        <header className={styles.welcome.header}>
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
