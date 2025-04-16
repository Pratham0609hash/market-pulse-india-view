
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-800">StockPulse</h1>
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">India</span>
          </div>
          <nav className="flex space-x-4">
            <Link to="/" className="text-indigo-900 font-medium hover:text-indigo-700">Home</Link>
            <Link to="/search" className="text-indigo-900 font-medium hover:text-indigo-700">Search</Link>
            <Link to="/charts" className="text-indigo-900 font-medium hover:text-indigo-700">Charts</Link>
            <Link to="/analysis" className="text-indigo-900 font-medium hover:text-indigo-700">Analysis</Link>
            <Link to="/news" className="text-indigo-900 font-medium hover:text-indigo-700">News</Link>
          </nav>
          <div className="flex space-x-2">
            <Link to="/login">
              <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Indian Stock Market <span className="text-indigo-600">Insights</span> at Your Fingertips
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              StockPulse delivers real-time data, comprehensive analysis tools, and relevant news for BSE and NSE stocks, all in one place.
            </p>
            <div className="flex space-x-4">
              <Link to="/search">
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2">Get Started</Button>
              </Link>
              <Link to="/charts">
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-2">View Charts</Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <img 
              src="https://img.lovepik.com/element/45009/2553.png_860.png" 
              alt="Stock Chart Illustration" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Stock Search</h3>
              <p className="text-gray-600 text-center">
                Search for any BSE or NSE listed stock by name or symbol. Get instant access to critical information.
              </p>
            </Card>
            
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Interactive Charts</h3>
              <p className="text-gray-600 text-center">
                Visualize stock data with interactive charts. Track price history and volume trends over time.
              </p>
            </Card>
            
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Technical Analysis</h3>
              <p className="text-gray-600 text-center">
                Perform trend analysis with moving averages, identify key support and resistance levels, and more.
              </p>
            </Card>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Market News</h3>
              <p className="text-gray-600 text-center">
                Stay updated with the latest news and events affecting your selected stocks. Get insights into market movements and company updates.
              </p>
            </Card>
            
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Secure Access</h3>
              <p className="text-gray-600 text-center">
                Create your account to save your favorite stocks, set up personalized watchlists, and receive custom alerts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How StockPulse Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="mb-8 md:mb-0 md:w-1/2 md:pr-8">
            <img 
              src="https://img.freepik.com/premium-vector/financial-stock-market-graph-chart-investment-trading-white-background_317810-914.jpg" 
              alt="Stock Analysis Process" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <div className="flex mb-8">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Search Stocks</h3>
                <p className="text-gray-600">
                  Enter the symbol or name of any BSE or NSE listed stock to get started.
                </p>
              </div>
            </div>
            
            <div className="flex mb-8">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">View Interactive Charts</h3>
                <p className="text-gray-600">
                  Explore historical prices, volume data, and key market indicators through our interactive visualization tools.
                </p>
              </div>
            </div>
            
            <div className="flex mb-8">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Analyze Trends</h3>
                <p className="text-gray-600">
                  Use our technical analysis tools to identify patterns, trends, and potential investment opportunities.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <span className="font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
                <p className="text-gray-600">
                  Access the latest news and events that may impact your investments and the broader market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StockPulse</h3>
              <p className="text-indigo-200 mb-4">
                Your comprehensive tool for analyzing Indian stock market data, tracking trends, and making informed investment decisions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-indigo-200 hover:text-white">Home</Link></li>
                <li><Link to="/search" className="text-indigo-200 hover:text-white">Search</Link></li>
                <li><Link to="/charts" className="text-indigo-200 hover:text-white">Charts</Link></li>
                <li><Link to="/analysis" className="text-indigo-200 hover:text-white">Analysis</Link></li>
                <li><Link to="/news" className="text-indigo-200 hover:text-white">News</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-indigo-200 mb-2">Email: support@stockpulse.com</p>
              <p className="text-indigo-200 mb-2">Phone: +91 123 456 7890</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-indigo-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-indigo-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-indigo-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-indigo-800">
            <p className="text-indigo-200">© 2025 StockPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
