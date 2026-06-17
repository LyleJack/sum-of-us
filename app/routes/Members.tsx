import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { styles } from "../styles";

// TODO: replace stub data with real API calls
type Booking = {
  id: string;
  date: Date;
};

type Membership = {
  id: string;
  type: string;
  status: "active" | "inactive";
  renewsAt?: Date;
};

type MemberDetails = {
  pronouns: string;
  phone: string;
  whatsapp: boolean;
  emergencyName: string;
  emergencyEmail: string;
  hasAccessRequirements: boolean;
  accessRequirements: string;
};

// TODO: Stub data — swap these for real API/DB calls
const STUB_DETAILS: MemberDetails = {
  pronouns: "",
  phone: "",
  whatsapp: false,
  emergencyName: "",
  emergencyEmail: "",
  hasAccessRequirements: false,
  accessRequirements: "",
};

const STUB_BOOKINGS: Booking[] = [
  // TODO: fetch from DB
];

const STUB_MEMBERSHIPS: Membership[] = [
  // TODO: fetch from DB
];

export default function MembersPage() {
  const { user, isLoaded } = useUser();

  // TODO: Replace with real DB fetch
  const [details, setDetails] = useState<MemberDetails>(STUB_DETAILS);
  const [bookings] = useState<Booking[]>(STUB_BOOKINGS);
  const [memberships] = useState<Membership[]>(STUB_MEMBERSHIPS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isLoaded) return null;

  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress;
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: save `details` to your DB here, keyed by user.id
      await new Promise((r) => setTimeout(r, 600)); // stub delay
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.members.page}>

      <header className={styles.members.header}> 
        <p className={styles.members.eyebrow}>Your account</p>
        <h1 className={styles.members.name}>{displayName}</h1>
        <p className={styles.members.email}>{email}</p>
      </header>

      <div className={styles.members.grid}>

        <section className={styles.members.card}>
          <h2 className={styles.members.cardTitle}>Details</h2>
          <p className={styles.members.cardSubtitle}>Fill in or edit your details below |||| WILL NOT CURRENTLY SAVE |||||</p>

          <div className={styles.members.fieldList}>
            <MemberField label="Name" value={user?.fullName ?? "—"} readOnly />
            <MemberField
              label="Pronouns"
              value={details.pronouns}
              placeholder="Add pronouns"
              onChange={(v) => setDetails((d) => ({ ...d, pronouns: v }))}
            />
            <MemberField label="Email" value={email} readOnly />
            <MemberField
              label="Phone"
              value={details.phone}
              placeholder="Add phone number"
              type="tel"
              onChange={(v) => setDetails((d) => ({ ...d, phone: v }))}
            />
          </div>

          <label className={styles.members.checkboxRow}>
            <span className={styles.members.checkboxWrap}>
              <input
                type="checkbox"
                className={styles.members.checkbox}
                checked={details.whatsapp}
                onChange={(e) =>
                  setDetails((d) => ({ ...d, whatsapp: e.target.checked }))
                }
              />
              <span className={styles.members.checkboxIndicator} aria-hidden="true" />
            </span>
            <span className={styles.members.checkboxLabel}>
              I would like to be added to our WhatsApp group and receive instant updates.
            </span>
          </label>

          <p className={styles.members.sectionLabel}>Fill in your emergency contact</p>

          <div className={styles.members.fieldList}>
            <MemberField
              label="Name"
              value={details.emergencyName}
              placeholder="Emergency contact name"
              onChange={(v) => setDetails((d) => ({ ...d, emergencyName: v }))}
            />
            <MemberField
              label="Email"
              value={details.emergencyEmail}
              placeholder="Emergency contact email"
              type="email"
              onChange={(v) =>
                setDetails((d) => ({ ...d, emergencyEmail: v }))
              }
            />
          </div>

          <label className={styles.members.checkboxRow}>
            <span className={styles.members.checkboxWrap}>
              <input
                type="checkbox"
                className={styles.members.checkbox}
                checked={details.hasAccessRequirements}
                onChange={(e) =>
                  setDetails((d) => ({
                    ...d,
                    hasAccessRequirements: e.target.checked,
                  }))
                }
              />
              <span className={styles.members.checkboxIndicator} aria-hidden="true" />
            </span>
            <span className={styles.members.checkboxLabel}>
              Please let us know if you have any access requirements, support
              needs or health conditions we need to be aware of.
            </span>
          </label>

          {details.hasAccessRequirements && (
            <textarea
              className={styles.members.textarea}
              placeholder="Please provide more details here"
              value={details.accessRequirements}
              onChange={(e) =>
                setDetails((d) => ({
                  ...d,
                  accessRequirements: e.target.value,
                }))
              }
              rows={3}
            />
          )}

          <button
            className={styles.members.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : saveSuccess ? "Saved ✓" : "Save changes"}
          </button>
        </section>

        <div className={styles.members.rightCol}>

          <section className={styles.members.card}>
            <h2 className={styles.members.cardTitle}>Bookings</h2>
            <p className={styles.members.cardSubtitle}>
              You can move any of your booked classes up to 24h in advance
            </p>

            {bookings.length > 0 ? (
              <div className={styles.members.bookingsGrid}>
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <p className={styles.members.empty}>No upcoming bookings.</p>
            )}

            <a href="/booking" className={styles.members.link}>
              Book a class
            </a>
            <p className={styles.members.cardNote}>
              You can also turn up at any class and pay at the door before or after.
            </p>
          </section>

          <section className={styles.members.card}>
            <h2 className={styles.members.cardTitle}>Active memberships</h2>

            {memberships.length > 0 ? (
              <ul className={styles.members.membershipList}>
                {memberships.map((m) => (
                  <li key={m.id} className={styles.members.membershipItem}>
                    <span>{m.type}</span>
                    {m.renewsAt && (
                      <span className={styles.members.membershipRenews}>
                        Renews {m.renewsAt.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.members.cardSubtitle}>
                You don&apos;t have any active memberships yet. If you wish, you
                can become a regular member for only £35 per month. You can
                cancel anytime.
              </p>
            )}
            {/* TODO: monthly membership link for bookings, link with property */}
            <a href="/membership" className={styles.members.link}>
              Set up monthly membership |||| WIP ||||
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

type MemberFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

function MemberField({
  label,
  value,
  placeholder,
  type = "text",
  readOnly = false,
  onChange,
}: MemberFieldProps) {
  return (
    <div className={styles.members.field}>
      <span className={styles.members.fieldLabel}>{label}</span>
      {readOnly ? (
        <span className={styles.members.fieldValue}>{value || "—"}</span>
      ) : (
        <input
          className={styles.members.fieldInput}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
}

type BookingCardProps = {
  booking: Booking;
};

function BookingCard({ booking }: BookingCardProps) {
  const month = booking.date.toLocaleDateString("en-GB", { month: "long" });
  const day = booking.date.getDate();

  return (
    <div className={styles.members.bookingCard}>
      <span className={styles.members.bookingMonth}>{month}</span>
      <span className={styles.members.bookingDay}>{day}</span>
      <button className={styles.members.link + styles.members.bookingMove} type="button">
        Move
      </button>
    </div>
  );
}