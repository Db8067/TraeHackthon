# PRODUCT REQUIREMENTS DOCUMENT (PRD): Mobile Final Polish & Centering

## 1. COMPONENT: `MobileDeviceScroll.tsx` (Phone Only)
**Strict Rule:** These changes apply ONLY to the mobile component. Do not touch Desktop logic.

## 2. IMAGE RENDERING LOGIC (The "Big & Centered" Fix)
* **Goal:** The device must look BIG (covering ~70-80% of screen height) and be perfectly CENTERED horizontally.
* **New Scaling Math:**
    * Do NOT scale to match screen width (makes it too small).
    * **Scale Factor:** `const scale = (canvas.height / img.height) * 0.85;`
    * This ensures the device is tall and detailed, regardless of how wide the original image file is.
* **New Positioning Math (The "Right Shift"):**
    * The device is slightly to the left in the source frames. To center it on a phone, we must shift the rendering to the RIGHT.
    * `const renderWidth = img.width * scale;`
    * `const x = (canvas.width - renderWidth) / 2 + (canvas.width * 0.15);`
    * **Logic:** Standard Center + **15% Screen Width Offset to the Right**.
    * `const y = (canvas.height - (img.height * scale)) / 2;` (Vertically centered).

## 3. SCROLL LOGIC FIXES (The "Stuck" & "Gap" Fix)
* **Force Scroll Top:**
    * On component mount, you MUST execute:
      ```javascript
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
      ```
    * This ensures the user *always* starts at the first transformation, never the last.
* **Reduce Scroll Track:**
    * Change the parent container height from `h-[500vh]` to `h-[350vh]`.
    * This reduces the "Empty Gaps" between text animations, making the experience feel faster and more responsive on mobile.

## 4. UI OVERLAY (Text Positioning)
* **Hero Text (0%):** Ensure it is `justify-center` (Vertically centered) so it sits nicely over the device.
* **Feature Text (30-60%):** Ensure these cards appear *below* the device (or overlaid at the bottom) so they don't cover the now-enlarged device screen.

## 5. EXECUTION PLAN
1.  Update `MobileDeviceScroll.tsx` with the new **Height-Based Scaling** and **Right-Shift Offset**.
2.  Add the **Scroll Restoration** fix to `App.tsx` or the main layout.
3.  Adjust the Mobile CSS height to `350vh`.