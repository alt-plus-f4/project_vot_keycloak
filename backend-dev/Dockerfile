FROM node:14 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:14

WORKDIR /app
COPY --from=build /app .
ENV NODE_ENV development
EXPOSE 3010
CMD ["npm", "start"]
