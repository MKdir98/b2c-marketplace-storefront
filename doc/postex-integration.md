## Postex shipping integration design

Reference: [Postex developer docs](https://staging.api.postex.ir/developers-docs/index.html)

### Goals
- Live rate quotes for both delivery and pickup at checkout, with SLA/ETA from Postex.
- Create shipments on order placement; generate labels for seller orders page.
- Support multi‑parcel shipments.
- 30‑minute polling for tracking status (no webhooks).
- City/province mapping to Postex codes.
- No COD, no insurance, no cancellations, no SMS.
- Persian address support end‑to‑end.

### Confirmed decisions (from product/you)
- API key exists in backend `.env`.
- Local cities table exists; we will add a mapper to Postex city/province codes.
- Offer both shipping (delivery) and pickup; include both in price API and show at checkout.
- Use product price and size data; support multi‑parcel.
- No COD, no insurance, no SMS, no cancel; pickup supported.
- Use Postex response to display SLA/ETA at checkout.
- No national ID required.
- Tracking via polling every 30 minutes (no webhook for now).
- Status list comes from Postex docs; we map to internal statuses.

---

## Data model and mapping

### Address and city/province codes
- Storefront captures: first/last name, phone, email, address_1, postal_code, province, city (Persian).
- Backend resolves to Postex codes:
  - Extend `cities` table with `postex_city_code`, `postex_province_code`, `last_verified_at`.
  - City mapper logic:
    - Normalize Persian names (trim/diacritics/uniform spaces).
    - Exact match on province + city → code.
    - Fuzzy fallback (Levenshtein) within the selected province.
    - If unmapped, block rate/shipment with a clear message.

### Parcels (multi‑parcel)
- Derive parcels from line items:
  - Use product fields for `weight_kg`, `length_cm`, `width_cm`, `height_cm`.
  - Default grouping: one parcel per item quantity.
  - If any field missing, use defaults from env.

### Shipment fields to persist
- `postex_shipment_id`
- `tracking_number`
- `service_code`, `delivery_mode` (delivery|pickup)
- `label_url` or `label_base64`, `label_mime`
- `status`, `last_polled_at`
- Raw API response (audit)

---

## Backend design

### Environment variables
- `POSTEX_BASE_URL`
- `POSTEX_API_KEY`
- Sender profile:
  - `POSTEX_SENDER_NAME`, `POSTEX_SENDER_PHONE`
  - `POSTEX_SENDER_ADDRESS`, `POSTEX_SENDER_POSTAL_CODE`
  - `POSTEX_SENDER_CITY_CODE`, `POSTEX_SENDER_PROVINCE_CODE`
- Defaults:
  - `POSTEX_DEFAULT_WEIGHT_KG=0.2`
  - `POSTEX_DEFAULT_DIM_CM=20x15x5`
  - `POSTEX_POLL_INTERVAL_MINUTES=30`

### Postex client
- Inject auth header for every call.
- Idempotency key on shipment creation (order id).
- Retry/backoff; normalize business/HTTP errors.

### API endpoints (server)
- POST `/shipping/postex/rates`
  - Input: origin (env), destination address, parcels[], delivery_mode in {delivery, pickup}
  - Output: array of service options with price, currency, SLA/ETA.
- POST `/shipping/postex/shipments`
  - Input: order id, recipient address, parcels[], service_code, delivery_mode
  - Output: `postex_shipment_id`, `tracking_number`, `label_url|label_base64`, `service_code`.
- GET `/shipping/postex/labels/:shipmentId`
  - Streams the PDF label to the browser.
- Admin utility (optional): POST `/admin/postex/cities/map`
  - Upsert mappings and verify against Postex master list.

### Example contracts

Rates request:
```json
{
  "delivery_mode": "delivery",
  "destination": {
    "province": "تهران",
    "city": "تهران",
    "postal_code": "1234567890",
    "address_1": "خیابان مثال",
    "phone": "09XXXXXXXXX"
  },
  "parcels": [
    { "weight_kg": 0.5, "length_cm": 20, "width_cm": 15, "height_cm": 5 },
    { "weight_kg": 1.2, "length_cm": 30, "width_cm": 20, "height_cm": 10 }
  ]
}
```

Rates response:
```json
[
  {
    "service_code": "POSTEX_STANDARD",
    "service_name": "استاندارد",
    "price": 150000,
    "currency": "IRR",
    "eta": "2-3 روز",
    "delivery_mode": "delivery"
  },
  {
    "service_code": "POSTEX_PICKUP",
    "service_name": "تحویل در مرکز",
    "price": 90000,
    "currency": "IRR",
    "eta": "1-2 روز",
    "delivery_mode": "pickup"
  }
]
```

Create shipment request:
```json
{
  "order_id": "ord_123",
  "delivery_mode": "delivery",
  "service_code": "POSTEX_STANDARD",
  "recipient": {
    "first_name": "علی",
    "last_name": "محمدی",
    "phone": "09XXXXXXXXX",
    "email": "test@example.com",
    "province": "تهران",
    "city": "تهران",
    "postal_code": "1234567890",
    "address_1": "خیابان مثال"
  },
  "parcels": [
    { "weight_kg": 0.5, "length_cm": 20, "width_cm": 15, "height_cm": 5 }
  ]
}
```

Create shipment response:
```json
{
  "postex_shipment_id": "PX123456789",
  "tracking_number": "TRK123456789",
  "service_code": "POSTEX_STANDARD",
  "delivery_mode": "delivery",
  "label_url": "https://.../label.pdf",
  "label_mime": "application/pdf"
}
```

### Tracking (polling worker)
- Run every 30 minutes.
- Select non‑terminal shipments; batch query Postex.
- Map Postex codes → internal statuses:
  - created → created
  - picked_up → picked_up
  - in_transit → in_transit
  - out_for_delivery → out_for_delivery
  - delivered → delivered
  - failed/return → failed or returned
- Save tracking events; update `status`, `last_polled_at`.

---

## Frontend design (Next.js)

### Checkout
- Add “روش ارسال” selector: Postex Delivery | Postex Pickup.
- When address or mode changes, fetch `/shipping/postex/rates` and display options with price + ETA.
- Persist selected `service_code` and `delivery_mode` on cart/order.

### Orders (seller)
- Show `tracking_number`.
- Provide “دانلود برچسب” → `/shipping/postex/labels/:shipmentId`.

---

## Error handling and validations
- Validate postal code and phone format.
- Block if city/province mapping to Postex codes fails.
- Handle Postex errors: invalid address, service unavailable, size/weight bounds.
- Server‑side retries; redact PII in logs.

---

## Database changes
- Cities table: add `postex_city_code`, `postex_province_code`, `last_verified_at`.
- Shipments (or fulfillment extension):
  - `id`, `order_id`, `fulfillment_id`
  - `delivery_mode`, `service_code`
  - `postex_shipment_id`, `tracking_number`
  - `label_url`, `label_mime`
  - `status`, `last_polled_at`, `raw_payload`
  - timestamps

---

## Testing & rollout
- Unit: city mapper, parcel builder (multi‑parcel), status mapper, client.
- Integration: rate → create → label → polling.
- Scenarios: delivery vs pickup, multi‑parcel, missing mapping, oversize.
- Rollout order: mapper → rates → shipments → labels → polling → UI wiring.

---

## Open questions
- Pickup UX: do customers select a specific Postex pickup point? If yes, we need the endpoint and required fields to surface points near a destination.
- Product model: confirm field names and units for weight/dimensions.
- Currency/tax: confirm currency (IRR) and any VAT/surcharge to add on top of Postex price.
- Label: PDF acceptable? Any size/DPI requirement from sellers?

---

## References
- Postex API: [staging.api.postex.ir/developers-docs](https://staging.api.postex.ir/developers-docs/index.html) 