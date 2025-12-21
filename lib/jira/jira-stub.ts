import fs from 'fs';
import path from 'path';

const LOG_PATH = path.resolve(__dirname, '..', 'delivery', 'delivery_jira_log.jsonl');

export async function createJiraTicket(orderId: string, issue: string, details?: any) {
  const payload = { id: `JIRA-${Date.now()}`, orderId, issue, details, createdAt: new Date().toISOString() };
  const line = JSON.stringify(payload) + '\n';
  // append to a local file as a stub for later integration with real JIRA
  try {
    fs.appendFileSync(LOG_PATH, line);
    console.warn('[jira-stub] created ticket', payload.id);
  } catch (err) {
    console.error('[jira-stub] failed to write ticket', err);
  }
  return payload;
}

export default { createJiraTicket };
