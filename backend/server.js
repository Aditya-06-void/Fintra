const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// API Key (you can make this environment variable later)
const API_KEY = 'UEVXVQ11P55TAM13';
const BASE_URL = 'https://www.alphavantage.co/query';

// Route 1: Get company quote data (requires symbol parameter)
app.get('/company-quote/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ 
                error: 'Symbol parameter is required' 
            });
        }

        const response = await axios.get(BASE_URL, {
            params: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol.toUpperCase(),
                apikey: API_KEY
            }
        });

        res.json({
            success: true,
            data: response.data,
            symbol: symbol.toUpperCase()
        });

    } catch (error) {
        console.error('Error fetching company quote:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch company quote data',
            message: error.message 
        });
    }
});

// Route 2: Get company news sentiment (requires symbol parameter)
app.get('/company-news/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        
        if (!symbol) {
            return res.status(400).json({ 
                error: 'Symbol parameter is required' 
            });
        }

        const response = await axios.get(BASE_URL, {
            params: {
                function: 'NEWS_SENTIMENT',
                tickers: symbol.toUpperCase(),
                apikey: API_KEY
            }
        });

        res.json({
            success: true,
            data: response.data,
            symbol: symbol.toUpperCase()
        });

    } catch (error) {
        console.error('Error fetching company news:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch company news data',
            message: error.message 
        });
    }
});

// Route 3: Get company intraday time series data (requires symbol parameter)
app.get('/company-intraday/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = '5min' } = req.query; // Default to 5min interval
        
        if (!symbol) {
            return res.status(400).json({ 
                error: 'Symbol parameter is required' 
            });
        }

        // Validate interval parameter
        const validIntervals = ['1min', '5min', '15min', '30min', '60min'];
        if (!validIntervals.includes(interval)) {
            return res.status(400).json({ 
                error: 'Invalid interval. Valid intervals: ' + validIntervals.join(', ')
            });
        }

        const response = await axios.get(BASE_URL, {
            params: {
                function: 'TIME_SERIES_INTRADAY',
                symbol: symbol.toUpperCase(),
                interval: interval,
                apikey: API_KEY
            }
        });

        res.json({
            success: true,
            data: response.data,
            symbol: symbol.toUpperCase(),
            interval: interval
        });

    } catch (error) {
        console.error('Error fetching company intraday data:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch company intraday data',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Fintra API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Fintra API',
        version: '1.0.0',
        endpoints: {
            '/health': 'Health check endpoint',
            '/company-quote/:symbol': 'Get company quote data (GLOBAL_QUOTE)',
            '/company-news/:symbol': 'Get company news sentiment',
            '/company-intraday/:symbol': 'Get company intraday time series data',
        },
        examples: {
            quote: '/company-quote/IBM',
            news: '/company-news/IBM',
            intraday: '/company-intraday/IBM?interval=5min'
        },
        note: 'Replace :symbol with actual stock symbol (e.g., IBM, AAPL, GOOGL)'
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ 
        error: 'Route not found',
        availableRoutes: [
            '/health',
            '/company-quote/:symbol',
            '/company-news/:symbol', 
            '/company-intraday/:symbol'
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Fintra API Server is running on port ${PORT}`);
    console.log(`📊 Available endpoints:`);
    console.log(`   GET  /health - Health check`);
    console.log(`   GET  /company-quote/:symbol - Get company quote`);
    console.log(`   GET  /company-news/:symbol - Get company news`);
    console.log(`   GET  /company-intraday/:symbol - Get intraday data`);
    console.log(`\n💡 Example usage:`);
    console.log(`   http://localhost:${PORT}/company-quote/IBM`);
    console.log(`   http://localhost:${PORT}/company-news/IBM`);
    console.log(`   http://localhost:${PORT}/company-intraday/IBM?interval=5min`);
});

module.exports = app;