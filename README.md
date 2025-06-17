# PetWatchApp
A web application designed to streamline pet care management for pet owners. PetWatch helps users track pet health, manage appointments, monitor expenses, and store important records efficiently.

## Features
**Authentication:**
  - User registration and login.
  - Token-based authentication using JWT.

  **Pet Management:**
  - Add, view, edit, and manage pet profiles.
  - Track pet health information, including weight trends, vaccinations, and medical history.

  **Expense Tracking:**
  - Monitor pet-related expenses with categorized breakdowns.
  - View expenses over time with detailed analytics.

  **Appointment & Routine Care:**
  - Schedule and manage vet appointments, vaccinations, and routine care activities.
  - Set customizable reminders for medication, vaccinations, and other important events.

  **Emergency Guide:**
  - Access crucial information for handling pet emergencies.

## Tech Stack
### Frontend:
- Framework: React.js
- Styling: Material UI
- State Management: Redux
- Form Handling: react-hook-form
- HTTP Requests: Axios
- Routing: React Router

### Backend:
- Framework: Node.js with Express.js
- Database: MongoDB with Mongoose
- Authentication: JSON Web Token (JWT)
- Environment Management: dotenv
- API Documentation: Swagger

# Getting Started
## Prerequisites
- Ensure you have Node.js and npm installed on your machine.
- MongoDB installed locally or set up with a remote MongoDB URI.
## Installation
- Clone the repository
- Install dependencies for both client and server
- Configure environment variables:
  For the server, create a .env file in the server directory and define the following variables:
  ```
  PORT=your-port-number
  MONGO_URI=your-mongodb-connection-string
  JWT_SECRET_KEY=your-jwt-secret-key
  EMAIL=your-email
  EMAIL_KEY=your-email-key
  ```
 - Run both client and server.
   
## API Documentation
The backend API is documented using Swagger. You can explore the API using the Swagger UI.

### Accessing Swagger UI

Once the server is running, you can access the Swagger UI at the following URL:
```
http://localhost:5001/api-docs-ui
```

The client will be served at 
```
http://localhost:3000
``` 
and the server will run at 
```
http://localhost:5001
```

