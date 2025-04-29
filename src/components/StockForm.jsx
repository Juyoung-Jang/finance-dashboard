import { useState, useContext } from 'react';
import { StockContext } from '../context/StockContext.jsx';

const StockForm = () => {
  const { stocks, setStocks } = useContext(StockContext);

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!symbol || !quantity || !purchasePrice) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const apiKey = '1A450JWQE2QQX4MI'; // 🔥 Replace with your real AlphaVantage API key
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
      const data = await response.json();

      // Check if the symbol is valid
      if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
        setError('Invalid stock symbol.');
        return;
      }

      const currentPrice = parseFloat(data["Global Quote"]["05. price"]);

      const newStock = {
        symbol: symbol.toUpperCase(),
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
        currentPrice: currentPrice,
      };

      setStocks([...stocks, newStock]);
      // Clear form fields
      setSymbol('');
      setQuantity('');
      setPurchasePrice('');
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Error fetching stock data.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stock-form">
      <h2>Add a Stock</h2>

      <input
        type="text"
        placeholder="Stock Symbol (e.g., AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Purchase Price"
        value={purchasePrice}
        onChange={(e) => setPurchasePrice(e.target.value)}
      />

      <button type="submit">Add Stock</button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default StockForm;
