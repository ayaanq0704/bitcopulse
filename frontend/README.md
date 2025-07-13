
# Bitcoin Analytics Dashboard

A full-stack real-time cryptocurrency analytics dashboard built with React (frontend) and Flask (backend).

## 🚀 Features

**Frontend (React)**
- Real-time Bitcoin price display
- Interactive price history charts
- Auto-refresh every 30 seconds
- Responsive modern UI with Tailwind CSS
- Market cap and volume metrics
- Beautiful gradient design

**Backend (Flask)**
- REST API with CoinGecko integration
- PostgreSQL/SQLite data persistence
- Real-time data fetching and logging
- CORS-enabled endpoints
- Modular architecture

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Recharts for data visualization
- Axios for HTTP requests
- Lucide React icons

**Backend:**
- Flask + SQLAlchemy
- PostgreSQL/SQLite database
- CoinGecko API integration
- Flask-CORS for cross-origin requests
- Python-dotenv for configuration

## 📦 Installation & Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

5. **Run the Flask server**
   ```bash
   python app.py
   ```

Backend will be available at `http://localhost:5000`

### Frontend Setup

The frontend is already configured in this React project. Just run:

```bash
npm install
npm run dev
```

Frontend will be available at `http://localhost:8080`

## 🔌 API Endpoints

- `GET /api/data` - Current Bitcoin price data
- `GET /api/history` - Historical price data (last 20 points)
- `GET /api/stats` - Database statistics
- `GET /` - Health check

## 📊 Dashboard Features

1. **Real-time Price Card** - Current Bitcoin price with 24h change
2. **Market Metrics** - Market cap and trading volume
3. **Price Chart** - Interactive line chart with historical data
4. **Auto-refresh** - Updates every 30 seconds automatically
5. **Manual Refresh** - Refresh button for immediate updates

## 🗄️ Database Schema

The application stores Bitcoin price data with:
- Timestamp
- Price (USD)
- Market capitalization
- 24-hour trading volume
- Price change percentage
- Raw API response (JSON)

## 🔧 Configuration

**Backend (.env)**
```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///bitcoin_data.db
COINGECKO_API_URL=https://api.coingecko.com/api/v3
PORT=5000
```

## 🚀 Deployment

**Backend:**
- Can be deployed to Heroku, Railway, or any Python hosting service
- Configure PostgreSQL for production
- Set environment variables

**Frontend:**
- Built-in Vite build process
- Can be deployed to Vercel, Netlify, or any static hosting

## 📈 Data Source

Price data is fetched from the [CoinGecko API](https://www.coingecko.com/en/api), which provides:
- Real-time cryptocurrency prices
- Market capitalization data
- Trading volume information
- Price change percentages

## 🎨 UI/UX Features

- **Gradient Backgrounds** - Beautiful orange/amber gradients
- **Glass Morphism** - Semi-transparent cards with backdrop blur
- **Responsive Design** - Works on all device sizes
- **Loading States** - Smooth loading animations
- **Interactive Charts** - Hover tooltips and animations
- **Status Indicators** - Real-time update timestamps

## 🔒 CORS Configuration

The Flask backend is configured to accept requests from:
- `http://localhost:3000` (React dev server)
- `http://localhost:8080` (Vite dev server)

## 📝 Notes

- The application uses SQLite by default for easy setup
- For production, switch to PostgreSQL
- CoinGecko API has rate limits (check their documentation)
- Data is automatically cleaned up (keeps last 20 records for charts)

Enjoy your real-time Bitcoin analytics dashboard! 🚀₿
