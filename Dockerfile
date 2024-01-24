# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory
# ! if lock file is included it will not install node_modules
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the build artifacts
COPY build/. . 
COPY .env .env
COPY prisma/schema.prisma schema.prisma
COPY mjml/ mjml/
COPY public/ public/


# Generate Prisma client
RUN npx prisma generate


# Expose the port the app runs on
EXPOSE $EXPRESS_PORT

# Command to run your application
CMD ["node","src/index.js"]