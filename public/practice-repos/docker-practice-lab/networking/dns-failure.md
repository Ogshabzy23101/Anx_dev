# DNS Failure Example

Symptom:

```text
wget: bad address 'backend'
```

Likely causes:

- Containers are on different Docker networks.
- The target service name is wrong.
- Compose project names changed the network name.
