const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.docs.title,
      version: config.docs.version,
      description: config.docs.description,
      contact: {
        name: 'API Support',
        email: 'support@nse-scraper-api.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url:
          config.server.env === 'production'
            ? 'https://your-api-domain.com'
            : `http://localhost:${config.server.port}`,
        description:
          config.server.env === 'production'
            ? 'Production server'
            : 'Development server'
      }
    ],
    components: {
      schemas: {
        Stock: {
          type: 'object',
          properties: {
            ticker: {
              type: 'string',
              description: 'Stock ticker symbol',
              example: 'EQTY'
            },
            name: {
              type: 'string',
              description: 'Company name',
              example: 'Equity Group Holdings Plc'
            },
            volume: {
              type: 'string',
              description: 'Trading volume',
              example: '1,234,567'
            },
            price: {
              type: 'string',
              description: 'Current stock price',
              example: '45.50'
            },
            change: {
              type: 'string',
              description: 'Price change',
              example: '+2.50 (+5.82%)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error type',
              example: 'Validation Error'
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Search ID is required'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
              example: '2023-10-01T12:00:00.000Z'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Stock'
              }
            },
            meta: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total number of stocks',
                  example: 65
                },
                cached: {
                  type: 'boolean',
                  description: 'Whether data was served from cache',
                  example: true
                },
                lastUpdated: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Last data update timestamp',
                  example: '2023-10-01T12:00:00.000Z'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp',
              example: '2023-10-01T12:00:00.000Z'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controller/*.js'] // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
