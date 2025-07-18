# Ratelimiter API

A robust, extensible API for rate limiting, supporting multiple algorithms and flexible configuration. Built with Express, TypeScript, and Redis

## Features
- **Multiple Rate Limiting Algorithms:**
  - Fixed Window (implemented)
  - Sliding Window, Token Bucket, Leaky Bucket, Sliding Log (placeholders for future support)
- **API Versioning:** `/api/v1` and `/api/v2`
- **Customizable Limits:** Override limits and windows via request headers
- **Redis-backed storage** for distributed rate limiting
- **Swagger/OpenAPI documentation**
- **Dockerized** for easy deployment

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Redis

### Environment Variables
Create a `.env` file in the root directory with the following variables (see `src/config/env.ts` for all options):

or simply run

```bash
cp .env.sample .env
```

### Local Development
```bash
npm install
npm run dev
```
The server will start on the port specified in your `.env` (default: 5000).

### Production Build
```bash
npm run build
npm start
```

### Docker
To run with Docker Compose (includes Redis):
```bash
docker-compose up --build
```

## API Documentation
- **Swagger UI:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Swagger JSON:** [http://localhost:5000/swagger.json](http://localhost:5000/swagger.json)

## Example Usage

### Fixed Window Counter (v2)
`POST /api/v2/counter/fixed-window`

**Optional Headers:**
- `x-ratelimit-limit`: `ADMIN`, `BURSTY`, `NORMAL`, `PREMIUM`, `STRICT`
- `x-ratelimit-window`: `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `YEAR`
- `x-client-id`: Custom client identifier

**Response Headers:**
- `x-ratelimit-limit`: Maximum requests allowed
- `x-ratelimit-remaining`: Requests remaining
- `x-ratelimit-reset`: Seconds until reset

**Response Body:**
```json
{
  "access": "granted"
}
```

If the limit is exceeded:
```json
{
  "message": "You're reach your limit, please try again later."
}
```

### List Available Algorithms (v2)
`GET /api/v2/counter/fixed-window`

## Testing
```bash
npm run test         # Run all tests
npm run test:e2e     # Run end-to-end tests
```
