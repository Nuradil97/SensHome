# SensHome
Trying to catch burglars &amp; motinor temp&amp;humidity

## Features
- Real-time motion detection and alerts.
- Dynamic dashboard displaying temperature, humidity, battery status, and motion detection.
- Configurable alert toggle to enable/disable email notifications.

## Files Included
- **public/index.html**: The frontend interface.
- **public/script.js**: Client-side JavaScript to fetch and display sensor data.
- **server.js**: Backend server to handle sensor data, manage alert state, and send email notifications.

## Prerequisites
- **Node.js**: Ensure Node.js is installed on your system.
- **Email Configuration**: Have credentials for an SMTP server (e.g., gmail).

## Installation
- Install all dependencies (RUN npm install express body-parser nodemailer dotenv)
- node server.js
- Optional: use Docker
  -- Create Dockerfile
  -- Add a .dockerignore File
  -- Build the Docker Image
  -- Run the Docker Container
