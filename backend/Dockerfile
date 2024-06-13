FROM node:14 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:14

WORKDIR /app
COPY --from=build /app .
ENV NODE_ENV production
EXPOSE 3002
CMD ["npm", "start"]
