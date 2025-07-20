# NSE Scraper API 🚀

A fast, reliable, and production-ready API for scraping Nairobi Securities Exchange (NSE) stock prices with advanced caching, rate limiting, comprehensive error handling, and API documentation.

## ✨ Features

- **🔥 High Performance**: Intelligent caching system with TTL
- **🛡️ Production Ready**: Comprehensive error handling and logging
- **📊 Rate Limiting**: Prevents abuse with configurable limits
- **📚 API Documentation**: Interactive Swagger/OpenAPI documentation
- **🔍 Advanced Search**: Search stocks by ticker or company name
- **📈 Flexible Sorting**: Sort by ticker, name, price, change, or volume
- **🏥 Health Monitoring**: Built-in health check endpoint
- **🔒 Security**: Helmet.js security headers and input validation
- **📝 Comprehensive Logging**: Winston-powered logging system
- **🧪 Test Coverage**: Complete test suite with Jest

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/nse-scraper-api.git
cd nse-scraper-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. **Start the development server**
```bash
npm run dev
```

5. **Visit the API**
   - API: http://localhost:5000
   - Documentation: http://localhost:5000/api-docs
   - Health Check: http://localhost:5000/health

## 📖 API Documentation

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-api-domain.com`

### Endpoints

#### 🏠 Welcome
```http
GET /
```
Returns API information and available endpoints.

#### 📊 Get All Stocks
```http
GET /stocks?limit=10&sort=price&order=desc
```

**Query Parameters:**
- `limit` (optional): Number of results (1-1000)
- `sort` (optional): Sort field (`ticker`, `name`, `price`, `change`, `volume`)
- `order` (optional): Sort order (`asc`, `desc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ticker": "EQTY",
      "name": "Equity Group Holdings Plc",
      "volume": "1,234,567",
      "price": "45.50",
      "change": "+2.50 (+5.82%)"
    }
  ],
  "meta": {
    "total": 65,
    "cached": true,
    "lastUpdated": "2023-10-01T12:00:00.000Z"
  },
  "timestamp": "2023-10-01T12:00:00.000Z"
}
```

#### 🔍 Search Stocks
```http
GET /stocks/{searchId}?limit=5&sort=name&order=asc
```

**Path Parameters:**
- `searchId`: Search term (ticker symbol or company name)

**Query Parameters:**
- `limit` (optional): Number of results (1-1000)
- `sort` (optional): Sort field (`ticker`, `name`, `price`, `change`, `volume`)
- `order` (optional): Sort order (`asc`, `desc`)

#### 🏥 Health Check
```http
GET /health
```

Returns API health status, cache statistics, and memory usage.

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# API Configuration
API_RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
API_RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL_SECONDS=300          # 5 minutes
CACHE_CHECK_PERIOD_SECONDS=120 # 2 minutes

# External API
NSE_DATA_SOURCE_URL=https://afx.kwayisi.org/nse/

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log

# API Documentation
API_TITLE=NSE Scraper API
API_VERSION=2.0.0
API_DESCRIPTION=A fast and reliable API for scraping NSE stock prices
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## � Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

### Other Platforms

The API is containerizable and can be deployed to:
- Heroku
- AWS Lambda
- Google Cloud Functions
- DigitalOcean App Platform
- Railway
- Render

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi schema validation
- **Error Handling**: No sensitive data leakage

## � Performance Features

- **Intelligent Caching**: 5-minute TTL with background refresh
- **Request Optimization**: Axios timeout and retry logic
- **Memory Management**: Monitoring and cleanup
- **Graceful Shutdown**: Proper cleanup on termination

## 🔍 Monitoring & Logging

- **Winston Logging**: Structured JSON logs
- **Health Checks**: System status monitoring
- **Performance Metrics**: Cache hit rates, memory usage
- **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@nse-scraper-api.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/nse-scraper-api/issues)
- 📚 Documentation: http://localhost:5000/api-docs

## 🎯 Roadmap

- [ ] WebSocket real-time updates
- [ ] Database integration for historical data
- [ ] Advanced analytics endpoints
- [ ] Multi-exchange support
- [ ] GraphQL API
- [ ] Mobile SDK

---

Made with ❤️ for the NSE community
