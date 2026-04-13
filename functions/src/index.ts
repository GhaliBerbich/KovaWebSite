//v2

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

const RECAPTCHA_SECRET_KEY = defineSecret("RECAPTCHA_SECRET_KEY");

export const website_joinWaitlist = onRequest(
  { cors: true, secrets: [RECAPTCHA_SECRET_KEY.name] },
  async (req, res) => {
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
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET_KEY.value()}&response=${recaptchaToken}`,
      }
    );
    const { success, score } = await verifyRes.json();

    if (!success || score < 0.5) {
      res.status(400).json({ error: "Bot check failed." });
      return;
    }

    await db.collection("waitlist-emails").add({
      email,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  }
);
