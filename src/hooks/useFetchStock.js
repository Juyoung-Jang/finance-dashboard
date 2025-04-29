import { useCallback, useState } from 'react';

const useFetchStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStock = useCallback(async (symbol, apiKey) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
      );

      const data = await response.json();

      if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
        throw new Error('Invalid stock symbol');
      }

      const currentPrice = parseFloat(data["Global Quote"]["05. price"]);
      return currentPrice;
    } catch (err) {
      setError(err.message || 'Error fetching data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchStock, loading, error };
};

export default useFetchStock;
