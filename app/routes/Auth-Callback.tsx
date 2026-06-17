import { Page } from "../components/UI";
import { styles } from "../styles";

export default function AuthCallback() {
  return (
    <Page fullHeight>
      <p className={styles.text.muted}>Signing you in...</p>
    </Page>
  );
}
