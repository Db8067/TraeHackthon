To stream video from your ESP32-CAM to your React website, I will implement a new page called **LiveFeed**.

### The Challenge
Standard ESP32 code (Arduino) cannot handle both high-speed video streaming AND the complex web server logic we just built (calling, fire alarm, health check) on the *same* core efficiently without crashing. The ESP32-CAM is usually a separate module from the main controller.

### The Solution (Single ESP32-CAM Approach)
Since you mentioned you are using an "ESP-32 with cam", I assume it's an **ESP32-CAM module**. I will provide a new, specialized firmware that handles **BOTH** the camera streaming and the API endpoints we built.

1.  **New Firmware**: I will rewrite `ESP32_Code.ino` to include the standard `esp32_camera` library.
    *   It will serve a Motion-JPEG stream at `/stream`.
    *   It will keep the existing `/call`, `/fire`, `/status` endpoints.
    *   **Note**: The OLED display might need to be removed or re-pinned if you are using the standard AI-Thinker ESP32-CAM, as it uses most pins for the camera. I will assume standard pinouts.

2.  **New React Page (`src/pages/LiveFeed.jsx`)**:
    *   I will create a page that displays the MJPEG stream.
    *   It will use your existing dark theme.
    *   It will have a simple `<img>` tag pointing to the stream URL (this is the standard way to view MJPEG).

3.  **Routing**: I will add `/live-feed` to `App.jsx`.

### Step-by-Step Plan
1.  **Create `src/pages/LiveFeed.jsx`**: Build the UI to view the camera.
2.  **Update `App.jsx`**: Add the route.
3.  **Update ESP32 Code**: Provide the complex camera-webserver code.
