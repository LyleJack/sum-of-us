import { Page } from "../components/ui";
import { styles } from "../styles";

export default function AuthCallback() {
  return (
    <Page fullHeight>
      <p className={styles.text.muted}>Signing you in...</p>
    </Page>
  );
}
