Hyperledger Fabric – Reference Setup (PoC)

This folder provides reference configuration snippets to stand up a minimal Fabric test network with organizations:

- FarmersCoop
- WildCollectors
- TestingLabs
- ProcessingFacilities
- Manufacturers

Contents

- `docker-compose.yaml` – Containers for CAs, peers, orderer, CouchDB
- `configtx.yaml` – Channel configuration template
- `crypto/` – Generated identities (excluded in repo)

Quick Start (reference only)

1) Install Fabric binaries and images
2) Generate crypto material and genesis block
3) Bring up network
4) Package and install chaincode from `../chaincode`
5) Approve and commit chaincode
6) Update backend `fabricAdapter.ts` to connect with submitted user identity

Note: For full instructions, use the Fabric samples `test-network` as a base and adapt org names.


