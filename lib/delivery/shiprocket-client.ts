import axios from "axios";
import secretsHelper from "../secrets";

/*
  Minimal Shiprocket client (safe/dry-run by default).
  - Reads credentials from env: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD
  - Use SHIPROCKET_DRY_RUN=true to avoid any network side-effects (recommended for now)

  Exports:
  - authenticate(): Promise<string> // bearer token
  - createShipment(payload, options): Promise<any>
*/

type AuthResponse = { token: string };

const SHIPROCKET_AUTH = "https://apiv2.shiprocket.in/v1/external/auth/login";
const SHIPROCKET_SHIPMENTS = "https://apiv2.shiprocket.in/v1/external/shipments";

const DRY_RUN = (process.env.SHIPROCKET_DRY_RUN ?? "true") === "true";

async function authenticate(): Promise<string> {
  // If configured, load secrets from AWS Secrets Manager
  if ((process.env.USE_AWS_SECRETS ?? "false") === "true") {
    try {
      const s = await secretsHelper.getSecrets();
      if (s?.shiprocket) {
        // allow either object shape or raw string
        const creds = typeof s.shiprocket === "string" ? JSON.parse(s.shiprocket) : s.shiprocket;
        process.env.SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL ?? creds.email ?? creds.SHIPROCKET_EMAIL;
        process.env.SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD ?? creds.password ?? creds.SHIPROCKET_PASSWORD;
      }
    } catch (e) {
      console.warn("shiprocket-client: failed to load secrets from AWS Secrets Manager:", e instanceof Error ? e.message : e);
    }
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD environment variables");
  }

  if (DRY_RUN) {
    // Return a fake token in dry-run mode
    return `dry-token-${Date.now()}`;
  }

  const res = await axios.post<AuthResponse>(SHIPROCKET_AUTH, {
    email,
    password,
  });

  if (!res.data || !(res.data as any).token) {
    throw new Error("Invalid auth response from Shiprocket");
  }

  return (res.data as any).token;
}

export async function createShipment(payload: any): Promise<any> {
  if (DRY_RUN) {
    // In test mode, do not call Shiprocket. Instead return a mocked response and log the payload.
    console.log("[shiprocket-client] DRY RUN - would send shipment payload:", JSON.stringify(payload, null, 2));
    return {
      ok: true,
      dryRun: true,
      payload,
      message: "Dry-run mode: no API call was made",
    };
  }

  const token = await authenticate();

  const res = await axios.post(SHIPROCKET_SHIPMENTS, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

export default {
  authenticate,
  createShipment,
};
