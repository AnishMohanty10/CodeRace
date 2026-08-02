FROM ubuntu:22.04

# Avoid prompts during apt installs
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js, Python, G++, and Java
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    g++ \
    default-jdk \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vite frontend
RUN npm run build

# Expose the port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]
