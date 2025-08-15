import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NFT Book Platform API',
      version: '1.0.0',
      description: 'API documentation for the NFT Book Platform - A platform with blockchain integration',
      contact: {
        name: 'API Support',
        email: 'support@nftbookplatform.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api-v1',
        description: 'Development server'
      },
      {
        url: 'https://api.nftbookplatform.com/api-v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/components/**/*.swagger.js',
    './src/components/**/*.routes.js',
    './src/components/**/*.controllers.js'
  ]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi }; 