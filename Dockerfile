# 1. Build React frontend
FROM node:18 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# 2. Build backend and copy in frontend build
FROM node:18 AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
# Copy static assets from client
COPY --from=client-build /app/client/build ./public

# 3. Final runtime image
FROM node:18-alpine
WORKDIR /app
COPY --from=server-build /app/server ./
EXPOSE 8080
CMD ["npm", "start"]
