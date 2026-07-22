import { Page, PageStack } from "../components/UI";
import { styles } from "../styles";
import { ClassBookingFlow } from "./ClassBookingFlow";

export default function Booking() {
  return (
    <Page className={styles.booking.page}>
      <PageStack >
        <ClassBookingFlow />
      </PageStack>
    </Page>
  );
}
