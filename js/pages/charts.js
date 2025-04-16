
// charts.js - JavaScript for the charts page

// Get DOM elements
const symbolSelect = document.getElementById('symbol');
const exchangeSelect = document.getElementById('exchange');
const chartTypeSelect = document.getElementById('chartType');
const stockInfoContainer = document.getElementById('stockInfo');
const priceChartContainer = document.getElementById('priceChart');
const volumeChartContainer = document.getElementById('volumeChart');
const timeframeButtons = document.querySelectorAll('.timeframe-btn');

// Initialize state
let currentSymbol = 'RELIANCE';
let currentExchange = 'NSE';
let currentTimeframe = '1mo';
let currentChartType = 'area';
let stockData = [];
let stockInfo = {};

// Initialize the page
function initPage() {
    // Get query parameters
    const params = getQueryParams();
    currentSymbol = params.symbol;
    currentExchange = params.exchange;
    currentTimeframe = params.timeframe;
    
    // Set form values
    symbolSelect.value = currentSymbol;
    exchangeSelect.value = currentExchange;
    
    // Set active timeframe button
    timeframeButtons.forEach(btn => {
        if (btn.dataset.timeframe === currentTimeframe) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Load data
    loadStockData();
}

// Load stock data
function loadStockData() {
    // Show loading state
    priceChartContainer.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading chart data...</p></div>';
    volumeChartContainer.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading volume data...</p></div>';
    
    // Get stock info
    stockInfo = getStockInfo(currentSymbol);
    updateStockInfo(stockInfo);
    
    // Determine days and volatility based on timeframe
    let days = 30;
    let volatility = 0.02;
    
    switch (currentTimeframe) {
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
    
    // Simulate API call
    setTimeout(() => {
        // Generate mock data
        stockData = generateMockData(days, stockInfo.currentPrice, volatility);
        
        // Draw charts
        renderPriceChart(stockData);
        renderVolumeChart(stockData);
    }, 800);
}

// Update stock info card
function updateStockInfo(info) {
    const changeClass = info.change >= 0 ? 'price-positive' : 'price-negative';
    const changePrefix = info.change >= 0 ? '+' : '';
    
    const stockInfoHTML = `
        <div class="stock-info">
            <div>
                <h2>${currentSymbol} <span class="exchange">${currentExchange}</span></h2>
                <p class="company-name">${info.name}</p>
            </div>
            <div class="stock-change">
                <div class="stock-price">${formatPrice(info.currentPrice)}</div>
                <div class="${changeClass}">
                    ${changePrefix}${info.change.toFixed(2)}
                    <span>(${changePrefix}${info.changePercent.toFixed(2)}%)</span>
                </div>
            </div>
        </div>
        
        <div class="stock-metadata">
            <div class="metadata-item">
                <p class="metadata-label">Open</p>
                <p class="metadata-value">${formatPrice(info.open)}</p>
            </div>
            <div class="metadata-item">
                <p class="metadata-label">High</p>
                <p class="metadata-value">${formatPrice(info.high)}</p>
            </div>
            <div class="metadata-item">
                <p class="metadata-label">Low</p>
                <p class="metadata-value">${formatPrice(info.low)}</p>
            </div>
            <div class="metadata-item">
                <p class="metadata-label">Volume</p>
                <p class="metadata-value">${formatVolume(info.volume)}</p>
            </div>
            <div class="metadata-item">
                <p class="metadata-label">Market Cap</p>
                <p class="metadata-value">${info.marketCap}</p>
            </div>
            <div class="metadata-item">
                <p class="metadata-label">P/E Ratio</p>
                <p class="metadata-value">${info.pe.toFixed(2)}</p>
            </div>
            <div class="metadata-item">
                <p class="metadata-label">Dividend Yield</p>
                <p class="metadata-value">${info.dividend.toFixed(2)}%</p>
            </div>
            <div class="metadata-item">
                <a href="news.html?symbol=${currentSymbol}" class="btn btn-outline btn-sm">Latest News</a>
            </div>
        </div>
    `;
    
    stockInfoContainer.innerHTML = stockInfoHTML;
}

// Render price chart
function renderPriceChart(data) {
    // Check if we can use Recharts
    if (typeof Recharts === 'undefined') {
        priceChartContainer.innerHTML = '<div class="error-message">Chart library not loaded. Please try refreshing the page.</div>';
        return;
    }
    
    // Clear container
    priceChartContainer.innerHTML = '';
    
    if (currentChartType === 'candle') {
        // Candlestick chart requires premium (placeholder)
        priceChartContainer.innerHTML = `
            <div class="premium-chart-placeholder">
                <div class="premium-chart-message">
                    <h3>Candlestick Chart</h3>
                    <div class="candle-example">
                        <div class="candle-item">
                            <div class="candle green"></div>
                            <div class="candle-label">
                                <div>Open</div>
                                <div>Close</div>
                            </div>
                        </div>
                        <div class="candle-item">
                            <div class="candle red"></div>
                            <div class="candle-label">
                                <div>Close</div>
                                <div>Open</div>
                            </div>
                        </div>
                        <div class="candle-item">
                            <div class="candle-wick"></div>
                            <div class="candle-label">
                                <div>High</div>
                                <div>Low</div>
                            </div>
                        </div>
                    </div>
                    <p>Candlestick chart visualization requires upgrade to premium plan</p>
                    <button class="btn btn-primary">Upgrade to Premium</button>
                </div>
            </div>
        `;
        return;
    }
    
    // Create SVG element
    const width = priceChartContainer.clientWidth;
    const height = 400;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    priceChartContainer.appendChild(svg);
    
    // Set margins
    const margin = {top: 20, right: 30, bottom: 30, left: 60};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create group element to apply margins
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // Create X scale
    const x = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0, innerWidth])
        .padding(0.1);
    
    // Create Y scale
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.low) * 0.995, d3.max(data, d => d.high) * 1.005])
        .range([innerHeight, 0]);
    
    // Create X axis
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
    xAxis.setAttribute("transform", `translate(0,${innerHeight})`);
    xAxis.style.fontSize = "12px";
    g.appendChild(xAxis);
    
    // Create X axis ticks
    data.forEach((d, i) => {
        // Show fewer ticks on the x-axis for clarity
        if (i % Math.ceil(data.length / 10) === 0) {
            const tick = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tick.setAttribute("x", x(d.date) + x.bandwidth() / 2);
            tick.setAttribute("y", 20);
            tick.setAttribute("text-anchor", "middle");
            tick.textContent = d.date;
            xAxis.appendChild(tick);
        }
    });
    
    // Create Y axis
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
    yAxis.style.fontSize = "12px";
    g.appendChild(yAxis);
    
    // Create Y axis ticks
    const yTicks = y.ticks(5);
    yTicks.forEach(tick => {
        const tickElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tickElement.setAttribute("x", -10);
        tickElement.setAttribute("y", y(tick));
        tickElement.setAttribute("text-anchor", "end");
        tickElement.setAttribute("dominant-baseline", "middle");
        tickElement.textContent = `₹${tick.toFixed(2)}`;
        yAxis.appendChild(tickElement);
        
        // Add grid line
        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", 0);
        gridLine.setAttribute("x2", innerWidth);
        gridLine.setAttribute("y1", y(tick));
        gridLine.setAttribute("y2", y(tick));
        gridLine.setAttribute("stroke", "#e5e7eb");
        gridLine.setAttribute("stroke-dasharray", "3 3");
        g.appendChild(gridLine);
    });
    
    // Draw the chart based on chart type
    if (currentChartType === 'line') {
        // Create line path
        const line = d3.line()
            .x(d => x(d.date) + x.bandwidth() / 2)
            .y(d => y(d.price));
            
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", line(data));
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#6366f1");
        path.setAttribute("stroke-width", "2");
        g.appendChild(path);
    } else if (currentChartType === 'area') {
        // Create area path
        const area = d3.area()
            .x(d => x(d.date) + x.bandwidth() / 2)
            .y0(innerHeight)
            .y1(d => y(d.price));
            
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", area(data));
        path.setAttribute("fill", "#818cf8");
        path.setAttribute("fill-opacity", "0.3");
        path.setAttribute("stroke", "#6366f1");
        path.setAttribute("stroke-width", "2");
        g.appendChild(path);
    } else if (currentChartType === 'bar') {
        // Draw bars for volume
        data.forEach(d => {
            const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bar.setAttribute("x", x(d.date));
            bar.setAttribute("y", y(d.volume / 1000000)); // Scale down volume
            bar.setAttribute("width", x.bandwidth());
            bar.setAttribute("height", innerHeight - y(d.volume / 1000000));
            bar.setAttribute("fill", "#818cf8");
            g.appendChild(bar);
        });
    }
    
    // Add tooltip functionality
    const tooltip = document.createElement("div");
    tooltip.className = "chart-tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.display = "none";
    tooltip.style.backgroundColor = "white";
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.padding = "10px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
    tooltip.style.pointerEvents = "none";
    priceChartContainer.appendChild(tooltip);
    
    const overlay = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    overlay.setAttribute("width", innerWidth);
    overlay.setAttribute("height", innerHeight);
    overlay.setAttribute("fill", "none");
    overlay.setAttribute("pointer-events", "all");
    g.appendChild(overlay);
    
    // Add mouse events for tooltip
    overlay.addEventListener("mousemove", function(event) {
        const mouseX = event.clientX - priceChartContainer.getBoundingClientRect().left - margin.left;
        const index = Math.floor(mouseX / (innerWidth / data.length));
        
        if (index >= 0 && index < data.length) {
            const d = data[index];
            
            tooltip.style.display = "block";
            tooltip.style.left = (event.clientX - priceChartContainer.getBoundingClientRect().left + 10) + "px";
            tooltip.style.top = (event.clientY - priceChartContainer.getBoundingClientRect().top - 40) + "px";
            
            tooltip.innerHTML = `
                <div><strong>Date:</strong> ${d.date}</div>
                <div><strong>Price:</strong> ₹${d.price.toFixed(2)}</div>
                <div><strong>Open:</strong> ₹${d.open.toFixed(2)}</div>
                <div><strong>High:</strong> ₹${d.high.toFixed(2)}</div>
                <div><strong>Low:</strong> ₹${d.low.toFixed(2)}</div>
                <div><strong>Close:</strong> ₹${d.close.toFixed(2)}</div>
                <div><strong>Volume:</strong> ${formatVolume(d.volume)}</div>
            `;
        }
    });
    
    overlay.addEventListener("mouseout", function() {
        tooltip.style.display = "none";
    });
}

