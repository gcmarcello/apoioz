# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.8.0
FROM node:${NODE_VERSION}-slim as base

    LABEL fly_launch_runtime="NestJS/Prisma"

    WORKDIR /app

    ENV NODE_ENV="production"

    RUN apt-get update -y && apt install -y openssl

    ARG PNPM_VERSION=8.8.0
    RUN npm install -g pnpm@$PNPM_VERSION

    FROM base as build

    COPY --link package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile --prod=false

    COPY --link prisma .
    RUN npx prisma generate

    COPY --link . .

    RUN pnpm run build

FROM base

    RUN apt-get update -y && apt install -y openssl gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1   libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates  fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

    COPY --from=build /app /app

    EXPOSE 8080

    CMD ["sh", "-c", "npx prisma migrate deploy && pnpm pm2 start dist/main.js --max-memory-restart 200M --node-args='--max-old-space-size=256'     --attach"]
