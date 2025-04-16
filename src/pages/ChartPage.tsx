
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Sample stock data
const generateMockData = (days: number, basePrice: number, volatility: number): ChartData[] => {
  const data: ChartData[] = [];
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
};

const ChartPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const symbolParam = queryParams.get('symbol') || 'RELIANCE';
  const exchangeParam = queryParams.get('exchange') || 'NSE';
  
  const [symbol, setSymbol] = useState(symbolParam);
  const [exchange, setExchange] = useState(exchangeParam);
  const [timeframe, setTimeframe] = useState('1mo');
  const [chartType, setChartType] = useState('area');
  const [data, setData] = useState<ChartData[]>([]);
  const [stockInfo, setStockInfo] = useState({
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
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch stock data
    setIsLoading(true);
    
    // Generate appropriate data based on the timeframe
    let days = 30;
    let volatility = 0.02; // 2% daily volatility
    
    switch (timeframe) {
      case '1d':
        days = 1;
        volatility = 0.01;
        break;
      case '1w':
        days = 7;
        volatility = 0.015;
        break;
      case '1mo':
        days = 30;
        volatility = 0.02;
        break;
      case '3mo':
        days = 90;
        volatility = 0.03;
        break;
      case '6mo':
        days = 180;
        volatility = 0.04;
        break;
      case '1y':
        days = 365;
        volatility = 0.06;
        break;
      case '5y':
        days = 365 * 5;
        volatility = 0.08;
        break;
    }
    
    setTimeout(() => {
      const mockData = generateMockData(days, stockInfo.currentPrice, volatility);
      setData(mockData);
      setIsLoading(false);
    }, 800);
  }, [timeframe, symbol, exchange, stockInfo.currentPrice]);
  
  // Format numbers for display
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
  };
  
  const formatPrice = (price: number): string => {
    return `₹${price.toFixed(2)}`;
  };
  
  const formatVolume = (volume: number): string => {
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(2)} Cr`;
    } else if (volume >= 100000) {
      return `${(volume / 100000).toFixed(2)} L`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)} K`;
    }
    return volume.toString();
  };
  
  const handleSymbolChange = (value: string) => {
    // In a real app, fetch data for the new symbol
    setSymbol(value);
    
    // Update mock stock info based on the selected symbol
    // This would be replaced with actual API data
    if (value === 'RELIANCE') {
      setStockInfo({
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
      });
    } else if (value === 'TCS') {
      setStockInfo({
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
      });
    } else if (value === 'INFY') {
      setStockInfo({
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
      });
    } else {
      // Default values for other symbols
      setStockInfo({
        name: `${value} Stock`,
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
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-indigo-800">StockPulse</h1>
            </Link>
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">India</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-indigo-900 font-medium hover:text-indigo-700">Home</Link>
            <Link to="/search" className="text-indigo-900 font-medium hover:text-indigo-700">Search</Link>
            <Link to="/charts" className="text-indigo-900 font-medium hover:text-indigo-700 border-b-2 border-indigo-600">Charts</Link>
            <Link to="/analysis" className="text-indigo-900 font-medium hover:text-indigo-700">Analysis</Link>
            <Link to="/news" className="text-indigo-900 font-medium hover:text-indigo-700">News</Link>
          </nav>
          <div className="flex space-x-2">
            <Link to="/login">
              <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">Login</Button>
            </Link>
            <Link to="/signup" className="hidden md:block">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Stock Charts</h1>
          <p className="text-gray-600">Visualize stock price movements and trade volumes</p>
        </div>
        
        {/* Stock Selector and Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Select Stock</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Symbol</label>
                <Select value={symbol} onValueChange={handleSymbolChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RELIANCE">RELIANCE</SelectItem>
                    <SelectItem value="TCS">TCS</SelectItem>
                    <SelectItem value="HDFCBANK">HDFCBANK</SelectItem>
                    <SelectItem value="INFY">INFY</SelectItem>
                    <SelectItem value="SBIN">SBIN</SelectItem>
                    <SelectItem value="BHARTIARTL">BHARTIARTL</SelectItem>
                    <SelectItem value="HINDUNILVR">HINDUNILVR</SelectItem>
                    <SelectItem value="ICICIBANK">ICICIBANK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Exchange</label>
                <Select value={exchange} onValueChange={setExchange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NSE">NSE</SelectItem>
                    <SelectItem value="BSE">BSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Chart Type</label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="candle">Candlestick Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Link to={`/analysis?symbol=${symbol}&exchange=${exchange}`}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2">
                  View Technical Analysis
                </Button>
              </Link>
            </div>
          </Card>
          
          <Card className="p-6 lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{symbol} <span className="text-gray-500 text-lg">{exchange}</span></h2>
                <p className="text-gray-600">{stockInfo.name}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{formatPrice(stockInfo.currentPrice)}</div>
                <div className={`flex items-center justify-end ${stockInfo.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="text-lg font-medium">
                    {stockInfo.change > 0 ? '+' : ''}{stockInfo.change.toFixed(2)}
                  </span>
                  <span className="ml-2">
                    ({stockInfo.change > 0 ? '+' : ''}{stockInfo.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Open</p>
                <p className="font-medium">{formatPrice(stockInfo.open)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">High</p>
                <p className="font-medium">{formatPrice(stockInfo.high)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Low</p>
                <p className="font-medium">{formatPrice(stockInfo.low)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Volume</p>
                <p className="font-medium">{formatVolume(stockInfo.volume)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Market Cap</p>
                <p className="font-medium">{stockInfo.marketCap}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">P/E Ratio</p>
                <p className="font-medium">{stockInfo.pe.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dividend Yield</p>
                <p className="font-medium">{stockInfo.dividend.toFixed(2)}%</p>
              </div>
              <div>
                <Link to={`/news?symbol=${symbol}`}>
                  <Button variant="outline" size="sm" className="mt-1">
                    Latest News
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Chart Section */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Price Chart</h2>
            <div className="flex space-x-2">
              <Button 
                variant={timeframe === '1d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('1d')}
                className={timeframe === '1d' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              >
                1D
              </Button>
              <Button 
                variant={timeframe === '1w' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('1w')}
                className={timeframe === '1w' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              >
                1W
              </Button>
              <Button 
                variant={timeframe === '1mo' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('1mo')}
                className={timeframe === '1mo' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              >
                1M
              </Button>
              <Button 
                variant={timeframe === '3mo' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('3mo')}
                className={timeframe === '3mo' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              >
                3M
              </Button>
              <Button 
                variant={timeframe === '6mo' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('6mo')}
                className={timeframe === '6mo' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              >
                6M
              </Button>
              <Button 
                variant={timeframe === '1y' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('1y')}
                className={timeframe === '1y' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              >
                1Y
              </Button>
              <Button 
                variant={timeframe === '5y' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('5y')}
                className={timeframe === '5y' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              >
                5Y
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-80">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Loading chart data...</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                ) : chartType === 'area' ? (
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
                    <Legend />
                    <Area type="monotone" dataKey="price" stroke="#6366f1" fill="#818cf8" fillOpacity={0.3} />
                  </AreaChart>
                ) : chartType === 'candle' ? (
                  <div className="text-center h-full flex flex-col justify-center">
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-4 justify-center mb-4">
                        <div className="flex items-center">
                          <div className="w-4 h-16 bg-green-500 mr-2"></div>
                          <div className="text-sm">
                            <div>Open</div>
                            <div>Close</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-16 bg-red-500 mr-2"></div>
                          <div className="text-sm">
                            <div>Close</div>
                            <div>Open</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1 h-16 bg-black mx-auto mr-2"></div>
                          <div className="text-sm">
                            <div>High</div>
                            <div>Low</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">Candlestick chart visualization requires upgrade to premium plan</p>
                      <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">Upgrade to Premium</Button>
                    </div>
                  </div>
                ) : (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatVolume(value as number)}`, 'Volume']} />
                    <Legend />
                    <Bar dataKey="volume" fill="#818cf8" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        
        {/* Volume Chart */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold mb-6">Volume Chart</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Loading volume data...</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${formatVolume(value as number)}`, 'Volume']} />
                  <Bar dataKey="volume" fill="#818cf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        
        {/* Related Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to={`/analysis?symbol=${symbol}&exchange=${exchange}`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Technical Analysis</Button>
          </Link>
          <Link to={`/news?symbol=${symbol}`}>
            <Button variant="outline">Latest News</Button>
          </Link>
          <Link to="/search">
            <Button variant="outline">Search Other Stocks</Button>
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-indigo-200 text-sm">
            <p>© 2025 StockPulse. All rights reserved.</p>
            <p className="mt-2">
              Data provided for informational purposes only. Not intended for trading purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChartPage;
