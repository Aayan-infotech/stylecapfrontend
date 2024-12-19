# Step 1: Use Node.js to build the React app
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the source files
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the app with Node.js
FROM node:18

# Set the working directory for the production container
WORKDIR /app

# Copy the build files from the builder stage
COPY --from=builder /app/build /app/build

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Expose port 8256
EXPOSE 8256

# Start the server
CMD ["serve", "-s", "build", "-l", "8256"]
