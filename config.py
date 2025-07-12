
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///bitcoin_data.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # API configuration
    COINGECKO_API_URL = os.environ.get('COINGECKO_API_URL') or 'https://api.coingecko.com/api/v3'
    
    # Request timeout
    REQUEST_TIMEOUT = 30
