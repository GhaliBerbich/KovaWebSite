"use strict";
//v2
Object.defineProperty(exports, "__esModule", { value: true });
exports.website_joinWaitlist = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
const RECAPTCHA_SECRET_KEY = (0, params_1.defineSecret)("RECAPTCHA_SECRET_KEY");
exports.website_joinWaitlist = (0, https_1.onRequest)({ cors: true, secrets: [RECAPTCHA_SECRET_KEY.name] }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed." });
        return;
    }
    const { email, recaptchaToken } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ error: "Please enter a valid email." });
        return;
    }
    // Verify reCAPTCHA v3 token
    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET_KEY.value()}&response=${recaptchaToken}`,
    });
    const { success, score } = await verifyRes.json();
    if (!success || score < 0.5) {
        res.status(400).json({ error: "Bot check failed." });
        return;
    }
    await db.collection("waitlist-emails").add({
        email,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
});
//# sourceMappingURL=index.js.map