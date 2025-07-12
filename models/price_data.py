
from datetime import datetime
from db import db

class PriceData(db.Model):
    __tablename__ = 'price_data'
    
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    price = db.Column(db.Float, nullable=False)
    market_cap = db.Column(db.BigInteger, nullable=True)
    volume_24h = db.Column(db.BigInteger, nullable=True)
    price_change_24h = db.Column(db.Float, nullable=True)
    raw_data = db.Column(db.JSON, nullable=True)  # Store full API response
    
    def __repr__(self):
        return f'<PriceData {self.timestamp}: ${self.price}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'price': self.price,
            'market_cap': self.market_cap,
            'volume_24h': self.volume_24h,
            'price_change_24h': self.price_change_24h
        }
    
    @classmethod
    def get_recent(cls, limit=20):
        """Get recent price data points"""
        return cls.query.order_by(cls.timestamp.desc()).limit(limit).all()
    
    @classmethod
    def save_price_data(cls, api_response):
        """Save price data from API response"""
        try:
            bitcoin_data = api_response.get('bitcoin', {})
            
            price_entry = cls(
                price=bitcoin_data.get('usd', 0),
                market_cap=bitcoin_data.get('usd_market_cap', 0),
                volume_24h=bitcoin_data.get('usd_24h_vol', 0),
                price_change_24h=bitcoin_data.get('usd_24h_change', 0),
                raw_data=api_response
            )
            
            db.session.add(price_entry)
            db.session.commit()
            return price_entry
        except Exception as e:
            db.session.rollback()
            raise e
