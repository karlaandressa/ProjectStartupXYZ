
FROM node:20-slim AS builder

WORKDIR /app

# Install build tools required for native modules, then install deps
RUN apt-get update && \
	apt-get install -y build-essential python3 ca-certificates --no-install-recommends && \
	rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
# Ensure native modules can be built if necessary
ENV npm_config_build_from_source=true
RUN npm install

# Copy project files and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
