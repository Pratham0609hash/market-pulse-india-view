
/**
 * Utility functions for the StockPulse application
 */

// Format numbers for display
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

// Format price with rupee symbol
function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
}

// Format volume (lakhs, crores)
function formatVolume(volume) {
    if (volume >= 10000000) {
        return `${(volume / 10000000).toFixed(2)} Cr`;
    } else if (volume >= 100000) {
        return `${(volume / 100000).toFixed(2)} L`;
    } else if (volume >= 1000) {
        return `${(volume / 1000).toFixed(2)} K`;
    }
    return volume.toString();
}

// Generate random data for charts
function generateMockData(days, basePrice, volatility) {
    const data = [];
    const now = new Date();
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        
        // Generate random price movements
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        currentPrice = Math.max(currentPrice + change, 1);
        
        // Daily range
        const open = currentPrice - (Math.random() * volatility * currentPrice * 0.5);
        const high = Math.max(open, currentPrice) + (Math.random() * volatility * currentPrice * 0.2);
        const low = Math.min(open, currentPrice) - (Math.random() * volatility * currentPrice * 0.2);
        const close = currentPrice;
        
        // Volume (higher on volatile days)
        const volumeBase = 1000000 + Math.random() * 9000000;
        const volumeMultiplier = 1 + Math.abs(change / currentPrice) * 10;
        const volume = Math.round(volumeBase * volumeMultiplier);
        
        data.push({
            date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            price: parseFloat(currentPrice.toFixed(2)),
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume,
        });
    }
    
    return data;
}

// Get stock info based on symbol
function getStockInfo(symbol) {
    const stocks = {
        'RELIANCE': {
            name: 'Reliance Industries Ltd.',
            currentPrice: 2550.75,
            change: 45.25,
            changePercent: 1.8,
            open: 2505.50,
            high: 2570.25,
            low: 2490.00,
            volume: 7865432,
            marketCap: '₹17.2T',
            pe: 28.4,
            dividend: 2.5,
        },
        'TCS': {
            name: 'Tata Consultancy Services Ltd.',
            currentPrice: 3450.20,
            change: -12.35,
            changePercent: -0.36,
            open: 3462.55,
            high: 3478.90,
            low: 3442.10,
            volume: 2345678,
            marketCap: '₹12.6T',
            pe: 32.1,
            dividend: 3.2,
        },
        'INFY': {
            name: 'Infosys Ltd.',
            currentPrice: 1456.10,
            change: -3.45,
            changePercent: -0.24,
            open: 1459.55,
            high: 1467.20,
            low: 1451.85,
            volume: 3210987,
            marketCap: '₹6.1T',
            pe: 24.6,
            dividend: 2.8,
        },
        'HDFCBANK': {
            name: 'HDFC Bank Ltd.',
            currentPrice: 1623.50,
            change: 12.75,
            changePercent: 0.79,
            open: 1610.75,
            high: 1625.90,
            low: 1608.25,
            volume: 4532109,
            marketCap: '₹9.3T',
            pe: 22.8,
            dividend: 1.8,
        },
        'SBIN': {
            name: 'State Bank of India',
            currentPrice: 527.80,
            change: 3.25,
            changePercent: 0.62,
            open: 524.55,
            high: 530.10,
            low: 523.45,
            volume: 9876543,
            marketCap: '₹4.7T',
            pe: 9.7,
            dividend: 3.5,
        },
        'BHARTIARTL': {
            name: 'Bharti Airtel Ltd.',
            currentPrice: 875.60,
            change: -5.40,
            changePercent: -0.61,
            open: 881.00,
            high: 883.75,
            low: 873.20,
            volume: 3456789,
            marketCap: '₹5.2T',
            pe: 35.2,
            dividend: 1.2,
        },
        'HINDUNILVR': {
            name: 'Hindustan Unilever Ltd.',
            currentPrice: 2311.25,
            change: 15.75,
            changePercent: 0.69,
            open: 2295.50,
            high: 2318.80,
            low: 2293.15,
            volume: 1234567,
            marketCap: '₹5.5T',
            pe: 67.5,
            dividend: 2.1,
        },
        'ICICIBANK': {
            name: 'ICICI Bank Ltd.',
            currentPrice: 942.30,
            change: 8.45,
            changePercent: 0.90,
            open: 933.85,
            high: 945.70,
            low: 932.50,
            volume: 5678901,
            marketCap: '₹6.7T',
            pe: 19.3,
            dividend: 1.5,
        }
    };
    
    return stocks[symbol] || {
        name: `${symbol} Stock`,
        currentPrice: 1500 + Math.random() * 1000,
        change: (Math.random() - 0.5) * 50,
        changePercent: (Math.random() - 0.5) * 4,
        open: 1500 + Math.random() * 1000,
        high: 1550 + Math.random() * 1000,
        low: 1450 + Math.random() * 1000,
        volume: Math.floor(1000000 + Math.random() * 10000000),
        marketCap: `₹${(Math.random() * 10).toFixed(1)}T`,
        pe: 15 + Math.random() * 25,
        dividend: Math.random() * 4,
    };
}

// DOM manipulation helpers
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Get URL query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        symbol: params.get('symbol') || 'RELIANCE',
        exchange: params.get('exchange') || 'NSE',
        timeframe: params.get('timeframe') || '1mo'
    };
}
