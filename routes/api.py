
from flask import Blueprint, jsonify, current_app
import requests
from datetime import datetime
from models.price_data import PriceData
from db import db

api_bp = Blueprint('api', __name__)

@api_bp.route('/data', methods=['GET'])
def get_current_data():
    """Fetch current Bitcoin data from CoinGecko and save to database"""
    try:
        # CoinGecko API endpoint for Bitcoin price
        api_url = f"{current_app.config['COINGECKO_API_URL']}/simple/price"
        params = {
            'ids': 'bitcoin',
            'vs_currencies': 'usd',
            'include_market_cap': 'true',
            'include_24hr_vol': 'true',
            'include_24hr_change': 'true'
        }
        
        # Make API request
        response = requests.get(
            api_url, 
            params=params,
            timeout=current_app.config['REQUEST_TIMEOUT']
        )
        response.raise_for_status()
        
        api_data = response.json()
        current_app.logger.info(f"API Response: {api_data}")
        
        # Save to database
        price_entry = PriceData.save_price_data(api_data)
        
        # Return formatted response
        bitcoin_data = api_data.get('bitcoin', {})
        result = {
            'price': bitcoin_data.get('usd', 0),
            'market_cap': bitcoin_data.get('usd_market_cap', 0),
            'volume_24h': bitcoin_data.get('usd_24h_vol', 0),
            'price_change_24h': bitcoin_data.get('usd_24h_change', 0),
            'last_updated': price_entry.timestamp.isoformat(),
            'source': 'CoinGecko'
        }
        
        return jsonify(result)
        
    except requests.RequestException as e:
        current_app.logger.error(f"API request failed: {str(e)}")
        return jsonify({
            'error': 'Failed to fetch data from external API',
            'details': str(e)
        }), 503
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@api_bp.route('/history', methods=['GET'])
def get_history():
    """Get historical price data from database"""
    try:
        # Get recent price data (last 20 entries)
        price_data = PriceData.get_recent(limit=20)
        
        # Convert to list and reverse to get chronological order
        history = [entry.to_dict() for entry in reversed(price_data)]
        
        return jsonify(history)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching history: {str(e)}")
        return jsonify({
            'error': 'Failed to fetch historical data',
            'details': str(e)
        }), 500

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get database statistics"""
    try:
        total_records = PriceData.query.count()
        latest_record = PriceData.query.order_by(PriceData.timestamp.desc()).first()
        oldest_record = PriceData.query.order_by(PriceData.timestamp.asc()).first()
        
        stats = {
            'total_records': total_records,
            'latest_timestamp': latest_record.timestamp.isoformat() if latest_record else None,
            'oldest_timestamp': oldest_record.timestamp.isoformat() if oldest_record else None,
            'database_status': 'connected'
        }
        
        return jsonify(stats)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching stats: {str(e)}")
        return jsonify({
            'error': 'Failed to fetch statistics',
            'details': str(e)
        }), 500
