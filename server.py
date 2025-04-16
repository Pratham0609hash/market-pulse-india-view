
from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import numpy as np
import os
import json
from datetime import datetime, timedelta
import random

app = Flask(__name__, static_folder='.', static_url_path='')

# Mock stock data
STOCK_INFO = {
    'RELIANCE': {
        'name': 'Reliance Industries Ltd.',
        'currentPrice': 2550.75,
        'change': 45.25,
        'changePercent': 1.8,
        'open': 2505.50,
        'high': 2570.25,
        'low': 2490.00,
        'volume': 7865432,
        'marketCap': '₹17.2T',
        'pe': 28.4,
        'dividend': 2.5,
    },
    'TCS': {
        'name': 'Tata Consultancy Services Ltd.',
        'currentPrice': 3450.20,
        'change': -12.35,
        'changePercent': -0.36,
        'open': 3462.55,
        'high': 3478.90,
        'low': 3442.10,
        'volume': 2345678,
        'marketCap': '₹12.6T',
        'pe': 32.1,
        'dividend': 3.2,
    },
    'INFY': {
        'name': 'Infosys Ltd.',
        'currentPrice': 1456.10,
        'change': -3.45,
        'changePercent': -0.24,
        'open': 1459.55,
        'high': 1467.20,
        'low': 1451.85,
        'volume': 3210987,
        'marketCap': '₹6.1T',
        'pe': 24.6,
        'dividend': 2.8,
    },
    'HDFCBANK': {
        'name': 'HDFC Bank Ltd.',
        'currentPrice': 1623.50,
        'change': 12.75,
        'changePercent': 0.79,
        'open': 1610.75,
        'high': 1625.90,
        'low': 1608.25,
        'volume': 4532109,
        'marketCap': '₹9.3T',
        'pe': 22.8,
        'dividend': 1.8,
    },
    'SBIN': {
        'name': 'State Bank of India',
        'currentPrice': 527.80,
        'change': 3.25,
        'changePercent': 0.62,
        'open': 524.55,
        'high': 530.10,
        'low': 523.45,
        'volume': 9876543,
        'marketCap': '₹4.7T',
        'pe': 9.7,
        'dividend': 3.5,
    }
}

# Generate mock historical data
def generate_mock_data(symbol, timeframe):
    """Generate mock historical data for a given stock symbol and timeframe"""
    
    # Get base price from stock info
    if symbol in STOCK_INFO:
        base_price = STOCK_INFO[symbol]['currentPrice']
    else:
        base_price = 1500 + random.random() * 1000
    
    # Set parameters based on timeframe
    timeframe_params = {
        '1d': {'days': 1, 'interval': '5m', 'volatility': 0.01},
        '1w': {'days': 7, 'interval': '15m', 'volatility': 0.015},
        '1mo': {'days': 30, 'interval': '1d', 'volatility': 0.02},
        '3mo': {'days': 90, 'interval': '1d', 'volatility': 0.03},
        '6mo': {'days': 180, 'interval': '1d', 'volatility': 0.04},
        '1y': {'days': 365, 'interval': '1d', 'volatility': 0.06},
        '5y': {'days': 365 * 5, 'interval': '1wk', 'volatility': 0.08}
    }
    
    if timeframe not in timeframe_params:
        timeframe = '1mo'  # Default
    
    days = timeframe_params[timeframe]['days']
    volatility = timeframe_params[timeframe]['volatility']
    
    # Generate dates
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    if timeframe == '1d':
        # For intraday, generate data at 5-minute intervals
        date_range = pd.date_range(start=start_date, end=end_date, freq='5min')
    elif timeframe == '1w':
        # For 1 week, generate data at 15-minute intervals
        date_range = pd.date_range(start=start_date, end=end_date, freq='15min')
    elif timeframe in ['1mo', '3mo', '6mo', '1y']:
        # For monthly to yearly, generate daily data
        date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    else:
        # For multi-year, generate weekly data
        date_range = pd.date_range(start=start_date, end=end_date, freq='W')
    
    # Only keep dates during trading hours (9:15 AM to 3:30 PM, weekdays)
    if timeframe in ['1d', '1w']:
        date_range = [d for d in date_range if 
                     d.weekday() < 5 and  # Monday to Friday
                     ((d.hour > 9 or (d.hour == 9 and d.minute >= 15)) and
                      (d.hour < 15 or (d.hour == 15 and d.minute <= 30)))]
    else:
        # For daily data and above, only keep weekdays
        date_range = [d for d in date_range if d.weekday() < 5]
    
    # Generate price data
    price_data = []
    current_price = base_price
    
    for i, date in enumerate(date_range):
        # Generate random price movements
        change = (random.random() - 0.5) * volatility * current_price
        current_price = max(current_price + change, 1)
        
        # Daily range
        open_price = current_price - (random.random() * volatility * current_price * 0.5)
        high_price = max(open_price, current_price) + (random.random() * volatility * current_price * 0.2)
        low_price = min(open_price, current_price) - (random.random() * volatility * current_price * 0.2)
        close_price = current_price
        
        # Volume (higher on volatile days)
        volume_base = 1000000 + random.random() * 9000000
        volume_multiplier = 1 + abs(change / current_price) * 10
        volume = int(volume_base * volume_multiplier)
        
        # Format date based on timeframe
        if timeframe == '1d':
            date_str = date.strftime('%I:%M %p')
        elif timeframe == '1w':
            date_str = date.strftime('%a, %I:%M %p')
        else:
            date_str = date.strftime('%d %b')
        
        price_data.append({
            'date': date_str,
            'price': round(current_price, 2),
            'open': round(open_price, 2),
            'high': round(high_price, 2),
            'low': round(low_price, 2),
            'close': round(close_price, 2),
            'volume': volume
        })
    
    return price_data

