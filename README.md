# PetWatchApp
PetWatch is a web application designed to streamline pet care management for pet owners. With intuitive features tailored for pet health tracking, appointment scheduling, expense management,
monitoring vaccination records, tracking routine care activities, or accessing informative guides on pet care, PetWatch offers a comprehensive solution for pet owners.

## Features
- Pet Owner Dashboard: Access a comprehensive dashboard displaying all data related to your pet's care and well-being. View detailed logs of your pet's activities, track and manage all pet-related expenses, stay informed about upcoming important events, and keep organized notes and reminders for your pets.
- Individual Pet Dashboard: Dive into detailed analytics specific to each pet, including expense breakdowns, weight tracking trends, and health information. Monitor your pet's expenses over time, categorizing them by type and month. Keep track of your pet's weight fluctuations over time, enabling you to monitor their health and identify any concerning trends. Store and access essential health information for each pet, including vaccination records, medical history, allergies, and current medications. Easily add new activities and events to your pet's schedule, such as vet appointments, vaccination records, routine care activities, and additional expenses.
- Pet Management: Ability to add and manage pets, including tracking their age, weight, health information, vaccination record, routine care, expenses, and other information.
- Customizable Notifications: Set personalized notifications for various events such as medication reminders, upcoming appointments, and important milestones in your pet's life.
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

