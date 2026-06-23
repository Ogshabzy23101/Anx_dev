# Exposed Secret Example

`dockerfiles/insecure.Dockerfile` contains:

```dockerfile
ENV API_TOKEN=plaintext-demo-token
```

This value can appear in image history and should be passed at runtime through a safer secret mechanism.
