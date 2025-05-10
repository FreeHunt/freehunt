# Use the official Node.js image as the base image
FROM node:22-alpine

ARG AUTHENTIK_URL
ARG FRONTEND_URL
ARG MINIO_URL
ARG MINIO_ACCESS_KEY
ARG MINIO_SECRET_KEY

ENV AUTHENTIK_URL=${AUTHENTIK_URL}
ENV FRONTEND_URL=${FRONTEND_URL}
ENV MINIO_URL=${MINIO_URL}
ENV MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
ENV MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
ENV PORT=3000

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json* ./

# Install the application dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Generate the binary for linux-musl during the build
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build the NestJS application
RUN npm run build

# Make the start script executable
RUN chmod +x start.sh

# Set the environment variable to force Prisma to use the musl binary
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

# Expose the application port
EXPOSE 3000

# Run migrations and start the application
CMD ["./start.sh"]
