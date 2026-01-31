I will implement a more robust and "advanced" connection logic to solve the persistent "Offline" issue.

### The Problem
The browser is likely blocking the connection because of:
1.  **Mixed Content**: Your React app might be running on `https` (or just treated strictly) while the ESP32 is `http`.
2.  **CORS Issues**: Even though we added headers, browsers are very strict about local network requests (Private Network Access).
3.  **Network Isolation**: Sometimes devices on the same Wi-Fi can't talk to each other (AP Isolation).

### The Advanced Solution
I will implement a multi-layered approach to ensure connectivity:

1.  **React Proxy (Vite Config)**:
    *   Instead of the browser fetching `http://192.168.1.15` directly (which browsers hate), I will configure Vite to **proxy** requests.
    *   The React app will call `/api/device/status`.
    *   The Vite development server (Node.js) will forward this to the ESP32. Node.js doesn't have CORS/Mixed Content restrictions.

2.  **Resilient Polling Hook**:
    *   I will create a custom React Hook `useDeviceStatus` that handles:
        *   Exponential backoff (retries intelligently).
        *   Connection timeout handling.
        *   Fallback to "Demo Mode" if connection fails (so the UI doesn't look broken).

3.  **Diagnostic UI**:
    *   I'll add a hidden "Debug" section in the Health page that shows exactly *what* error is happening (e.g., "Connection Refused" vs "Timeout").

### Plan Execution
1.  **Modify `vite.config.ts`**: Add a proxy rule for `/api/device` -> `http://192.168.1.15`.
2.  **Update `DeviceHealth.jsx`**: Use the new `/api/device` route and add the robust polling logic.
3.  **Update `DeviceSimulator.jsx`**: Also switch it to use the proxy for consistency.

This approach bypasses the browser's security restrictions by routing traffic through your dev server, which is the industry-standard way to handle IoT local development.
