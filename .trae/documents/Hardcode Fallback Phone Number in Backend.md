This is very strange. My previous code explicitly attempts to load `TWILIO_PHONE_NUMBER` from `.env`. If it's still missing, it means the variable is undefined in `process.env`.

However, since you want to ensure this number is used, and we are in a hackathon/demo context where "it just needs to work", I will **hardcode** the phone number into `server.js` as a fallback.

This eliminates any possibility of "environment variable missing" errors for the `from` parameter.

### Plan
1.  **Modify `server.js`**:
    *   Add a constant `FALLBACK_PHONE_NUMBER = '+17653965595'`.
    *   Use `process.env.TWILIO_PHONE_NUMBER || FALLBACK_PHONE_NUMBER` in all Twilio calls.

This is the most direct fix.
