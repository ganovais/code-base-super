FROM node:22-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start:prod"]
