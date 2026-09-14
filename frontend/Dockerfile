FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM alpine:3.20 AS production

WORKDIR /app

COPY --from=builder /app/dist /dist

CMD ["sh", "-c", "cp -r /dist/. /app/dist/"]