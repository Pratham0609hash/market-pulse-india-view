
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  imageUrl?: string;
  relatedTags: string[];
}

// Generate mock news data
const generateMockNews = (symbol: string): NewsItem[] => {
  // Common financial news sources
  const sources = ['Economic Times', 'Mint', 'Business Standard', 'Financial Express', 'MoneyControl', 'LiveMint', 'CNBC-TV18', 'Bloomberg Quint'];
  
  // News topics based on the symbol
  let newsTitles: string[] = [];
  let baseSentiment: ('positive' | 'negative' | 'neutral')[] = [];
  let tags: string[] = [];
  
  if (symbol === 'RELIANCE') {
    newsTitles = [
      "Reliance Industries posts record quarterly profit of ₹18,549 crore",
      "Reliance Jio adds 4.2 million subscribers in Q4",
      "Reliance Retail expands footprint with 200 new stores",
      "Mukesh Ambani announces green energy investment of ₹75,000 crore",
      "Reliance partners with Google for affordable 5G smartphones",
      "Reliance shares hit all-time high after strong quarterly results",
      "Reliance's e-commerce venture JioMart expands to 200 cities",
      "Reliance faces regulatory scrutiny over retail market dominance",
      "Reliance Jio's 5G rollout plans delayed by spectrum allocation issues",
      "Reliance Industries plans to spin off oil-to-chemicals business"
    ];
    baseSentiment = ['positive', 'positive', 'positive', 'positive', 'positive', 'positive', 'positive', 'negative', 'negative', 'neutral'];
    tags = ['Earnings', 'Telecom', 'Retail', 'Green Energy', 'Technology', 'Stock Movement', 'E-commerce', 'Regulation', '5G', 'Business Restructuring'];
  } else if (symbol === 'TCS') {
    newsTitles = [
      "TCS reports 15% growth in Q4 profit, announces ₹18,000 crore buyback",
      "TCS adds 40,000 employees in FY23, plans similar hiring this year",
      "TCS wins $1 billion multi-year deal with leading European bank",
      "TCS launches new AI platform for enterprise customers",
      "TCS shares decline 2% after margin pressure in quarterly results",
      "Former TCS CEO joins rival firm's board, sparks competition concerns",
      "TCS announces strategic partnership with Microsoft for cloud solutions",
      "TCS faces class action lawsuit in US over alleged discrimination",
      "TCS opens new innovation hub in Hyderabad with 10,000 capacity",
      "TCS plans to expand operations in tier-2 cities amid hybrid work model"
    ];
    baseSentiment = ['positive', 'positive', 'positive', 'positive', 'negative', 'negative', 'positive', 'negative', 'positive', 'neutral'];
    tags = ['Earnings', 'Hiring', 'Deals', 'AI', 'Stock Movement', 'Management', 'Partnerships', 'Legal', 'Expansion', 'Work Culture'];
  } else if (symbol === 'INFY') {
    newsTitles = [
      "Infosys raises FY24 revenue guidance after strong Q1 performance",
      "Infosys partners with NVIDIA for AI-powered solutions",
      "Infosys wins $500 million deal with European telecom giant",
      "Infosys completes acquisition of digital experience company for $100 million",
      "Infosys shares drop 6% following margin contraction",
      "Infosys faces attrition challenges amid heated tech talent market",
      "Infosys expands presence in Canada with new innovation hub",
      "Infosys announces carbon neutral commitment by 2040",
      "Infosys collaborates with ServiceNow for enterprise workflow solutions",
      "Infosys awarded for diversity and inclusion practices"
    ];
    baseSentiment = ['positive', 'positive', 'positive', 'positive', 'negative', 'negative', 'positive', 'positive', 'positive', 'positive'];
    tags = ['Guidance', 'AI', 'Deals', 'Acquisitions', 'Stock Movement', 'Attrition', 'Expansion', 'ESG', 'Partnerships', 'Awards'];
  } else {
    // Generic news for other symbols
    newsTitles = [
      `${symbol} reports better-than-expected quarterly results`,
      `${symbol} announces expansion plans in emerging markets`,
      `${symbol} shares surge following analyst upgrade`,
      `${symbol} partners with tech giant for digital transformation`,
      `${symbol} faces supply chain challenges amid global shortages`,
      `${symbol} board approves share buyback program`,
      `${symbol} CEO discusses future growth strategy in interview`,
      `${symbol} introduces new products at annual showcase event`,
      `${symbol} downgraded by major brokerage firm citing valuation concerns`,
      `${symbol} announces leadership changes effective next quarter`
    ];
    baseSentiment = ['positive', 'positive', 'positive', 'positive', 'negative', 'positive', 'neutral', 'positive', 'negative', 'neutral'];
    tags = ['Earnings', 'Expansion', 'Stock Movement', 'Partnerships', 'Supply Chain', 'Buyback', 'Strategy', 'Products', 'Analyst Rating', 'Management'];
  }
  
  // Generate random dates within last 14 days
  const getRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 14);
    now.setDate(now.getDate() - daysAgo);
    return now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  // Generic summaries
  const generateSummary = (title: string, sentiment: string) => {
    if (sentiment === 'positive') {
      return `${title}. Analysts view this as a positive development for the company's long-term growth prospects. The move is expected to strengthen the company's position in the market and potentially drive revenue growth in coming quarters.`;
    } else if (sentiment === 'negative') {
      return `${title}. This development raises concerns among investors about the company's future performance. Analysts are closely monitoring the situation to assess potential impact on financial results.`;
    } else {
      return `${title}. This development comes amid changing market dynamics. Experts have mixed opinions about the long-term implications for the company's business strategy and financial outlook.`;
    }
  };
  
  // Generate news items
  const news: NewsItem[] = [];
  
  for (let i = 0; i < newsTitles.length; i++) {
    const sentiment = baseSentiment[i] || (Math.random() > 0.6 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral');
    
    const newsItem: NewsItem = {
      id: `news-${i}`,
      title: newsTitles[i],
      source: sources[Math.floor(Math.random() * sources.length)],
      date: getRandomDate(),
      summary: generateSummary(newsTitles[i], sentiment),
      url: '#',
      sentiment: sentiment,
      impact: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      relatedTags: [tags[i], 'Market', symbol],
    };
    
    // Add images to some news items
    if (Math.random() > 0.3) {
      const imageNumber = Math.floor(Math.random() * 10) + 1;
      newsItem.imageUrl = `https://source.unsplash.com/random/300x200?business,finance,${imageNumber}`;
    }
    
    news.push(newsItem);
  }
  
  // Sort by date (assuming most recent first)
  return news.sort(() => Math.random() - 0.5);
};

const NewsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const symbolParam = queryParams.get('symbol') || 'RELIANCE';
  
  const [symbol, setSymbol] = useState(symbolParam);
  const [filter, setFilter] = useState('all');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch news
    setIsLoading(true);
    
    setTimeout(() => {
      const mockNews = generateMockNews(symbol);
      setNews(mockNews);
      setIsLoading(false);
    }, 800);
  }, [symbol]);
  
  const filteredNews = filter === 'all' ? news : 
    filter === 'positive' ? news.filter(item => item.sentiment === 'positive') :
    filter === 'negative' ? news.filter(item => item.sentiment === 'negative') :
    filter === 'high-impact' ? news.filter(item => item.impact === 'high') :
    news;
  
  const handleSymbolChange = (value: string) => {
    setSymbol(value);
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
            <Link to="/analysis" className="text-indigo-900 font-medium hover:text-indigo-700">Analysis</Link>
            <Link to="/news" className="text-indigo-900 font-medium hover:text-indigo-700 border-b-2 border-indigo-600">News</Link>
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
          <h1 className="text-3xl font-bold text-gray-900">Market News</h1>
          <p className="text-gray-600">Stay updated with the latest news affecting your investments</p>
        </div>
        
        {/* Stock Selection and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Card className="p-4 md:w-64">
            <h2 className="font-semibold mb-4">Stock Selection</h2>
            <Select value={symbol} onValueChange={handleSymbolChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select stock" />
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
            
            <div className="mt-6">
              <h2 className="font-semibold mb-4">Analysis Links</h2>
              <div className="space-y-2">
                <Link to={`/charts?symbol=${symbol}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Price Charts
                  </Button>
                </Link>
                <Link to={`/analysis?symbol=${symbol}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Technical Analysis
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          
          <div className="flex-grow">
            <Card className="p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Recent News for {symbol}</h2>
                <div className="flex space-x-2">
                  <Tabs value={filter} onValueChange={setFilter} className="w-full">
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="all">All News</TabsTrigger>
                      <TabsTrigger value="positive">Positive</TabsTrigger>
                      <TabsTrigger value="negative">Negative</TabsTrigger>
                      <TabsTrigger value="high-impact">High Impact</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </Card>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-600">Loading news articles...</p>
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="space-y-6">
                {filteredNews.map(article => (
                  <Card key={article.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {article.imageUrl && (
                        <div className="md:w-1/4">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="h-48 md:h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className={`p-6 ${article.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge className={`mb-2 ${
                              article.sentiment === 'positive' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                              article.sentiment === 'negative' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                              'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}>
                              {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                            </Badge>
                            {article.impact === 'high' && (
                              <Badge className="ml-2 mb-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                                High Impact
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{article.date}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
                        <div className="flex justify-between items-end">
                          <div className="flex flex-wrap gap-2">
                            {article.relatedTags.map(tag => (
                              <Badge key={tag} variant="outline" className="bg-gray-50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            Source: {article.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No news articles found</h3>
                <p className="text-gray-600 mb-4">
                  Try selecting a different filter or stock symbol
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setFilter('all')}
                  className="mx-auto"
                >
                  View All News
                </Button>
              </Card>
            )}
          </div>
        </div>
        
        {/* Market Overview */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-bold mb-6">Market Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">NIFTY 50</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-2">22,456.80</span>
                <span className="text-green-600">+126.75 (+0.57%)</span>
              </div>
              <p className="text-sm text-gray-600">
                Indian markets closed higher led by gains in IT and banking stocks amid positive global cues.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">SENSEX</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-2">73,845.12</span>
                <span className="text-green-600">+415.32 (+0.56%)</span>
              </div>
              <p className="text-sm text-gray-600">
                Sensex gained as investors bought bluechip stocks after recent correction in the market.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Market Sentiment</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="ml-2 text-sm">Bullish</span>
              </div>
              <p className="text-sm text-gray-600">
                Positive sentiment driven by strong corporate earnings and stable macroeconomic indicators.
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-4">Top Market Movers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Top Gainers</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">TATASTEEL</span>
                    <span className="text-green-600">+3.45%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">SUNPHARMA</span>
                    <span className="text-green-600">+2.87%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">WIPRO</span>
                    <span className="text-green-600">+2.65%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Top Losers</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">BAJAJFINSV</span>
                    <span className="text-red-600">-1.98%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">HDFCBANK</span>
                    <span className="text-red-600">-1.45%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">ASIANPAINT</span>
                    <span className="text-red-600">-1.32%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Related Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to={`/charts?symbol=${symbol}`}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">View Price Charts</Button>
          </Link>
          <Link to={`/analysis?symbol=${symbol}`}>
            <Button variant="outline">Technical Analysis</Button>
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
              News and analysis provided for informational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsPage;
