I will implement the backend logic to connect your React simulator to the ESP32 device over Wi-Fi.

### 1. Update React Simulator Logic (`src/pages/DeviceSimulator.jsx`)

I will modify the existing `DeviceSimulator.jsx` to send HTTP requests to the ESP32 when buttons are clicked.

* Add a configuration constant `ESP_DEVICE_URL` for the device's IP address.

* Create a `triggerDevice(action)` function to handle the network requests.

* Integrate this function into `handleMButton` (for calling) and `handleFire` (for fire alert).

* **Note**: I will **not** change the visual UI, only the internal logic as requested.

### 2. Create ESP32 Firmware

I will provide the complete, updated C++ code for your ESP32.

* **WiFi Connection**: Connects to your mobile hotspot.

* **Web Server**: Listens for commands from the simulator.

* **API Endpoints**:

  * `/call` -> Triggers the "CALLING..." mode.

  * `/fire` -> Triggers the "!! FIRE !!" mode.

* **CORS Support**: Adds necessary headers so the browser allows the simulator to talk to the device.

* **Existing Features**: Keeps your OLED display, physical buttons, and buzzer logic working.

### 3. Usage Guide

I will provide simple steps to:

1. Configure your Hotspot credentials in the ESP32 code.
2. Upload the code and find the ESP32's IP address.
3. Update the IP address in the React code.
4. Run the test.

