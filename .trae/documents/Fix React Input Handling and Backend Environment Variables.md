There are **two sets of errors** here:

### 1. React Controlled/Uncontrolled Input Error
*   **Error**: `value prop on input should not be null` and `changing a controlled input to be uncontrolled`.
*   **Cause**: In `Config.jsx`, when I fetch data from Supabase, some fields (like `email` or `name`) might be `null` in the database. When I map this to the React state `contacts`, I am likely passing `null` to the `input` value (e.g., `value={contact.email}`). React hates `null` for values; it wants an empty string `""`.
*   **Fix**: Ensure that when I set the state from the DB, any `null` values are converted to `""` (empty string).

### 2. Twilio Backend Error
*   **Error**:
    *   `[Twilio] whatsapp Error: username is required`
    *   `[Twilio] call Error: Required parameter "params['from']" missing.`
*   **Cause**: This is critical. The backend is saying it doesn't have the `username` (which likely means `AccountSID` or `AuthToken` is missing/null) OR `from` number is missing.
    *   Since I see `Required parameter "params['from']" missing`, it means `process.env.TWILIO_PHONE_NUMBER` is **undefined** in the backend.
    *   **Why?** I suspect `dotenv` is not loading correctly or the `.env` file is not being read because the server is started with `node server/server.js` but the `.env` is inside `server/`.
    *   When running `node server/server.js` from the **root** folder (`D:\OneDrive\Desktop\Traehack`), `dotenv.config()` looks for `.env` in the *current working directory* (root), not in `server/`.
    *   I updated `server/.env` but `server.js` might not be finding it if run from root.

### Plan
1.  **Fix React Inputs (`Config.jsx`)**:
    *   Update the `fetchContacts` logic to fallback to `""` if a DB field is null.

2.  **Fix Backend Env Loading (`server/server.js`)**:
    *   Update `server.js` to explicitly point `dotenv` to the correct path OR move the backend `.env` logic.
    *   Better yet, I will modify `server/server.js` to look for `.env` in `__dirname` (its own folder) or just ensuring it loads.
    *   I will also add a `console.log` on server startup to print (masked) loaded keys to verify they are present.

Let's start by fixing the Backend first, as that's blocking functionality.
