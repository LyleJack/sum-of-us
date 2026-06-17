import { useAuthModal } from "../components/AuthModal";
import { Page, PageStack } from "../components/UI";
import { styles } from "../styles";
import Demo from "./ClassBookingFlow";

export default function Booking() {
  const { openAuthModal } = useAuthModal();

  return (
    <Page className={styles.booking.page}>
      <PageStack >
        {/* TODO: replace demo */}
        <Demo/>
      </PageStack>
    </Page>
  );
}
