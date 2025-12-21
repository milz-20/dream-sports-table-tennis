/**
 * whatsapp-notifier.ts
 * Minimal WhatsApp notifier stub.
 * - In DRY_RUN (SHIPROCKET_DRY_RUN or WHATSAPP_DRY_RUN) it logs messages instead of sending.
 * - Later this can be wired to a real WhatsApp API (e.g., Twilio/360dialog) or AWS SNS.
 */

const DRY_RUN = (process.env.WHATSAPP_DRY_RUN ?? process.env.SHIPROCKET_DRY_RUN ?? "true") === "true";

export async function notify(phone?: string, message?: string) {
  const dest = phone ?? process.env.DEFAULT_PHONE ?? "(no-phone)";
  if (DRY_RUN) {
    console.log(`[whatsapp-notifier] DRY RUN - would send to ${dest}: ${message}`);
    return { ok: true, dryRun: true };
  }

  // TODO: Integrate with real WhatsApp provider here.
  // Placeholder: log and return success.
  console.log(`[whatsapp-notifier] send to ${dest}: ${message}`);
  return { ok: true };
}

export default { notify };
