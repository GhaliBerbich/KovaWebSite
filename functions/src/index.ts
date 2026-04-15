import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

initializeApp();
const db = getFirestore();
const recaptchaClient = new RecaptchaEnterpriseServiceClient();

const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY ?? "";
const MIN_SCORE = 0.5;

export const website_joinWaitlist = onRequest(
  { cors: true },
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

    if (!recaptchaToken) {
      res.status(400).json({ error: "Missing reCAPTCHA token." });
      return;
    }

    const projectId = process.env.GCLOUD_PROJECT;
    const projectPath = recaptchaClient.projectPath(projectId!);

    const [assessment] = await recaptchaClient.createAssessment({
      parent: projectPath,
      assessment: {
        event: {
          token: recaptchaToken,
          siteKey: RECAPTCHA_SITE_KEY,
          expectedAction: "waitlist",
        },
      },
    });

    if (!assessment.tokenProperties?.valid) {
      res.status(400).json({ error: "Bot check failed: invalid token." });
      return;
    }

    if (assessment.tokenProperties?.action !== "waitlist") {
      res.status(400).json({ error: "Bot check failed: action mismatch." });
      return;
    }

    if ((assessment.riskAnalysis?.score ?? 0) < MIN_SCORE) {
      res.status(400).json({ error: "Bot check failed: low score." });
      return;
    }

    await db.collection("waitlist-emails").add({
      email,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  }
);
