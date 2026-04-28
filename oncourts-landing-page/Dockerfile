
# Use the official Node.js image as the base image
FROM node:20-alpine

# Set environment variables
# ENV ONCOURTS_API_ENDPOINT=https://oncourts.kerala.gov.in
# ENV ONCOURTS_CITIZEN_APP_ENDPOINT=https://oncourts.kerala.gov.in/ui/citizen/login
# ENV ONCOURTS_EMPLOYEE_APP_ENDPOINT=https://oncourts.kerala.gov.in/ui/employee/login
ARG NEXT_PUBLIC_ONCOURTS_API_ENDPOINT

ENV NEXT_PUBLIC_ONCOURTS_API_ENDPOINT=${NEXT_PUBLIC_ONCOURTS_API_ENDPOINT}

ARG NEXT_PUBLIC_GLOBAL

ENV NEXT_PUBLIC_GLOBAL=${NEXT_PUBLIC_GLOBAL}
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install 
# Copy the rest of your application code
COPY . .
# Build the Next.js application
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
