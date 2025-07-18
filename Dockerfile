FROM node:22-alpine AS builder

RUN apk add --no-cache --virtual .build-deps python3 make g++

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install --frozen-lockfile --production=false

COPY . .
RUN npm run build

RUN npm prune --production

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

EXPOSE 5000
CMD ["node", "build/index.js"]
