# Stripe Checkout backend contract

The React app deliberately contains no Stripe secret, price ID, or payment status
logic. Implement these routes in the Cloudflare Worker/API that serves this app.
All routes must verify the Clerk bearer token and scope data to its `userId`.

## Required environment secrets

```text
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CLASS_PRICE_ID=price_...       # one-off price, charged once per selected date
STRIPE_MONTHLY_PRICE_ID=price_...     # recurring monthly price
```

Never place these in a `VITE_` variable. Configure payment methods, including
Apple Pay and Google Pay, in the Stripe Dashboard; hosted Checkout renders the
eligible choices.

## API routes

### `POST /api/checkout-sessions`

Accept either `{ kind: "class", classDates: ["YYYY-MM-DD"] }` or
`{ kind: "monthly" }`. Do **not** trust client dates, quantities, prices, or
user IDs. Validate dates and availability, create a database purchase intent,
then create the Checkout Session.

```ts
// Pseudocode: use the official Stripe server SDK or Stripe's REST API.
const intent = await db.purchaseIntents.insert({
  clerkUserId: verifiedClerkUserId,
  kind: body.kind,
  classDates: validatedDates,
  status: "pending",
});

const session = await stripe.checkout.sessions.create({
  mode: body.kind === "monthly" ? "subscription" : "payment",
  line_items: [{
    price: body.kind === "monthly" ? env.STRIPE_MONTHLY_PRICE_ID : env.STRIPE_CLASS_PRICE_ID,
    quantity: body.kind === "monthly" ? 1 : validatedDates.length,
  }],
  client_reference_id: intent.id,
  metadata: { purchaseIntentId: intent.id, clerkUserId: verifiedClerkUserId },
  success_url: `${origin}/booking?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/booking?checkout=cancel`,
});
return Response.json({ url: session.url });
```

### `GET /api/checkout-sessions/:id`

Look up the session/purchase intent by Stripe Session ID. Verify that its stored
Clerk user matches the requester and that webhook fulfillment marked it
confirmed. Return only:

```json
{ "status": "confirmed", "purchaseType": "class", "classCount": 2 }
```

or:

```json
{ "status": "confirmed", "purchaseType": "monthly", "months": 1 }
```

Return a non-2xx response while confirmation is pending; never use a browser
query parameter by itself as proof of payment.

### `POST /api/stripe/webhook`

Read the **raw request body**, validate the `Stripe-Signature` with
`STRIPE_WEBHOOK_SECRET`, and record processed Stripe event IDs so retries are
idempotent. On `checkout.session.completed`, locate the purchase intent and
create class bookings or activate the initial membership. Also process
`invoice.paid` to renew membership access and `invoice.payment_failed` to mark
the membership past due. Save Stripe customer and subscription IDs for future
billing-portal work.

### Context and no-payment routes

`GET /api/booking-context` should supply active membership, free-trial
eligibility, and excluded dates in this shape:

```json
{ "activeMembership": false, "freeTrial": true, "excludedDates": { "2026-07-23": false } }
```

`POST /api/bookings/free-trial` must atomically
check eligibility and reserve the date. `POST /api/bookings/member-drop-in` is
the optional attendance record for active members.
