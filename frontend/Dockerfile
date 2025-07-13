# Use the official Node.js 18 image as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache for npm install
COPY package*.json ./

RUN npm install -g @angular/cli

# Install dependencies (this will create a node_modules directory in the container)
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose port 4200, which is the default port for Angular's development server
EXPOSE 4200

# Set environment variable to enable file-watching on Docker (required for live-reloading)
ENV CHOKIDAR_USEPOLLING=true

# Start the Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0"]
