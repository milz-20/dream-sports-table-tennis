Shiprocket integration (lib/delivery)
===================================

Overview
--------

This folder contains a minimal Shiprocket client and a test runner.

Files
- `shiprocket-client.ts` - minimal client with `createShipment(payload)` and dry-run support.
- `shiprocket-test.ts` - example runner that simulates an order-complete event and calls the client.

Environment
-----------

Create a `.env` file at the repository root (or export env vars) with the following keys:

- `SHIPROCKET_EMAIL` - your Shiprocket account email (not required for dry-run)
- `SHIPROCKET_PASSWORD` - your Shiprocket account password (not required for dry-run)
- `SHIPROCKET_DRY_RUN` - default `true`. When `true` the client will NOT call Shiprocket and will instead log the payload.

Quick run (dry-run)
-------------------

Install dependencies at the repo root (if you haven't already):

```bash
npm install
```

Run the test script (uses ts-node):

```bash
npm run shiprocket:test
```

Notes
-----

- The client currently uses a DRY RUN mode by default to avoid accidental shipments. When you're ready to test against real Shiprocket APIs, set `SHIPROCKET_DRY_RUN=false` and ensure the auth env vars are set.
- The payload shape used in `shiprocket-test.ts` is an example. Adjust fields to match Shiprocket's required schema and your order data.
