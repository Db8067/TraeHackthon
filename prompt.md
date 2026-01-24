# PRODUCT REQUIREMENTS DOCUMENT (PRD): "Apple-Level" UI Overhaul

## 1. THE MISSION: "INSANE" UI TRANSFORMATION
**Goal:** Rebuild the entire UI wrapper of the website to match the quality of `apple.com/airpods` while keeping the core "Scrollytelling" engine intact.
**Theme:** "Stealth Luxury." Pure Black (`#050505`), White Text, Titanium Accents.
**Constraint:** You MUST maintain the **Split Architecture** (`DeviceScroll` for Laptop vs. `MobileDeviceScroll` for Phone). Do NOT touch the underlying Canvas/Image logic. Only change the UI overlays, Headers, and Components.

## 2. DESIGN SYSTEM (Apple-Inspired Logic)
* **Typography:** Use **Inter** (tight tracking).
    * *Hero:* `text-7xl font-semibold tracking-tighter`.
    * *Sub:* `text-xl text-white/60 font-medium`.
* **Glassmorphism 2.0:** All floating elements (Header, Cards, Bottom Sheets) must use:
    * `bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl`.
* **"Bento" Grids:** Feature sections (like "Threat Cam", "SOS") should use a rounded-3xl grid layout, similar to Apple's feature comparison blocks.

## 3. GLOBAL COMPONENTS

### A. The "Dynamic Island" Header
* **Concept:** Instead of a boring fixed bar, create a **Floating Capsule Header**.
* **Behavior:**
    * **Desktop:** A pill-shaped glass bar centered at the top (`top-6`). Contains: Logo (Left), Nav Links (Center), "Pre-Book" (Right).
    * **Mobile:** A bottom-dock glass bar (like iOS App Switcher) containing essential actions.
* **Animation:** It expands/contracts on scroll.

### B. The Logo (New Identity)
* **Concept:** **"The Guardian Pulse"**.
* **Visual:** A minimalist **Shield** outline intersected by a **Heartbeat (ECG) Line**.
* **Implementation:** Use an SVG icon (Lucide `ShieldAlert` combined with `Activity` or custom SVG).
* **Animation:** The "Pulse" line should glow/animate subtly every 3 seconds.

### C. The Loading Screen (Universal)
* **Fix:** Enable the "System Initializing" screen for **BOTH** Mobile and Laptop.
* **Visual:**
    * Center: The new "Guardian Pulse" logo breathing.
    * Bottom: Monospaced text `LOADING ASSETS // [XX]%`.
    * Background: Pure `#050505`.

## 4. LAPTOP UI SPECIFICATIONS (`DeviceScroll.tsx`)
* **Hero Text:**
    * **Position:** Top-Right (`top-[15%] right-[5%]`).
    * **Style:** Apple-style big heading. "Professional. Guardian."
* **Feature Cards (30% - 60%):**
    * **Layout:** A **Vertical Stack of Glass Cards** on the Right Side.
    * **Behavior:** As you scroll, the active card lights up (`opacity-100`), inactive cards dim (`opacity-30`).
    * **Visual:** "Hardware Meets Cloud" -> "AI Threat Cam" -> "Seismic Sensor".

## 5. MOBILE UI SPECIFICATIONS (`MobileDeviceScroll.tsx`)
* **Layout:** "Immersive Wallpaper" (Fixed Device Background).
* **UI Layer:** **"Apple Maps" Style Bottom Sheet.**
    * **0% Scroll:** A Glass Card at the bottom showing Title + CTA.
    * **Scroll Interaction:** As you scroll, the bottom sheet **Expands** to cover the bottom half, revealing feature details (Bento Grid) while the device scales/shifts in the background.
* **Typograpghy:** Massive, centered text for "E-ResQ" that fades out as the device zooms in.

## 6. STRICT RULES FOR AGENT
1.  **Zero-Touch Logic:** Do NOT modify the `useRef`, `requestAnimationFrame`, or `io2_opt` image loading logic. That is perfect. Only change the `<div>`s and CSS classes *around* it.
2.  **Separate Files:** Laptop changes go to `DeviceScroll.tsx`. Phone changes go to `MobileDeviceScroll.tsx`.
3.  **Logo:** Replace the old text logo with the new "Shield Pulse" icon everywhere.

## 7. EXECUTION PLAN
1.  **Create `Navbar.tsx`:** The new "Floating Capsule" header.
2.  **Update `App.tsx`:** Enable Global Loader for mobile.
3.  **Refactor `DeviceScroll.tsx` (Laptop):** Implement the "Vertical Card Stack" UI.
4.  **Refactor `MobileDeviceScroll.tsx` (Phone):** Implement the "Bottom Sheet" UI.