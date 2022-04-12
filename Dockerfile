FROM node:latest

#Create app directory
WORKDIR /app

#Copy all files into the container
COPY . .

#Install dependencies
RUN npm install

#Open appropriate port
EXPOSE 3000

#Start application
CMD ["node", "server.js"]
