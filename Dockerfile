# Base image
FROM node:16.13-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Set environment variables for the Postgres database connection
ENV DATABASE_HOST=localhost
ENV DATABASE_PORT=5432
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=postgres
ENV DATABASE_NAME=database_name

# Start the application
CMD ["npm", "run", "start:prod"]
