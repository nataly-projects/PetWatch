# PetWatchApp
PetWatchApp is a web application that helps pet owners keep track of their pets' health, activities, and expenses.

## Features
- Dashboard displaying important information such as the number of pets, user expenses, and pet activity log.
- Ability to add and manage pets, including tracking their age, weight, and other information.
- Expense tracking feature to monitor pet-related expenses.
- Emergency guide section providing important information on handling pet emergencies.
- User authentication and account management functionalities.

# Technologies Used
## Client-Side
- React.js: JavaScript library for building user interfaces.
- React Router: For routing and navigation within the application
- Redux: State management library for managing application state.
- Axios: Promise-based HTTP client for making requests to the server.
## Server-Side
- Node.js: JavaScript runtime environment.
- Express.js: Web framework for Node.js.
- MongoDB: NoSQL database management system.
- Mongoose: MongoDB object modeling tool.
- JSON Web Tokens (JWT): Implementation of JSON Web Tokens for user authentication.

# Getting Started
## Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed and running locally or configured remote MongoDB URL.
## Installation
- Clone the repository
- Install dependencies for both client and server
- Configure environment variables:
  For the server, create a .env file in the server directory and define the following variables:
  - PORT=your-port-number
  - MONGO_USERNAME=your-mongo-username
  - MONGO_PASSWORD=your-mongo-password
  - JWT_SECRET_KEY=your-jwt-secret-key

The client will be served at http://localhost:3000 and the server will run at http://localhost:5001.

