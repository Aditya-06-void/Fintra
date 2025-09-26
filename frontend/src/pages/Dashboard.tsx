import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CompanyData {
  "Global Quote": {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

interface IntradayMetaData {
  "1. Information": string;
  "2. Symbol": string;
  "3. Last Refreshed": string;
  "4. Interval": string;
  "5. Output Size": string;
  "6. Time Zone": string;
}

interface HistoricalData {
  "Meta Data": IntradayMetaData;
  "Time Series (5min)": Record<string, {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  }>;
}

export default function Dashboard() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  type ChartPoint = { time: string; price: number };
  const [historicalData, setHistoricalData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  type TimeSeriesItem = {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
  type TimeSeries = Record<string, TimeSeriesItem>;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch company quote
  const quoteResponse = await fetch('http://localhost:3000/company-quote/IBM');
  const quoteJson = await quoteResponse.json();
  // API wraps the actual quote under `data`
  setCompanyData(quoteJson?.data ?? null);

        // Fetch historical data
        const historicalResponse = await fetch('http://localhost:3000/company-intraday/IBM?interval=5min');
        const historicalJson = await historicalResponse.json();
        const series: TimeSeries | undefined =
          (historicalJson?.data?.["Time Series (5min)"] as TimeSeries | undefined) ??
          (historicalJson?.["Time Series (5min)"] as TimeSeries | undefined);

        if (series) {
          const chartData: ChartPoint[] = Object.entries(series)
            .slice(0, 50)
            .map(([timestamp, data]) => ({
              time: timestamp,
              price: parseFloat(data["4. close"]),
            }))
            .reverse();

          setHistoricalData(chartData);
        } else {
          console.warn('No intraday time series found in response.');
          setHistoricalData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading stock data...</div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Failed to load stock data</div>
      </div>
    );
  }

  const emptyQuote: CompanyData["Global Quote"] = {
    "01. symbol": "",
    "02. open": "",
    "03. high": "",
    "04. low": "",
    "05. price": "",
    "06. volume": "",
    "07. latest trading day": "",
    "08. previous close": "",
    "09. change": "",
    "10. change percent": "",
  };
  const quote = companyData?.["Global Quote"] ?? emptyQuote;
  const price = parseFloat(quote?.["05. price"] ?? "NaN");
  const change = parseFloat(quote?.["09. change"] ?? "NaN");
  const changePct = quote?.["10. change percent"] ?? "N/A";
  const openVal = parseFloat(quote?.["02. open"] ?? "NaN");
  const highVal = parseFloat(quote?.["03. high"] ?? "NaN");
  const lowVal = parseFloat(quote?.["04. low"] ?? "NaN");
  const volumeVal = parseInt(quote?.["06. volume"] ?? "NaN");
  const prevCloseVal = parseFloat(quote?.["08. previous close"] ?? "NaN");
  const latestDay = quote?.["07. latest trading day"] ?? "-";
  const symbol = quote?.["01. symbol"] ?? "N/A";
  const isPositive = isNaN(change) ? true : change >= 0;

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{symbol}</h1>
          <p className="text-muted-foreground">International Business Machines Corporation</p>
        </div>
        <Badge variant={isPositive ? "default" : "destructive"}>
          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {changePct}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(price) ? 'N/A' : `$${price.toFixed(2)}`}</div>
            <p className={`text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isNaN(change) ? '—' : change.toFixed(2)} ({changePct})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(openVal) ? 'N/A' : `$${openVal.toFixed(2)}`}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High / Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {isNaN(highVal) || isNaN(lowVal) ? 'N/A' : `$${highVal.toFixed(2)} / $${lowVal.toFixed(2)}`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isNaN(volumeVal) ? 'N/A' : volumeVal.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price Chart (5-minute intervals)</CardTitle>
          <CardDescription>
            Latest trading day: {latestDay}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-md">
                          <p className="font-medium">
                            {new Date(label).toLocaleString()}
                          </p>
                          <p className="text-primary">
                            Price: ${typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Previous Close:</span>
            <span>{isNaN(prevCloseVal) ? 'N/A' : `$${prevCloseVal.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Latest Trading Day:</span>
            <span>{latestDay}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}