# Step 1: Build React app
FROM node:20 AS build
WORKDIR /app

# Copy React app
COPY client ./client
WORKDIR /app/client

# Install and build React app
RUN npm install
RUN npm run build

# Step 2: Prepare server
FROM node:20 AS server
WORKDIR /app

# Copy server code
COPY server ./server

# Copy React build to server public folder
COPY --from=build /app/client/build ./server/build

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Expose server port (change if needed)
EXPOSE 8080

# Start your server (update this if your entry point isn't index.js)
CMD ["node", "index.js"]