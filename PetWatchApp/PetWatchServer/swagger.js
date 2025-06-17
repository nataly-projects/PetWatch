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
  apis: ['./src/controllers/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.get('/api-docs', (req, res) => {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    app.use('/api-docs-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

