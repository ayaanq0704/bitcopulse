
# Bitcoin Analytics Backend

A Flask-based REST API that fetches real-time Bitcoin price data from CoinGecko and stores it in a database.

## Features

- Real-time Bitcoin price fetching from CoinGecko API
- PostgreSQL/SQLite database storage with timestamps
- RESTful API endpoints
- CORS enabled for frontend integration
- Modular project structure
- Error handling and logging

## API Endpoints

- `GET /api/data` - Fetch current Bitcoin price data
- `GET /api/history` - Get last 20 historical data points
- `GET /api/stats` - Database statistics
- `GET /` - Health check

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   - For SQLite (development): No additional setup needed
   - For PostgreSQL (production): Create database and update DATABASE_URL

4. **Run the Application**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## Project Structure

```
backend/
├── app.py              # Application factory and entry point
├── config.py           # Configuration management
├── db.py              # Database initialization
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
├── models/
│   ├── __init__.py
│   └── price_data.py  # Database models
└── routes/
    ├── __init__.py
    └── api.py         # API routes
```

## Database Schema

**PriceData Table:**
- `id` - Primary key
- `timestamp` - Record creation time
- `price` - Bitcoin price in USD
- `market_cap` - Market capitalization
- `volume_24h` - 24-hour trading volume
- `price_change_24h` - 24-hour price change percentage
- `raw_data` - Full API response (JSON)

## Error Handling

The API includes comprehensive error handling for:
- External API failures
- Database connection issues
- Invalid requests
- Network timeouts

All errors return appropriate HTTP status codes and error messages.
