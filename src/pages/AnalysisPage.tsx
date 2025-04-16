
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

interface StockDataPoint {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma5?: number;
  sma10?: number;
  sma20?: number;
  sma50?: number;
  sma200?: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  upperBand?: number;
  lowerBand?: number;
  [key: string]: string | number | undefined;
}

// Generate mock data for analysis
const generateMockData = (days: number, basePrice: number, volatility: number): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
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

// Calculate Simple Moving Averages
const calculateSMA = (data: StockDataPoint[], periods: number[]): StockDataPoint[] => {
  const result = [...data];
  
  periods.forEach(period => {
    for (let i = 0; i < result.length; i++) {
      if (i >= period - 1) {
        const sum = data
          .slice(i - (period - 1), i + 1)
          .reduce((acc, curr) => acc + curr.price, 0);
        result[i][`sma${period}` as keyof StockDataPoint] = parseFloat((sum / period).toFixed(2));
      }
    }
  });
  
  return result;
};

// Calculate RSI
const calculateRSI = (data: StockDataPoint[], period: number = 14): StockDataPoint[] => {
  const result = [...data];
  
  if (data.length <= period) {
    return result;
  }
  
  let gains = 0;
  let losses = 0;
  
  // Calculate first average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].price - data[i - 1].price;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  result[period].rsi = 100 - (100 / (1 + (avgGain / avgLoss || 0)));
  
  // Calculate RSI for remaining data
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].price - data[i - 1].price;
    let currentGain = 0;
    let currentLoss = 0;
    
    if (change >= 0) {
      currentGain = change;
    } else {
      currentLoss = -change;
    }
    
    avgGain = ((avgGain * (period - 1)) + currentGain) / period;
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
    
    result[i].rsi = parseFloat((100 - (100 / (1 + (avgGain / avgLoss || 0)))).toFixed(2));
  }
  
  return result;
};

// Calculate MACD
const calculateMACD = (data: StockDataPoint[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): StockDataPoint[] => {
  const result = [...data];
  
  // Calculate EMAs
  const calculateEMA = (prices: number[], period: number): number[] => {
    const k = 2 / (period + 1);
    const emaArray: number[] = [];
    
    // Start with SMA for the first EMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += prices[i];
    }
    emaArray.push(sum / period);
    
    // Calculate remaining EMAs
    for (let i = period; i < prices.length; i++) {
      emaArray.push(prices[i] * k + emaArray[emaArray.length - 1] * (1 - k));
    }
    
    return emaArray;
  };
  
  const prices = data.map(d => d.price);
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  // Calculate MACD line
  const macdLine: number[] = [];
  for (let i = 0; i < slowEMA.length; i++) {
    const fastIndex = i + (prices.length - fastEMA.length);
    macdLine.push(fastEMA[fastIndex] - slowEMA[i]);
  }
  
  // Calculate signal line (9-day EMA of MACD line)
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // Calculate histogram
  const histogram: number[] = [];
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + (macdLine.length - signalLine.length)] - signalLine[i]);
  }
  
  // Add to result
  const startIndex = prices.length - macdLine.length;
  for (let i = 0; i < histogram.length; i++) {
    const dataIndex = startIndex + i + (macdLine.length - histogram.length);
    if (dataIndex < result.length) {
      result[dataIndex].macd = parseFloat(macdLine[i + (macdLine.length - histogram.length)].toFixed(2));
      result[dataIndex].signal = parseFloat(signalLine[i].toFixed(2));
      result[dataIndex].histogram = parseFloat(histogram[i].toFixed(2));
    }
  }
  
  return result;
};

