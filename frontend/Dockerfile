FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_ML_API_BASE_URL
ARG VITE_DEMO_USER_ID

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ML_API_BASE_URL=$VITE_ML_API_BASE_URL
ENV VITE_DEMO_USER_ID=$VITE_DEMO_USER_ID

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]