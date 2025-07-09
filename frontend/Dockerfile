FROM node:18-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

ARG INTERNAL_BACKEND_URL
ENV INTERNAL_BACKEND_URL=$INTERNAL_BACKEND_URL

ARG NEXT_PUBLIC_TIMEOUT_REDIRECT
ENV NEXT_PUBLIC_TIMEOUT_REDIRECT=$NEXT_PUBLIC_TIMEOUT_REDIRECT

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else npm ci; \
  fi

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]

