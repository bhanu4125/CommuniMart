# CommuniMart Architecture Blueprint

## System Overview
CommuniMart operates on a modular, high-trust architecture designed specifically for gated residential societies.

```
[Resident Browser / Mobile] ──(HTTPS & WSS)──> [Express 5 API & Socket Server]
                                                        │
                      ┌─────────────────────────────────┼──────────────────────────────┐
                      ▼                                 ▼                              ▼
              [Auth & RBAC]                    [Catalog & Orders]             [Socket.io Chat]
                      │                                 │                              │
                      └─────────────────────────────────┼──────────────────────────────┘
                                                        ▼
                                            [MongoDB Replica / Mongoose]
```

## Core Design Principles
1. **Physical Vicinity First**: Every transaction happens within the boundary of the society walls.
2. **Door Privacy by Default**: Exact flat numbers can be shielded until an exchange is confirmed.
3. **Zero Commission**: Direct neighbor-to-neighbor UPI or cash handover with no middleman cut.
