const Joi = require('joi');

const schemas = {
  searchStock: Joi.object({
    searchId: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s-_.]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Search ID can only contain letters, numbers, spaces, hyphens, underscores, and dots',
        'string.min': 'Search ID must be at least 1 character long',
        'string.max': 'Search ID cannot be more than 50 characters long'
      })
  }),

  stockData: Joi.object({
    ticker: Joi.string().required(),
    name: Joi.string().required(),
    volume: Joi.string().required(),
    price: Joi.string().required(),
    change: Joi.string().required()
  }),

  queryParams: Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .optional()
      .messages({
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot be more than 1000'
      }),
    
    sort: Joi.string()
      .valid('ticker', 'name', 'price', 'change', 'volume')
      .optional()
      .messages({
        'any.only': 'Sort field must be one of: ticker, name, price, change, volume'
      }),
    
    order: Joi.string()
      .valid('asc', 'desc')
      .optional()
      .messages({
        'any.only': 'Order must be either asc or desc'
      })
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message,
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message,
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
};

module.exports = {
  schemas,
  validate,
  validateQuery
};
