FROM node:14 AS development

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3005
CMD ["npm", "run", "start"]