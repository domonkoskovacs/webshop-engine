FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG VITE_BACKEND_URL
ARG VITE_USER_DEMO_MODE
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_USER_DEMO_MODE=$VITE_USER_DEMO_MODE
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
