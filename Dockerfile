# Dockerfile
# ─── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Install only prod deps (including @google-cloud/datastore)
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy your API server + static build
COPY server.js ./
# COPY dist ./dist
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]


# # 1) build your React app
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package.json package-lock.json* ./
# RUN npm ci
# COPY . .
# RUN npm run build

# # 2) run-time image: Node.js + Express
# FROM node:20-alpine
# WORKDIR /app
# # only need production deps + your server
# COPY package.json package-lock.json* ./
# RUN npm ci --production

# # copy compiled frontend + your server entrypoint
# COPY --from=builder /app/dist ./dist
# COPY server.js ./

# # Cloud Run listens on $PORT
# EXPOSE 8080
# CMD ["node", "server.js"]


# # # Dockerfile
# # FROM node:20-alpine as build
# # WORKDIR /app
# # COPY package.json package-lock.json* ./
# # RUN npm install
# # COPY . .
# # RUN npm run build

# # FROM nginx:alpine
# # COPY --from=build /app/dist /usr/share/nginx/html
# # COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# # EXPOSE 80
# # CMD ["nginx", "-g", "daemon off;"]
