export interface AnalysisSettings {
  chart_analysis: {
    exchange: string;
    symbol: string;
    watchlist: string[]; // Array of "EXCHANGE:SYMBOLUSDT" pairs
  };
  symbol_overview_symbols: string[]; // Array of "EXCHANGE:SYMBOLUSDT" pairs
  enabled_charts: {
    trading_view: boolean;
    technical_analysis: boolean;
    symbol_overview: boolean;
    heatmap: boolean;
    top_stories: boolean;
    fundamental_data: boolean;
    economic_calendar: boolean;
    ticker_tape: boolean;
  };
  is_configured: boolean; // Flag to check if initial setup is done
}

// Helper function to format symbol pairs
export function formatSymbolPair(exchange: string, symbol: string): string {
  // Check if symbol already includes USDT and/or .P
  if (symbol.includes(':')) {
    return symbol; // Return as is if it's already in EXCHANGE:SYMBOLUSDT format
  }
  
  // Check if it's a perpetual symbol (ends with .P)
  const isPerpetual = symbol.toUpperCase().endsWith('.P');
  
  // Remove .P if it exists to clean the base symbol
  let cleanSymbol = symbol.replace(/\.P$/i, '').toUpperCase();
  
  // Format the symbol
  return `${exchange.toUpperCase()}:${cleanSymbol}USDT${isPerpetual ? '.P' : ''}`;
}

// Default settings
export const DEFAULT_ANALYSIS_SETTINGS: AnalysisSettings = {
  chart_analysis: {
    exchange: 'BINANCE',
    symbol: 'BTC',
    watchlist: [
      'BINANCE:BTCUSDT',
      'BINANCE:ETHUSDT',
      'BINANCE:BNBUSDT'
    ]
  },
  symbol_overview_symbols: [
    'BINANCE:BTCUSDT',
    'BINANCE:ETHUSDT',
    'BINANCE:BNBUSDT',
    'BINANCE:SOLUSDT',
    'BINANCE:DOGEUSDT',
    'BINANCE:ADAUSDT',
    'BINANCE:DOTUSDT',
    'BINANCE:MATICUSDT'
  ],
  enabled_charts: {
    trading_view: true,
    technical_analysis: true,
    symbol_overview: true,
    heatmap: true,
    top_stories: true,
    fundamental_data: true,
    economic_calendar: true,
    ticker_tape: true
  },
  is_configured: false
}; 