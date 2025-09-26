import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface NewsItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Array<{
    topic: string;
    relevance_score: string;
  }>;
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: Array<{
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }>;
}

interface NewsResponse {
  items: string;
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: NewsItem[];
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const parseAVTime = (raw: string): Date => {
    // Alpha Vantage time_published: YYYYMMDDThhmmss (e.g., 20250925T204201)
    if (!raw || raw.length < 15) return new Date(NaN);
    const year = Number(raw.slice(0, 4));
    const month = Number(raw.slice(4, 6)) - 1; // 0-based
    const day = Number(raw.slice(6, 8));
    const hour = Number(raw.slice(9, 11));
    const min = Number(raw.slice(11, 13));
    const sec = Number(raw.slice(13, 15));
    return new Date(year, month, day, hour, min, sec);
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/company-news/IBM');
        const json = await response.json();
        // Support both wrapped and unwrapped payloads
        const payload: NewsResponse | undefined = json?.data ?? json;
        setNews(payload?.feed ?? []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getSentimentColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'bullish':
      case 'somewhat-bullish':
        return 'bg-success text-success-foreground';
      case 'bearish':
      case 'somewhat-bearish':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market News</h1>
        <p className="text-muted-foreground">Latest news and analysis for IBM and related topics</p>
      </div>

      <div className="grid gap-6">
        {news.map((article, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {article.banner_image && (
                <div className="md:w-1/3">
                  <img
                    src={article.banner_image}
                    alt={article.title}
                    className="w-full h-48 md:h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex-1">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">{article.source}</Badge>
                    {(article.topics ?? []).slice(0, 2).map((topic, i) => (
                      <Badge key={i} variant="secondary">
                        {topic.topic}
                      </Badge>
                    ))}
                    <Badge className={getSentimentColor(article.overall_sentiment_label)}>
                      {article.overall_sentiment_label}
                    </Badge>
                  </div>
                  
                  <CardTitle className="line-clamp-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-start gap-2"
                    >
                      {article.title}
                      <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0" />
                    </a>
                  </CardTitle>
                  
                  <CardDescription>
                    By {(article.authors ?? []).join(', ')} • {(() => {
                      const d = parseAVTime(article.time_published);
                      return isNaN(d.getTime()) ? '—' : d.toLocaleString();
                    })()}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm mb-4 line-clamp-3">{article.summary}</p>
                  
                  {(article.ticker_sentiment ?? []).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Ticker Sentiment:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(article.ticker_sentiment ?? []).map((ticker, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <Badge variant="outline">{ticker.ticker}</Badge>
                            <span className="text-muted-foreground">
                              {parseFloat(ticker.relevance_score).toFixed(2)}
                            </span>
                            <Badge 
                              className={getSentimentColor(ticker.ticker_sentiment_label)}
                            >
                              {ticker.ticker_sentiment_label}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}