# ERP REST API

## local

1. clone this repository
2. npm install
3. npm run g:client
4. npm run mg:dev
5. run this cmd to build docker

```bash
 docker-compose -f docker-compose-local.yml up --build
```

6. run this cmd to start express server

```bash
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
