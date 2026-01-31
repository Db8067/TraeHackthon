import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// --- SERVER SETUP WITH ENV VARS ---

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathsToTry = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env')
];
pathsToTry.forEach(p => {
    if (fs.existsSync(p)) dotenv.config({ path: p });
});

const API_KEY = process.env.TWILIO_API_KEY;
const API_SECRET = process.env.TWILIO_API_SECRET;
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+17653965595';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Client
console.log("-------------------------------------------");
console.log("SERVER STARTING - TWILIO CONFIG");
console.log("Account SID:", ACCOUNT_SID ? "SET" : "MISSING");
console.log("API Key:    ", API_KEY ? "SET" : "MISSING");
console.log("From Number:", FROM_NUMBER);
console.log("-------------------------------------------");

let client;
try {
    if (API_KEY && API_SECRET && ACCOUNT_SID) {
        client = twilio(API_KEY, API_SECRET, { accountSid: ACCOUNT_SID });
    } else {
        console.error("MISSING CREDENTIALS - Call functionality will fail.");
    }
} catch (e) {
    console.error("Failed to init Twilio:", e);
}

app.post('/api/call', async (req, res) => {
    console.log("\n[INCOMING REQUEST] /api/call");
    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ error: "Missing 'to' number" });
    }

    if (!client) {
        return res.status(500).json({ error: "Server misconfigured (missing credentials)" });
    }

    try {
        console.log(`Attempting Call -> To: ${to}, From: ${FROM_NUMBER}`);
        
        const call = await client.calls.create({
            twiml: '<Response><Say>Emergency Alert. This is a simulation call.</Say></Response>',
            to: to,
            from: FROM_NUMBER 
        });
        
        console.log(`SUCCESS! Call SID: ${call.sid}`);
        res.json({ success: true, sid: call.sid });
    } catch (err) {
        console.error("CRITICAL TWILIO ERROR:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => {
    console.log(">>> SERVER RUNNING ON PORT 3000");
});