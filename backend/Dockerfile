# =====================================================
# Dockerfile for OCMS Backend (Node.js + Express)
# Deployed on Render.com as a Web Service
# =====================================================

# Use official lightweight Node.js 20 image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy all backend source files
COPY . .

# Create uploads directory (needed at runtime for image uploads)
RUN mkdir -p uploads data

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
