# Dockerfile
FROM node:18

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build NestJS
RUN pnpm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
