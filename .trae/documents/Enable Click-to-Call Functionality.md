To allow your website (simulator) to open your phone's default emergency dialer when you click a Member button, I will use the standard `tel:` URI scheme.

### How it works
1.  **Mobile/Desktop Behavior**:
    *   On a **Phone**: It will instantly open the Phone app with the number pre-filled.
    *   On a **Laptop**: It will try to open an associated calling app (like Skype, FaceTime, or Phone Link).
2.  **Implementation**:
    *   I will modify `DeviceSimulator.jsx` to check if a valid phone number exists for the member.
    *   I will use `window.open('tel:1234567890', '_self')` to trigger the call.

### The Plan
1.  **Verify Data**: Ensure the `contacts` array in `DeviceSimulator.jsx` actually has phone numbers (fetched from `storage.js` or `localStorage`).
2.  **Update Logic**: Modify `handleMButton` to:
    *   Trigger the ESP32 (beep/display).
    *   **Simultaneously** trigger the `tel:` link on your device.
3.  **No UI Changes**: The button appearance will remain exactly the same; only the click behavior changes.

### Note on "Emergency Dialer"
Web browsers cannot force an *automatic* call (for safety). They can only open the dialer with the number ready, and the user must press the final "Call" button. This is a browser security limitation.
