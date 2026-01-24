# PRODUCT REQUIREMENTS DOCUMENT (PRD): The "6-Stage" Video Scroll Engine

## 1. SCOPE: `DeviceScroll.tsx` (Desktop Only)
**Critical Rule:** We are **DELETING** the Image Frame/Canvas logic from the Desktop component.
* **New Engine:** A pure "Video Stack" implementation.
* **Mobile:** Do NOT touch `MobileDeviceScroll.tsx`. It stays as is.

## 2. THE ARCHITECTURE: 6-VIDEO STACK
Instead of drawing images, we will have 6 video elements stacked on top of each other. Their `opacity` will be controlled by `useScroll` to create smooth, cinematic crossfades.

### Asset Manifest (Scan these folders)
1.  **Hero:** `public/hero section/` (Video 1)
2.  **Trans 2:** `public/trans2/` (Video 2)
3.  **Trans 3:** `public/trans3/` (Video 3)
4.  **Trans 4:** `public/trans4/` (Video 4)
5.  **Trans 5:** `public/trans5/` (Video 5)
6.  **Footer:** `public/footerbg/` (Video 6)

## 3. SCROLL MAPPING & LOGIC
Map `scrollYProgress` (0 to 1) to the opacity of these videos.
* **Logic:** As one range ends, the previous video fades out (Opacity 1->0) and the next fades in (Opacity 0->1).

| Video | Source Folder | Scroll Range | Z-Index | UI Overlay |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hero** | `hero section` | **0% - 15%** | 60 | Existing Hero UI (Centered) |
| **2. Trans 2** | `trans2` | **15% - 32%** | 50 | None (Clean Video) |
| **3. Trans 3** | `trans3` | **32% - 48%** | 40 | None (Clean Video) |
| **4. Trans 4** | `trans4` | **48% - 64%** | 30 | None (Clean Video) |
| **5. Trans 5** | `trans5` | **64% - 80%** | 20 | None (Clean Video) |
| **6. Footer** | `footerbg` | **80% - 100%** | 10 | **Footer UI** (Links, Copyright) |

## 4. IMPLEMENTATION DETAILS

### A. Video Player Specs
* **Tag:** `<video autoplay loop muted playsinline className="fixed inset-0 w-full h-full object-cover" />`
* **Optimization:** Use `will-change: opacity` for smooth hardware acceleration.
* **Transition:** Use Framer Motion `useTransform` with a small overlap (e.g., Video 1 fades out at 0.18 while Video 2 fades in at 0.15) to prevent black flashes between videos.

### B. The Footer UI (Video 6 Overlay)
* **Trigger:** When scroll > 85%.
* **Content:** A standard SaaS Footer overlaid on the video.
    * **Columns:** Product, Company, Resources.
    * **Bottom:** "© 2026 E-ResQ Inc. All rights reserved."
    * **Style:** Glassmorphism overlay (`bg-black/40 backdrop-blur-md`) so the text is readable over the `footerbg` video.

## 5. STRICT RULES FOR AGENT
1.  **Removal:** You must completely remove the `<canvas>` and image preloading logic from `DeviceScroll.tsx`.
2.  **Path Safety:** Handle spaces in paths (`hero%20section`).
3.  **Performance:** If a video is fully transparent (opacity 0), apply `visibility: hidden` via CSS to save GPU resources.
4.  **Quality:** Do NOT compress or alter the videos. Display them at original quality.

## 6. EXECUTION PLAN
1.  Scan all 6 folders to get filenames.
2.  Rebuild `DeviceScroll.tsx` with the 6-Video Stack.
3.  Implement the Scroll/Opacity mapping.
4.  Add the Footer UI overlay for the final stage.