FROM node:22

# Set the working directory in the container
WORKDIR /src/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]