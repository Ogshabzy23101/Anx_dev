# Networking Labs

Purpose: practice Docker bridge networks, service discovery, DNS, published ports, and container communication failures.

Sample tasks:

1. List Docker networks.
2. Inspect the default bridge network.
3. Create a user-defined bridge network.
4. Run two containers on the same network.
5. Explain the network mismatch in Compose.
6. Diagnose DNS failure between frontend and backend.
7. Test a TCP port from a debug container.
8. Compare container ports and host ports.

Suggested commands: `docker network ls`, `docker network inspect`, `docker network create`, `docker run --network`, `docker exec getent hosts`, `nc`.

Expected outcome: you should be able to explain and debug Docker network boundaries.