# API Routes
@app.route('/api/stock/<symbol>')
def get_stock_info(symbol):
    """Get basic information about a stock"""
    if symbol in STOCK_INFO:
        return jsonify(STOCK_INFO[symbol])
    else:
        # Generate random stock info
        info = {
            'name': f'{symbol} Stock',
            'currentPrice': round(1500 + random.random() * 1000, 2),
            'change': round((random.random() - 0.5) * 50, 2),
            'changePercent': round((random.random() - 0.5) * 4, 2),
            'open': round(1500 + random.random() * 1000, 2),
            'high': round(1550 + random.random() * 1000, 2),
            'low': round(1450 + random.random() * 1000, 2),
            'volume': int(1000000 + random.random() * 10000000),
            'marketCap': f'₹{round(random.random() * 10, 1)}T',
            'pe': round(15 + random.random() * 25, 2),
            'dividend': round(random.random() * 4, 2),
        }
        return jsonify(info)

@app.route('/api/historical/<symbol>')
def get_historical_data(symbol):
    """Get historical price data for a stock"""
    timeframe = request.args.get('timeframe', '1mo')
    data = generate_mock_data(symbol, timeframe)
    return jsonify(data)

@app.route('/api/search')
def search_stocks():
    """Search for stocks by name or symbol"""
    query = request.args.get('q', '').upper()
    results = []
    
    # Sample list of Indian stocks
    stocks = [
        {'symbol': 'RELIANCE', 'name': 'Reliance Industries Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'TCS', 'name': 'Tata Consultancy Services Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'HDFCBANK', 'name': 'HDFC Bank Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'INFY', 'name': 'Infosys Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'SBIN', 'name': 'State Bank of India', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'BHARTIARTL', 'name': 'Bharti Airtel Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'HINDUNILVR', 'name': 'Hindustan Unilever Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'ICICIBANK', 'name': 'ICICI Bank Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'KOTAKBANK', 'name': 'Kotak Mahindra Bank Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'WIPRO', 'name': 'Wipro Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'ADANIENT', 'name': 'Adani Enterprises Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'TATAMOTORS', 'name': 'Tata Motors Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'BAJFINANCE', 'name': 'Bajaj Finance Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'AXISBANK', 'name': 'Axis Bank Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
        {'symbol': 'SUNPHARMA', 'name': 'Sun Pharmaceutical Industries Ltd.', 'exchange': 'NSE', 'type': 'Equity'},
    ]
    
    if query:
        results = [stock for stock in stocks if query in stock['symbol'] or query.lower() in stock['name'].lower()]
    else:
        results = stocks[:10]  # Return top 10 stocks when no query
        
    return jsonify(results)

@app.route('/api/news/<symbol>')
def get_news(symbol):
    """Get news for a specific stock"""
    # Generate mock news
    current_date = datetime.now()
    news_items = [
        {
            'title': f"{symbol} Reports Strong Q4 Earnings, Beats Expectations",
            'source': "Economic Times",
            'date': (current_date - timedelta(days=2)).strftime('%d %b %Y'),
            'summary': f"{STOCK_INFO.get(symbol, {}).get('name', symbol)} announced quarterly results that exceeded analyst expectations with revenue growth of 15% year-over-year.",
            'url': "#"
        },
        {
            'title': f"Analysts Upgrade {symbol} to 'Buy' Rating",
            'source': "Bloomberg",
            'date': (current_date - timedelta(days=5)).strftime('%d %b %Y'),
            'summary': "Multiple research firms have upgraded their outlook on the stock citing strong fundamentals and growth prospects.",
            'url': "#"
        },
        {
            'title': f"{symbol} Announces New Product Launch",
            'source': "Business Standard",
            'date': (current_date - timedelta(days=8)).strftime('%d %b %Y'),
            'summary': "The company unveiled its latest innovation which is expected to open new revenue streams in emerging markets.",
            'url': "#"
        },
        {
            'title': f"{symbol} CEO Discusses Future Growth Strategy",
            'source': "CNBC-TV18",
            'date': (current_date - timedelta(days=12)).strftime('%d %b %Y'),
            'summary': "In an exclusive interview, the CEO outlined plans for expansion and addressing competitive challenges in the industry.",
            'url': "#"
        },
        {
            'title': f"{symbol} Declares Dividend of ₹{round(random.random() * 20, 2)} Per Share",
            'source': "Mint",
            'date': (current_date - timedelta(days=15)).strftime('%d %b %Y'),
            'summary': "The board of directors has approved a dividend payment to shareholders, reflecting strong cash flow position.",
            'url': "#"
        }
    ]
    return jsonify(news_items)

# Serve static files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    else:
        return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
