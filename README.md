# ERP REST API

## local

1. Run this for local development

```bash
docker-compose -f docker-compose-local.yml up --build
npm run start

```

## production

1. Run this for Docker deployment

```bash
npm run build
docker-compose build
docker-compose up

```

2. Declare env and assets
3. build docker container

```bash
docker-compose build
docker-compose up

```
