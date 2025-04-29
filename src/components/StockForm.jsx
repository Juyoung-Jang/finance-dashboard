import { useState, useContext } from 'react';
import { StockContext } from '../context/StockContext.jsx';
import useFetchStock from '../hooks/useFetchStock';

const StockForm = () => {
  const { stocks, setStocks } = useContext(StockContext);

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [localError, setLocalError] = useState('');
  const { fetchStock, loading, error } = useFetchStock();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!symbol || !quantity || !purchasePrice) {
      setLocalError('Please fill in all fields.');
      return;
    }

    try {
      const apiKey = '1A450JWQE2QQX4MI';
      const currentPrice = await fetchStock(symbol, apiKey);

      if (currentPrice === null) {
        return;
      }

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

      {localError && <p className="error">{localError}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default StockForm;