// Render volume chart
function renderVolumeChart(data) {
    // Check if we can use D3
    if (typeof d3 === 'undefined') {
        volumeChartContainer.innerHTML = '<div class="error-message">Chart library not loaded. Please try refreshing the page.</div>';
        return;
    }
    
    // Clear container
    volumeChartContainer.innerHTML = '';
    
    // Create SVG element
    const width = volumeChartContainer.clientWidth;
    const height = 200;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    volumeChartContainer.appendChild(svg);
    
    // Set margins
    const margin = {top: 20, right: 30, bottom: 30, left: 60};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create group element to apply margins
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // Create X scale
    const x = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0, innerWidth])
        .padding(0.1);
    
    // Create Y scale for volume
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.volume)])
        .range([innerHeight, 0]);
    
    // Create X axis
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
    xAxis.setAttribute("transform", `translate(0,${innerHeight})`);
    xAxis.style.fontSize = "12px";
    g.appendChild(xAxis);
    
    // Create X axis ticks
    data.forEach((d, i) => {
        // Show fewer ticks on the x-axis for clarity
        if (i % Math.ceil(data.length / 10) === 0) {
            const tick = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tick.setAttribute("x", x(d.date) + x.bandwidth() / 2);
            tick.setAttribute("y", 20);
            tick.setAttribute("text-anchor", "middle");
            tick.textContent = d.date;
            xAxis.appendChild(tick);
        }
    });
    
    // Create Y axis
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
    yAxis.style.fontSize = "12px";
    g.appendChild(yAxis);
    
    // Create Y axis ticks
    const yTicks = y.ticks(5);
    yTicks.forEach(tick => {
        const tickElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tickElement.setAttribute("x", -10);
        tickElement.setAttribute("y", y(tick));
        tickElement.setAttribute("text-anchor", "end");
        tickElement.setAttribute("dominant-baseline", "middle");
        tickElement.textContent = formatVolume(tick);
        yAxis.appendChild(tickElement);
        
        // Add grid line
        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", 0);
        gridLine.setAttribute("x2", innerWidth);
        gridLine.setAttribute("y1", y(tick));
        gridLine.setAttribute("y2", y(tick));
        gridLine.setAttribute("stroke", "#e5e7eb");
        gridLine.setAttribute("stroke-dasharray", "3 3");
        g.appendChild(gridLine);
    });
    
    // Draw volume bars
    data.forEach(d => {
        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.setAttribute("x", x(d.date));
        bar.setAttribute("y", y(d.volume));
        bar.setAttribute("width", x.bandwidth());
        bar.setAttribute("height", innerHeight - y(d.volume));
        bar.setAttribute("fill", "#818cf8");
        g.appendChild(bar);
    });
}

// Event listeners
symbolSelect.addEventListener('change', function() {
    currentSymbol = this.value;
    updateURL();
    loadStockData();
});

exchangeSelect.addEventListener('change', function() {
    currentExchange = this.value;
    updateURL();
    loadStockData();
});

chartTypeSelect.addEventListener('change', function() {
    currentChartType = this.value;
    renderPriceChart(stockData);
});

timeframeButtons.forEach(button => {
    button.addEventListener('click', function() {
        timeframeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentTimeframe = this.dataset.timeframe;
        updateURL();
        loadStockData();
    });
});

// Update URL with current parameters
function updateURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('symbol', currentSymbol);
    url.searchParams.set('exchange', currentExchange);
    url.searchParams.set('timeframe', currentTimeframe);
    window.history.replaceState({}, '', url);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initPage);
