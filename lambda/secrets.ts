/**
 * secrets.ts
 * Helper to fetch secrets from AWS Secrets Manager when USE_AWS_SECRETS=true.
 * Exports:
 * - getSecrets(): Promise<{ shiprocket?: any, whatsapp?: any }>
 *
 * Expected env variables:
 * - USE_AWS_SECRETS=true
 * - SHIPROCKET_SECRET_NAME (name/arn of secret containing Shiprocket creds as JSON)
 * - WHATSAPP_SECRET_NAME (optional)
 */

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

let cache: any = null;

async function fetchSecret(secretName?: string) {
  if (!secretName) return null;
  const client = new SecretsManagerClient({});
  const cmd = new GetSecretValueCommand({ SecretId: secretName });
  const res = await client.send(cmd);
  if (!res || !res.SecretString) return null;
  try {
    return JSON.parse(res.SecretString);
  } catch {
    // If the secret is not JSON, return raw string
    return res.SecretString;
  }
}

export async function getSecrets() {
  if (cache) return cache;

  if ((process.env.USE_AWS_SECRETS ?? "false") !== "true") {
    cache = { shiprocket: null, whatsapp: null };
    return cache;
  }

  const shiprocketName = process.env.SHIPROCKET_SECRET_NAME;
  const whatsappName = process.env.WHATSAPP_SECRET_NAME;

  const [shiprocket, whatsapp] = await Promise.all([
    fetchSecret(shiprocketName),
    fetchSecret(whatsappName),
  ]);

  cache = { shiprocket, whatsapp };
  return cache;
}

export default { getSecrets };
