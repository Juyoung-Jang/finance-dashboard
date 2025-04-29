import { useContext, useEffect } from 'react';
import { StockContext } from '../context/StockContext';
import useFetchStock from '../hooks/useFetchStock';

const StockList = () => {
  const { stocks, setStocks } = useContext(StockContext);
  const { fetchStock } = useFetchStock();

  useEffect(() => {
    const updatePrices = async () => {
      const apiKey = '1A450JWQE2QQX4MI';

      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          const newPrice = await fetchStock(stock.symbol, apiKey);
          return {
            ...stock,
            currentPrice: newPrice ?? stock.currentPrice, // fallback to old price if API fails
          };
        })
      );

      setStocks(updatedStocks);
    };

    if (stocks.length > 0) {
      updatePrices();
    }
  }, [stocks.length]); // re-run only when number of stocks changes

  if (stocks.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>No stocks available.</p>;
  }

  return (
    <div className="stock-list">
      <h2>Stock Portfolio</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Qty</th>
            <th>Purchase Price</th>
            <th>Current Price</th>
            <th>Profit / Loss</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => {
            const profit = (stock.currentPrice - stock.purchasePrice) * stock.quantity;
            const profitStyle = {
              color: profit >= 0 ? 'green' : 'red',
              fontWeight: 'bold',
            };

            return (
              <tr key={index}>
                <td>{stock.symbol}</td>
                <td>{stock.quantity}</td>
                <td>${stock.purchasePrice.toFixed(2)}</td>
                <td>${stock.currentPrice.toFixed(2)}</td>
                <td style={profitStyle}>
                  {profit >= 0 ? '+' : ''}
                  ${profit.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
