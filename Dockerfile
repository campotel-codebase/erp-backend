# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container at /usr/app
COPY build/. . 

# Generate Prisma client
RUN npx prisma generate


# Expose the port the app runs on
EXPOSE 3000

# Command to run your application
CMD ["node","src/index.js"]

