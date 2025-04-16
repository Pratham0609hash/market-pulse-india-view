
# StockPulse - Indian Stock Market Analysis

StockPulse is a web application for analyzing Indian stocks from BSE and NSE exchanges. It provides charts, technical analysis, news, and search functionality for stock market enthusiasts.

## Features

- Interactive stock charts (line, area, bar charts)
- Technical analysis with indicators (moving averages, RSI, MACD, Bollinger Bands)
- Stock search functionality
- News and updates for selected stocks
- User authentication (login/signup)

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python/Flask
- **Charts**: D3.js
- **Data**: Mock data (simulated stock prices and technical indicators)

## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/stockpulse.git
   cd stockpulse
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```
   python server.py
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### Development

For development purposes, you might want to run the Flask server with debug mode enabled:

```
python server.py
```

## Project Structure

- `index.html` - Main page
- `charts.html` - Stock charts page
- `analysis.html` - Technical analysis page
- `news.html` - Stock news page
- `search.html` - Stock search page
- `login.html` - User login page
- `signup.html` - User registration page
- `css/` - CSS stylesheets
- `js/` - JavaScript files
  - `utils.js` - Utility functions
  - `pages/` - Page-specific JavaScript
- `server.py` - Python/Flask backend

## API Endpoints

- `/api/stock/<symbol>` - Get basic stock information
- `/api/historical/<symbol>?timeframe=1mo` - Get historical price data
- `/api/search?q=<query>` - Search for stocks
- `/api/news/<symbol>` - Get news for a specific stock

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application uses simulated data for educational purposes. It is not meant for actual trading decisions. Always consult a financial advisor before making investment decisions.
