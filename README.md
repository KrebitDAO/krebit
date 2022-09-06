## Notes

- build image with: docker build . -f Dockerfile -t krb-api --no-cache \
  --build-arg SERVER_PORT=4000 \
  --build-arg SERVER_EXPIRES_YEARS=3 \
  --build-arg SERVER_TRUST=100 \
  --build-arg SERVER_STAKE=1 \
  --build-arg SERVER_PRICE=0 \
  --build-arg SERVER_CERAMIC_URL="https://ceramic-clay.3boxlabs.com" \
  --build-arg SERVER_NETWORK=rinkeby \
  --build-arg SERVER_ETHEREUM_SEED=""
- Run: docker run -p 4000:4000 -d krb-api
