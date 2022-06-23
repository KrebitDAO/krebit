## Notes

- issue for npm or other packages: https://github.com/vercel/turborepo/issues/534
- inspiration for dockerfile https://github.com/vercel/turborepo/issues/215#issuecomment-1027058056
- build image with: docker build . -f Dockerfile -t krb-node --build-arg SCOPE=node --no-cache
- Run: docker run --env-file .env krb-node
