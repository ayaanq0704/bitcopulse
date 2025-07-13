
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bitcoin, TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.29.23:5000';

interface PriceData {
  id: number;
  timestamp: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
}

interface CurrentPrice {
  price: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  last_updated: string;
}

const Index = () => {
  const [currentPrice, setCurrentPrice] = useState<CurrentPrice | null>(null);
  const [historicalData, setHistoricalData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCurrentPrice = async () => {
    try {
      setIsRefreshing(true);
      const response = await axios.get(`${API_BASE_URL}/api/data`);
      setCurrentPrice(response.data);
      setLastRefresh(new Date());
      console.log('Current price fetched:', response.data);
    } catch (error) {
      console.error('Error fetching current price:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/history`);
      setHistoricalData(response.data);
      console.log('Historical data fetched:', response.data.length, 'points');
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchCurrentPrice(), fetchHistoricalData()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchCurrentPrice();
      fetchHistoricalData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return formatPrice(num);
  };

  const formatChartData = (data: PriceData[]) => {
    return data.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      price: item.price,
      fullTime: new Date(item.timestamp).toLocaleString(),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Bitcoin data...</p>
        </div>
      </div>
    );
  }

  const priceChange = currentPrice?.price_change_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bitcoin className="h-10 w-10 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Bitcoin Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Real-time cryptocurrency analytics</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isRefreshing}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Current Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Bitcoin className="h-4 w-4" />
                Bitcoin Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {currentPrice ? formatPrice(currentPrice.price) : '--'}
              </div>
              {currentPrice && (
                <div className="flex items-center mt-2">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <Badge
                    variant={isPositive ? "default" : "destructive"}
                    className={isPositive ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {currentPrice ? formatLargeNumber(currentPrice.market_cap) : '--'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total market value</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {currentPrice ? formatLargeNumber(currentPrice.volume_24h) : '--'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Trading volume</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {historicalData.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Historical records</p>
            </CardContent>
          </Card>
        </div>

        {/* Price Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Price History
            </CardTitle>
            <p className="text-sm text-gray-600">Bitcoin price over time (last 20 data points)</p>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              {historicalData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData(historicalData)}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#orange' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#orange' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #fb923c',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: any, name: string) => [
                        formatPrice(value),
                        'Bitcoin Price'
                      ]}
                      labelFormatter={(label: string, payload: any) => {
                        return payload && payload[0] ? payload[0].payload.fullTime : label;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No historical data available</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-orange-200">
          <p className="text-gray-500 text-sm">
            Data provided by CoinGecko API • Updates every 30 seconds
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Built with React, Flask, and PostgreSQL
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
