FROM node:20-alpine

WORKDIR /app

# Install deps with reproducible installs
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# App port
ENV PORT=3000
EXPOSE 3000

# Run as non-root
USER node

CMD ["node", "server.js"]