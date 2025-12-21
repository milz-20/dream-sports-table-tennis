Shiprocket integration (lib/delivery)
===================================

Overview
--------

This folder contains a minimal Shiprocket client, a delivery controller, and a consolidated test harness. The goal is to provide a plug-and-play delivery module that:

- Creates a shipment record with Shiprocket (dry-run safe by default)
- Schedules a pickup
- Returns a normalized delivery result (shipment + pickup)
- Supports idempotency via an optional storage adapter

Files
-----
- `shiprocket-client.ts` - minimal client with `authenticate()`, `createShipment(payload)` and `createPickup(payload)`; DRY_RUN support.
- `shiprocket-service.ts` - maps your order object to Shiprocket payload and orchestrates createShipment + createPickup.
- `delivery-controller.ts` - exposes `runDelivery(order, options)` which wraps `processShipment`, adds idempotency and optional persistence.
- `shiprocket-test.ts` - consolidated test harness used for local dry-run and unit-like assertions.

Environment
-----------

Create a `.env` file at the repository root (or export env vars) with the following keys for local testing:

- `SHIPROCKET_EMAIL` - your Shiprocket account email (not required for dry-run)
- `SHIPROCKET_PASSWORD` - your Shiprocket account password (not required for dry-run)
- `SHIPROCKET_DRY_RUN` - default `true`. When `true` the client will NOT call Shiprocket and will instead log the payload.

Explanation: Replace verbose file with a concise, actionable delivery process and pre-deploy checklist.

## Delivery integration — process & pre-deploy checks

This file describes the delivery flow we run when an order is completed and the minimal pre-deploy checklist to safely flip from dry-run to production.

Core runtime behavior
----------------------
- `runDelivery(order, options)` (in `lib/delivery/delivery-controller.ts`) is the top-level entry used by the app to schedule deliveries.
- `runDelivery` calls `processShipment(order)` (in `lib/delivery/shiprocket-service.ts`) which:
  - maps your order to a Shiprocket payload,
  - calls the Shiprocket client (`lib/delivery/shiprocket-client.ts`) to create the shipment,
  - attempts to schedule a pickup via `createPickup`, and
  - returns a normalized result `{ ok: true, shiprocket, pickup }` (or an error object on failure).
- By default the code runs in dry-run mode when `SHIPROCKET_DRY_RUN=true` so no external calls are made.

Required environment variables
-----------------------------
- `SHIPROCKET_DRY_RUN` (true | false) — default `true` in local/dev. Set to `false` to perform real API calls.
- `USE_AWS_SECRETS` (true | false) — whether to read credentials from AWS Secrets Manager.
- `SHIPROCKET_SECRET_NAME` — secret name in Secrets Manager with JSON `{"email":"...","password":"..."}`.
- `AWS_REGION` — region for Secrets Manager access.
- `SHIPROCKET_PICKUP_LOCATION` — pickup location identifier or human name used in payload.
- `SHIPROCKET_CHANNEL_ID` — optional numeric channel id (account-specific).

Minimal pre-deploy checklist (do these before setting `SHIPROCKET_DRY_RUN=false` in prod)
--------------------------------------------------------------------------------
1) Add production Shiprocket credentials
   - Put production credentials into AWS Secrets Manager (or your secret store). Example secret value: `{"email":"ops@yourco.com","password":"..."}`.
   - Set `USE_AWS_SECRETS=true` and `SHIPROCKET_SECRET_NAME` to that secret in your prod env.

2) Ensure the runtime role can read the secret
   - Grant `secretsmanager:GetSecretValue` (and `kms:Decrypt` when a CMK protects the secret) to the service role.

3) Configure pickup/channel settings
   - Set `SHIPROCKET_PICKUP_LOCATION` and `SHIPROCKET_CHANNEL_ID` to values matching your Shiprocket account.

4) Run a staged smoke test (one controlled order)
   - Use an isolated staging environment or a single controlled production order to verify `createShipment` and `createPickup` succeed and the Shiprocket dashboard reflects the change.

5) Prevent duplicate invocations (idempotency)
   - Because this repository currently returns results via function calls and does not persist records externally, ensure your order pipeline marks orders as `delivery-scheduled` before calling `runDelivery` to avoid duplicate shipments from retries.

6) Monitoring & logging
   - Enable structured logging for delivery API calls and set alerts for repeated failures and high error rates.

7) Rollback & runbook
   - Prepare a short runbook for operations: how to cancel shipments, refund customers, and reconcile duplicates. Keep sample Shiprocket request/response logs for the first week.

Quick smoke-test (one-click)
----------------------------
- A helper script `lib/delivery/smoke-test.ts` exists to run a controlled delivery attempt. Add a temporary environment with real credentials and set `SHIPROCKET_DRY_RUN=false` to perform a real call.

Webhook scaffold
----------------
- A minimal webhook endpoint is provided at `/api/webhooks/shiprocket` (Next.js app route). It logs incoming events so you can verify Shiprocket can reach your app. Implement persistence and signature verification before relying on webhooks in prod.

If you want I can also:
- add a lightweight persistence adapter (DynamoDB) so `runDelivery` returns a durable record,
- implement token caching + retry in the Shiprocket client,
- or add a small tracking API/frontend to show timelines.

That's the minimal, actionable process we follow for delivery pre-deploy.


