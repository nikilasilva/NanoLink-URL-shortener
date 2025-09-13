FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build Next.js app (with Turbopack)
RUN npm run build

# Run with lighweight Node image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Next.js telemetry can be disabled
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]