Ayurvedic Botanical Traceability – Blockchain PoC

Overview

This repository contains a proof-of-concept for end-to-end botanical traceability of Ayurvedic herbs. It includes:

- Permissioned blockchain smart contract (TypeScript chaincode skeleton)
- Backend API (Node.js/Express) with swappable adapters:
  - In-memory adapter (default for quick demo)
  - Fabric adapter (stubbed, to wire into Fabric)
- Consumer portal (web) to scan/query QR and view provenance on a map
- Collectors mobile-friendly web app to capture geo-tagged harvest events
- IoT/SMS gateway service (HTTP webhook) to transform payloads into events
- Fabric network scaffolding and setup docs (reference docker-compose)

Quickstart (Demo Mode: In-Memory)

### Single Command Start (All on Port 4000)

```bash
./start.sh
```

**All services available on port 4000:**
- Dashboard: http://localhost:4000/dashboard
- Consumer Portal: http://localhost:4000/consumer
- Collectors App: http://localhost:4000/collectors
- **Fabric Logs: http://localhost:4000/logs**
- API: http://localhost:4000/api

**See `DEMO_GUIDE.md` for complete demo instructions!**

**See `SETUP_GUIDE.md` for complete setup instructions for new laptops!**

See `QUICKSTART.md` for technical setup details.

### Alternative: Separate Ports (Development)

For development with hot reload, see `SETUP.md` for running services separately.

Environment

- Node >= 18
- Modern browser (for PWA + geolocation)

Architecture

- FHIR-style resources: `CollectionEvent`, `ProcessingStep`, `QualityTest`, `Provenance`
- Backend exposes REST API consumed by portals and gateway
- QR codes encode a `batchId` or `provenanceId`

Fabric (Optional Advanced Setup)

- See `blockchain-network/` for reference docker compose and docs
- Implement `backend-api/src/adapters/fabricAdapter.ts` to connect to a live Fabric network

Security & Privacy Notes

- GPS data and identities are sensitive. In production, apply data minimization, consent flows, encryption at rest and in transit, and role-based access controls.

# Botanical-Traceability-of-Ayurvedic-Herbs
