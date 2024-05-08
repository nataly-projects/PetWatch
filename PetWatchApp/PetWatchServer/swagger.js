const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'PetWatch API',
        version: '1.0.0',
        description: 'API documentation for PetWatch CRUD operations',
        },
        servers: [{ url: `http://localhost:5001/api` }],
        securityDefinitions: {
        jwtAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter JWT token with prefix "Bearer "',
            },
        },
    },
  apis: ['./src/controllers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    // Serve Swagger JSON document
    app.get('/api-docs', (req, res) => {
      // Disable caching for Swagger JSON
      res.setHeader('Cache-Control', 'no-store');
      // Set Content-Type header to application/json
      res.setHeader('Content-Type', 'application/json');
      // Send the Swagger JSON document
      res.send(swaggerSpec);
    });

    // Serve Swagger UI
    app.use('/api-docs-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

