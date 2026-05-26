# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set environment variable to ensure production build
ENV NODE_ENV=production

# Increase Node memory limit to prevent out-of-memory errors during Vite build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Pass in any VITE_ variables needed for the build (optional, usually handled by .env)
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

# Build the app for production
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
# Note: Vite outputs to 'dist' by default.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Healthcheck to verify nginx server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
