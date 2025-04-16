
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StockItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  exchange: 'BSE' | 'NSE';
}

const mockStocks: StockItem[] = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd.", price: 2550.75, change: 45.25, changePercent: 1.8, volume: 7865432, marketCap: "₹17.2T", exchange: "NSE" },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd.", price: 3450.20, change: -12.35, changePercent: -0.36, volume: 2345678, marketCap: "₹12.6T", exchange: "NSE" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1675.55, change: 22.80, changePercent: 1.38, volume: 5432198, marketCap: "₹9.3T", exchange: "NSE" },
  { symbol: "INFY", name: "Infosys Ltd.", price: 1456.10, change: -3.45, changePercent: -0.24, volume: 3210987, marketCap: "₹6.1T", exchange: "NSE" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd.", price: 2560.65, change: 18.90, changePercent: 0.74, volume: 1234567, marketCap: "₹6.0T", exchange: "NSE" },
  { symbol: "WIPRO", name: "Wipro Ltd.", price: 425.80, change: 8.75, changePercent: 2.10, volume: 3456789, marketCap: "₹2.3T", exchange: "NSE" },
  { symbol: "AXISBANK", name: "Axis Bank Ltd.", price: 965.25, change: -5.60, changePercent: -0.58, volume: 4321098, marketCap: "₹3.0T", exchange: "NSE" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", price: 720.45, change: 15.20, changePercent: 2.15, volume: 8765432, marketCap: "₹2.4T", exchange: "NSE" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", price: 978.30, change: 12.45, changePercent: 1.29, volume: 6543210, marketCap: "₹6.8T", exchange: "NSE" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd.", price: 6789.50, change: -78.65, changePercent: -1.15, volume: 987654, marketCap: "₹4.1T", exchange: "NSE" },
  { symbol: "SBIN", name: "State Bank of India", price: 675.35, change: 9.20, changePercent: 1.38, volume: 12345678, marketCap: "₹6.0T", exchange: "BSE" },
  { symbol: "ADANIPORTS", name: "Adani Ports and SEZ Ltd.", price: 890.75, change: -15.80, changePercent: -1.74, volume: 3456789, marketCap: "₹1.9T", exchange: "BSE" },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd.", price: 3210.85, change: 34.50, changePercent: 1.09, volume: 876543, marketCap: "₹3.1T", exchange: "BSE" },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd.", price: 134.25, change: 3.75, changePercent: 2.87, volume: 23456789, marketCap: "₹1.6T", exchange: "BSE" },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd.", price: 9875.40, change: 112.65, changePercent: 1.15, volume: 654321, marketCap: "₹2.9T", exchange: "BSE" },
];

const popularSearches = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "SBIN", "MARUTI"];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeExchange, setActiveExchange] = useState<'ALL' | 'NSE' | 'BSE'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<StockItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = mockStocks.filter(stock => {
        const matchesQuery = 
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
          stock.name.toLowerCase().includes(searchQuery.toLowerCase());
          
        const matchesExchange = 
          activeExchange === 'ALL' || 
          stock.exchange === activeExchange;
          
        return matchesQuery && matchesExchange;
      });
      
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 500);
  };

  const handleQuickSearch = (symbol: string) => {
    setSearchQuery(symbol);
    
    // Simulate form submission
    setIsLoading(true);
    setHasSearched(true);
    
    setTimeout(() => {
      const filteredResults = mockStocks.filter(stock => {
        const matchesQuery = stock.symbol === symbol;
        const matchesExchange = 
          activeExchange === 'ALL' || 
          stock.exchange === activeExchange;
          
        return matchesQuery && matchesExchange;
      });
      
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 500);
  };

  const filterByExchange = (exchange: 'ALL' | 'NSE' | 'BSE') => {
    setActiveExchange(exchange);
    
    if (hasSearched) {
      setIsLoading(true);
      
      setTimeout(() => {
        const filteredResults = mockStocks.filter(stock => {
          const matchesQuery = 
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
            stock.name.toLowerCase().includes(searchQuery.toLowerCase());
            
          const matchesExchange = 
            exchange === 'ALL' || 
            stock.exchange === exchange;
            
          return matchesQuery && matchesExchange;
        });
        
        setSearchResults(filteredResults);
        setIsLoading(false);
      }, 300);
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
            <Link to="/search" className="text-indigo-900 font-medium hover:text-indigo-700 border-b-2 border-indigo-600">Search</Link>
            <Link to="/charts" className="text-indigo-900 font-medium hover:text-indigo-700">Charts</Link>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Indian Stocks</h1>
          
          {/* Search Box */}
          <Card className="p-6 mb-8">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search by company name or symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((symbol) => (
                  <Button
                    key={symbol}
                    variant="outline"
                    className="text-xs py-1 h-auto"
                    onClick={() => handleQuickSearch(symbol)}
                  >
                    {symbol}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Filter Tabs */}
          <Tabs defaultValue="ALL" className="mb-6" onValueChange={(value) => filterByExchange(value as 'ALL' | 'NSE' | 'BSE')}>
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="ALL">All Exchanges</TabsTrigger>
              <TabsTrigger value="NSE">NSE</TabsTrigger>
              <TabsTrigger value="BSE">BSE</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Search Results */}
          {hasSearched && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching for stocks...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Symbol</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Volume</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
                      <TableHead className="text-center">Exchange</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((stock) => (
                      <TableRow key={stock.symbol + stock.exchange}>
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{stock.name}</TableCell>
                        <TableCell className="text-right">₹{stock.price.toFixed(2)}</TableCell>
                        <TableCell className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">{stock.volume.toLocaleString()}</TableCell>
                        <TableCell className="text-right hidden md:table-cell">{stock.marketCap}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${stock.exchange === 'NSE' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {stock.exchange}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link to={`/charts?symbol=${stock.symbol}&exchange=${stock.exchange}`}>
                              <Button variant="outline" size="sm" className="h-8 px-3">Charts</Button>
                            </Link>
                            <Link to={`/analysis?symbol=${stock.symbol}&exchange=${stock.exchange}`}>
                              <Button size="sm" className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700">Analysis</Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-gray-400 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or exchange filter
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Initial State - No Search Yet */}
          {!hasSearched && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-16 w-16 text-indigo-200 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Search for Indian Stocks</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter a company name or stock symbol above to search for stocks listed on NSE or BSE.
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">StockPulse</h3>
              <p className="text-indigo-200 text-sm">Indian stock market insights at your fingertips</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium mb-2">Explore</h4>
                <ul className="text-indigo-200 text-sm space-y-1">
                  <li><Link to="/" className="hover:text-white">Home</Link></li>
                  <li><Link to="/search" className="hover:text-white">Search</Link></li>
                  <li><Link to="/charts" className="hover:text-white">Charts</Link></li>
                  <li><Link to="/analysis" className="hover:text-white">Analysis</Link></li>
                  <li><Link to="/news" className="hover:text-white">News</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Account</h4>
                <ul className="text-indigo-200 text-sm space-y-1">
                  <li><Link to="/login" className="hover:text-white">Login</Link></li>
                  <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Legal</h4>
                <ul className="text-indigo-200 text-sm space-y-1">
                  <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                  <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-indigo-800 mt-6 pt-6 text-center text-indigo-200 text-sm">
            <p>© 2025 StockPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
