# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies (production only if needed)
RUN npm install

# Copy all source code
COPY . .

# Create uploads directory and give permissions to 'node' user
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Expose app port
ENV PORT=3000
EXPOSE 3000

# Use non-root user (built-in node user)
USER node

# Run the app
CMD ["node", "server.js"]
