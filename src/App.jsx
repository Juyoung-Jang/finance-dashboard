import './styles/App.css';
import StockForm from './components/StockForm';
import StockList from './components/StockList';

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Finance Dashboard</h1>
      <StockForm />
      <StockList />
    </div>
  );
}

export default App;
