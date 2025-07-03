FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install --only=production

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start:prod"]