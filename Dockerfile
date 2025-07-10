# Use Node.js 22 with Alpine for small image size
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies (only prod)
COPY package*.json ./
RUN npm install --production

# Copy rest of the application
COPY . .

# Build TypeScript project
RUN npm run build

# Expose app port
EXPOSE 8000

# Start server
CMD ["npm", "start"]