// Calculate Bollinger Bands
const calculateBollingerBands = (data: StockDataPoint[], period: number = 20, multiplier: number = 2): StockDataPoint[] => {
  const result = [...data];
  
  for (let i = period - 1; i < data.length; i++) {
    // Get subset of data for calculation
    const subset = data.slice(i - (period - 1), i + 1);
    
    // Calculate SMA
    const sma = subset.reduce((sum, point) => sum + point.price, 0) / period;
    
    // Calculate standard deviation
    const squaredDifferences = subset.map(point => Math.pow(point.price - sma, 2));
    const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / period;
    const stdDev = Math.sqrt(variance);
    
    // Set Bollinger Bands
    result[i].upperBand = parseFloat((sma + (multiplier * stdDev)).toFixed(2));
    result[i].lowerBand = parseFloat((sma - (multiplier * stdDev)).toFixed(2));
  }
  
  return result;
};

const AnalysisPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const symbolParam = queryParams.get('symbol') || 'RELIANCE';
  const exchangeParam = queryParams.get('exchange') || 'NSE';
  
  const [symbol, setSymbol] = useState(symbolParam);
  const [exchange, setExchange] = useState(exchangeParam);
  const [timeframe, setTimeframe] = useState('3mo');
  const [activeTab, setActiveTab] = useState('moving-averages');
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [stockInfo, setStockInfo] = useState({
    name: 'Reliance Industries Ltd.',
    currentPrice: 2550.75,
    change: 45.25,
    changePercent: 1.8,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState({
    trend: 'bullish',
    strength: 'strong',
    support: 2340.50,
    resistance: 2650.25,
    recommendation: 'buy',
  });
  
  useEffect(() => {
    // Simulate API call to fetch stock data
    setIsLoading(true);
    
    // Generate appropriate data based on the timeframe
    let days = 90;
    let volatility = 0.02; // 2% daily volatility
    
    switch (timeframe) {
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
    }
    
    setTimeout(() => {
      let mockData = generateMockData(days, stockInfo.currentPrice, volatility);
      
      // Calculate technical indicators
      mockData = calculateSMA(mockData, [5, 10, 20, 50, 200]);
      mockData = calculateRSI(mockData);
      mockData = calculateMACD(mockData);
      mockData = calculateBollingerBands(mockData);
      
      setData(mockData);
      
      // Generate analysis result
      const lastPrice = mockData[mockData.length - 1].price;
      const sma20 = mockData[mockData.length - 1].sma20;
      const sma50 = mockData[mockData.length - 1].sma50;
      const rsi = mockData[mockData.length - 1].rsi;
      
      let trend = 'neutral';
      let strength = 'moderate';
      let recommendation = 'hold';
      
      if (sma20 && sma50) {
        if (lastPrice > sma20 && sma20 > sma50) {
          trend = 'bullish';
          recommendation = 'buy';
        } else if (lastPrice < sma20 && sma20 < sma50) {
          trend = 'bearish';
          recommendation = 'sell';
        }
      }
      
      if (rsi) {
        if (rsi > 70) {
          strength = 'overbought';
          recommendation = 'sell';
        } else if (rsi < 30) {
          strength = 'oversold';
          recommendation = 'buy';
        } else if (rsi > 60) {
          strength = 'strong';
        } else if (rsi < 40) {
          strength = 'weak';
        }
      }
      
      // Calculate support and resistance
      const sortedPrices = [...mockData].sort((a, b) => a.price - b.price);
      const support = sortedPrices[Math.floor(sortedPrices.length * 0.25)].price;
      const resistance = sortedPrices[Math.floor(sortedPrices.length * 0.75)].price;
      
      setAnalysisResult({
        trend,
        strength,
        support: parseFloat(support.toFixed(2)),
        resistance: parseFloat(resistance.toFixed(2)),
        recommendation,
      });
      
      setIsLoading(false);
    }, 1000);
  }, [timeframe, symbol, exchange, stockInfo.currentPrice]);
  
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
      });
    } else if (value === 'TCS') {
      setStockInfo({
        name: 'Tata Consultancy Services Ltd.',
        currentPrice: 3450.20,
        change: -12.35,
        changePercent: -0.36,
      });
    } else if (value === 'INFY') {
      setStockInfo({
        name: 'Infosys Ltd.',
        currentPrice: 1456.10,
        change: -3.45,
        changePercent: -0.24,
      });
    } else {
      // Default values for other symbols
      setStockInfo({
        name: `${value} Stock`,
        currentPrice: 1500 + Math.random() * 1000,
        change: (Math.random() - 0.5) * 50,
        changePercent: (Math.random() - 0.5) * 4,
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
            <Link to="/charts" className="text-indigo-900 font-medium hover:text-indigo-700">Charts</Link>
            <Link to="/analysis" className="text-indigo-900 font-medium hover:text-indigo-700 border-b-2 border-indigo-600">Analysis</Link>
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
          <h1 className="text-3xl font-bold text-gray-900">Technical Analysis</h1>
          <p className="text-gray-600">Analyze stock trends and patterns with technical indicators</p>
        </div>
        
        {/* Stock Selector and Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Stock Selection</h2>
            
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
                <label className="text-sm font-medium">Time Period</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1mo">1 Month</SelectItem>
                    <SelectItem value="3mo">3 Months</SelectItem>
                    <SelectItem value="6mo">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Link to={`/charts?symbol=${symbol}&exchange=${exchange}`}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2">
                  View Price Charts
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
                <div className="text-3xl font-bold">₹{stockInfo.currentPrice.toFixed(2)}</div>
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
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Analysis Summary</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Trend</p>
                  <p className={`font-medium ${
                    analysisResult.trend === 'bullish' ? 'text-green-600' : 
                    analysisResult.trend === 'bearish' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {analysisResult.trend.charAt(0).toUpperCase() + analysisResult.trend.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Strength</p>
                  <p className="font-medium">
                    {analysisResult.strength.charAt(0).toUpperCase() + analysisResult.strength.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Support</p>
                  <p className="font-medium">₹{analysisResult.support.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resistance</p>
                  <p className="font-medium">₹{analysisResult.resistance.toFixed(2)}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500">Recommendation</p>
                  <p className={`font-medium ${
                    analysisResult.recommendation === 'buy' ? 'text-green-600' : 
                    analysisResult.recommendation === 'sell' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {analysisResult.recommendation.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 italic">
                * This is not financial advice. Please consult with a financial advisor before making investment decisions.
              </div>
            </div>
          </Card>
        </div>
        
        {/* Technical Analysis Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="moving-averages">Moving Averages</TabsTrigger>
              <TabsTrigger value="rsi">RSI</TabsTrigger>
              <TabsTrigger value="macd">MACD</TabsTrigger>
              <TabsTrigger value="bollinger">Bollinger Bands</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-80">
                <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-600">Loading analysis data...</p>
              </div>
            ) : (
              <>
                <TabsContent value="moving-averages" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Simple Moving Averages (SMA)</h3>
                    <p className="text-gray-600 mb-4">
                      Moving averages smooth out price data to create a single flowing line, making it easier to identify the direction of the trend.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-indigo-600 mr-2"></div>
                        <span>SMA 5</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-500 mr-2"></div>
                        <span>SMA 10</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                        <span>SMA 20</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 mr-2"></div>
                        <span>SMA 50</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 mr-2"></div>
                        <span>SMA 200</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => [`₹${value}`, '']} />
                        <Legend />
                        <Line type="monotone" dataKey="price" name="Price" stroke="#6366f1" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="sma5" name="SMA 5" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="sma10" name="SMA 10" stroke="#a855f7" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="sma20" name="SMA 20" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="sma50" name="SMA 50" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="sma200" name="SMA 200" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Moving Average Analysis</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>
                          <strong>Golden Cross:</strong> {data[data.length-1].sma50 && data[data.length-1].sma200 && data[data.length-1].sma50 > data[data.length-1].sma200 ? 
                            "Present - indicating a potential bullish trend" : 
                            "Not present - shorter-term averages below longer-term"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>
                          <strong>Death Cross:</strong> {data[data.length-1].sma50 && data[data.length-1].sma200 && data[data.length-1].sma50 < data[data.length-1].sma200 ? 
                            "Present - indicating a potential bearish trend" : 
                            "Not present - shorter-term averages above longer-term"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          <strong>Price vs SMA 20:</strong> {data[data.length-1].price > (data[data.length-1].sma20 || 0) ? 
                            "Price is above SMA 20 - potential bullish signal" : 
                            "Price is below SMA 20 - potential bearish signal"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>
                          <strong>Short-term Momentum:</strong> {data[data.length-1].sma5 && data[data.length-1].sma20 && data[data.length-1].sma5 > data[data.length-1].sma20 ? 
                            "Strong short-term momentum (SMA 5 > SMA 20)" : 
                            "Weak short-term momentum (SMA 5 < SMA 20)"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="rsi" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Relative Strength Index (RSI)</h3>
                    <p className="text-gray-600 mb-4">
                      RSI measures the speed and magnitude of price movements. Values above 70 indicate overbought conditions, while values below 30 indicate oversold conditions.
                    </p>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" />
                        <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="rsi" name="RSI (14)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">RSI Analysis</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className={`${data[data.length-1].rsi && data[data.length-1].rsi > 70 ? "text-red-500" : "text-gray-500"} mr-2`}>•</span>
                        <span>
                          <strong>Overbought (&gt;70):</strong> {data[data.length-1].rsi && data[data.length-1].rsi > 70 ? 
                            "Yes - RSI at " + data[data.length-1].rsi?.toFixed(2) + ". Stock may be overvalued, potential reversal or correction ahead." : 
                            "No - RSI not in overbought territory."}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className={`${data[data.length-1].rsi && data[data.length-1].rsi < 30 ? "text-green-500" : "text-gray-500"} mr-2`}>•</span>
                        <span>
                          <strong>Oversold (&lt;30):</strong> {data[data.length-1].rsi && data[data.length-1].rsi < 30 ? 
                            "Yes - RSI at " + data[data.length-1].rsi?.toFixed(2) + ". Stock may be undervalued, potential upward reversal ahead." : 
                            "No - RSI not in oversold territory."}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          <strong>Current RSI:</strong> {data[data.length-1].rsi?.toFixed(2)} - {
                            data[data.length-1].rsi && data[data.length-1].rsi > 60 ? "Strong momentum" :
                            data[data.length-1].rsi && data[data.length-1].rsi < 40 ? "Weak momentum" :
                            "Neutral momentum"
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>
                          <strong>RSI Trend:</strong> {
                            data[data.length-1].rsi && data[data.length-2].rsi && data[data.length-1].rsi > data[data.length-2].rsi ? 
                            "Increasing - gaining momentum" : 
                            "Decreasing - losing momentum"
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="macd" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Moving Average Convergence Divergence (MACD)</h3>
                    <p className="text-gray-600 mb-4">
                      MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                        <span>MACD Line (12, 26)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 mr-2"></div>
                        <span>Signal Line (9)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-indigo-300 mr-2"></div>
                        <span>Histogram</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={0} stroke="#777" strokeWidth={1} />
                        <Line type="monotone" dataKey="macd" name="MACD Line" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="signal" name="Signal Line" stroke="#ef4444" strokeWidth={2} dot={false} />
                        <Bar dataKey="histogram" name="Histogram" fill="#818cf8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">MACD Analysis</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className={`${data[data.length-1].macd && data[data.length-1].signal && data[data.length-1].macd > data[data.length-1].signal ? "text-green-500" : "text-red-500"} mr-2`}>•</span>
                        <span>
                          <strong>MACD Crossover:</strong> {data[data.length-1].macd && data[data.length-1].signal && data[data.length-1].macd > data[data.length-1].signal ? 
                            "Bullish - MACD line is above the signal line" : 
                            "Bearish - MACD line is below the signal line"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className={`${data[data.length-1].macd && data[data.length-1].macd > 0 ? "text-green-500" : "text-red-500"} mr-2`}>•</span>
                        <span>
                          <strong>MACD vs Zero Line:</strong> {data[data.length-1].macd && data[data.length-1].macd > 0 ? 
                            "Positive - indicating bullish momentum" : 
                            "Negative - indicating bearish momentum"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className={`${data[data.length-1].histogram && data[data.length-2].histogram && data[data.length-1].histogram > data[data.length-2].histogram ? "text-green-500" : "text-red-500"} mr-2`}>•</span>
                        <span>
                          <strong>Histogram Trend:</strong> {data[data.length-1].histogram && data[data.length-2].histogram && data[data.length-1].histogram > data[data.length-2].histogram ? 
                            "Increasing - momentum is strengthening" : 
                            "Decreasing - momentum is weakening"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          <strong>Recent Signal:</strong> {
                            data[data.length-3].macd && data[data.length-3].signal && data[data.length-2].macd && data[data.length-2].signal &&
                            ((data[data.length-3].macd < data[data.length-3].signal && data[data.length-2].macd > data[data.length-2].signal) ||
                             (data[data.length-3].macd > data[data.length-3].signal && data[data.length-2].macd < data[data.length-2].signal)) ?
                            "Recent crossover detected - potential trend change" : 
                            "No recent crossover - continuing current trend"
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="bollinger" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Bollinger Bands</h3>
                    <p className="text-gray-600 mb-4">
                      Bollinger Bands consist of a middle band (20-day SMA) with an upper and lower band (±2 standard deviations). They help identify overbought or oversold conditions.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-indigo-600 mr-2"></div>
                        <span>Price</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 mr-2"></div>
                        <span>Upper Band (+2σ)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 mr-2"></div>
                        <span>Lower Band (-2σ)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => [`₹${value}`, '']} />
                        <Legend />
                        <Line type="monotone" dataKey="price" name="Price" stroke="#6366f1" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="upperBand" name="Upper Band" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="sma20" name="SMA 20" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="lowerBand" name="Lower Band" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Bollinger Bands Analysis</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className={`${data[data.length-1].price && data[data.length-1].upperBand && data[data.length-1].price > data[data.length-1].upperBand ? "text-red-500" : "text-gray-500"} mr-2`}>•</span>
                        <span>
                          <strong>Upper Band Touch:</strong> {data[data.length-1].price && data[data.length-1].upperBand && data[data.length-1].price > data[data.length-1].upperBand ? 
                            "Price is above the upper band - potentially overbought" : 
                            "Price is below the upper band"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className={`${data[data.length-1].price && data[data.length-1].lowerBand && data[data.length-1].price < data[data.length-1].lowerBand ? "text-green-500" : "text-gray-500"} mr-2`}>•</span>
                        <span>
                          <strong>Lower Band Touch:</strong> {data[data.length-1].price && data[data.length-1].lowerBand && data[data.length-1].price < data[data.length-1].lowerBand ? 
                            "Price is below the lower band - potentially oversold" : 
                            "Price is above the lower band"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          <strong>Band Width:</strong> {
                            data[data.length-1].upperBand && data[data.length-1].lowerBand && data[data.length-20].upperBand && data[data.length-20].lowerBand &&
                            (data[data.length-1].upperBand - data[data.length-1].lowerBand) < (data[data.length-20].upperBand - data[data.length-20].lowerBand) ? 
                            "Bands are contracting - suggesting decreasing volatility" : 
                            "Bands are expanding - suggesting increasing volatility"
                          }
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>
                          <strong>Position Within Bands:</strong> {
                            data[data.length-1].price && data[data.length-1].upperBand && data[data.length-1].lowerBand && data[data.length-1].sma20 &&
                            data[data.length-1].price > data[data.length-1].sma20 ?
                            "Price is in the upper half of the bands - bullish bias" :
                            "Price is in the lower half of the bands - bearish bias"
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </Card>
        
        {/* Related Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to={`/charts?symbol=${symbol}&exchange=${exchange}`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">View Price Charts</Button>
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
              Technical analysis provided for informational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AnalysisPage;
