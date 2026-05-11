import { useAwsAuth } from "../components/AwsAuth";
import { useAuthModal } from "../components/AuthModal";
import { Page, PageStack, PrimaryButton } from "../components/ui";
import { styles } from "../styles";

export default function Booking() {
  const auth = useAwsAuth();
  const { openAuthModal } = useAuthModal();

  return (
    <Page>
      <PageStack>
        <h1>book here</h1>
        {auth.isLoading ? (
          <p className={styles.text.muted}>Checking sign in...</p>
        ) : auth.error ? (
          <p className={styles.text.danger}>
            Sign in failed. Please try again.
          </p>
        ) : auth.isAuthenticated ? (
          <p className={styles.text.muted}>
            Signed in as {auth.user?.email ?? auth.user?.name ?? auth.user?.sub}
          </p>
        ) : (
          <PrimaryButton
            onClick={() => openAuthModal("login")}
          >
            Login to book
          </PrimaryButton>
        )}
      </PageStack>
    </Page>
  );
}
