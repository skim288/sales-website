# 1. Build stage: install all deps and prune dev
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install            # installs both deps & devDeps
COPY . .
RUN npm prune --production # remove devDeps (including jest)

# 2. Runtime stage: only prod deps + source
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8080
# Use `node` in prod instead of nodemon
CMD ["node", "server.js"]
