# Project screenshots

Each project card in `index.html` points at one image here.

| File | Project | Status |
|------|---------|--------|
| `eserbisyo.webp`      | eSERBISYO — LRA Web Portal | ✅ captured |
| `splat.webp`          | SPLAT | ✅ captured |
| `ahc-corporate.webp`  | AHC Corporate Site & Patient Registration | ✅ captured |
| `piu.webp`            | PIU Report & Automated Response (Petersen) | ✅ captured |
| `aga-appointment.webp`| AGA Clinic Appointment App (login screen) | ✅ captured |

The captured images are landing-page (or login) screenshots compressed to WebP
(~1000px wide, quality 80).

**Tips**
- Any web image format works (`.webp`, `.png`, `.jpg`) — if you change the
  extension, update the matching `src` in `index.html`.
- Cards crop to a **16:10** banner from the top, so a wide screenshot of the
  landing/hero area looks best (~1200×750 source).
- Until a file is present, the card shows a graceful `</>` placeholder.

⚠️ **AGA Clinic Appointment App uses the login screen on purpose.** The app's
authenticated screens show real patient names/schedules (PII), so only the
public login page is shown. Never replace it with a logged-in view that
contains patient data.
