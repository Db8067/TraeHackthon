I will implement the requested features to make your ESP32 device more dynamic and integrated with the React web app.

### 1. Dynamic Wi-Fi Configuration (Device Side)
To allow setting Wi-Fi without re-uploading code, I will update the ESP32 firmware to use **WiFiManager**.
*   **How it works**: When the device can't connect to Wi-Fi, it will create its own Hotspot (AP) named "E-ResQ Config". You connect to it with your phone/laptop, a page opens automatically, and you enter your home Wi-Fi credentials there.
*   **Hardware Note**: You mentioned you only have 5V and GND connected. This is fine for power. The configuration happens wirelessly.

### 2. Device Health & Live Activity Tracking
I will update `DeviceHealth.jsx` to fetch real data from the ESP32.
*   **API Endpoint**: I'll add a `/status` endpoint to the ESP32 code.
*   **Data Points**: It will return:
    *   `wifi_strength` (RSSI)
    *   `uptime` (How long it's been running)
    *   `mode` (Ready, Calling, Fire)
*   **React Integration**: The Health page will poll this endpoint every 2 seconds to show "Online" status and live stats.

### 3. Member Calling Logic
Since the ESP32 itself cannot make cellular calls (unless you have a GSM module like SIM800L), we have two options. Given your constraints:
*   **Web-Based Calling (Recommended)**: When you click M1/M2 on the simulator, the React app will use the `tel:` protocol to open the dialer on your phone/laptop.
*   **Device Trigger**: The ESP32 will still beep/display "CALLING M1" to confirm the action physically.

### 4. Fire Alarm Toggle
I will update the logic so clicking the "Fire" button again stops the alarm.
*   **Logic**: Check if the alarm is already active. If yes, send `/stop`. If no, send `/fire`.

### 5. Step-by-Step Guide
I will provide a clear guide on:
1.  How to use the new Wi-Fi configuration portal.
2.  How to test the calling feature.
3.  How to view the live health data.

### Todo List
1.  **Update ESP32 Code**: Add WiFiManager logic, `/status` endpoint, and optimize loop.
2.  **Update `DeviceSimulator.jsx`**: Implement toggle logic for Fire button and `tel:` links for M1/M2.
3.  **Update `DeviceHealth.jsx`**: Add polling logic to fetch data from ESP32.
