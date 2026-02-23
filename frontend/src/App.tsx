

import { WalletDashboard } from './components/WalletDashboard';
import { TransactionHistory } from './components/TransactionHistory';
import './App.css';

function App() {
  // Demo userId for now; replace with real auth/user context as needed
  const userId = 'demo-user';
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img src="/logo192.png" alt="TCW1 Logo" className="app-logo" />
          <div className="title-block">
            <h1>TCW1 Wallet</h1>
            <span className="subtitle">Crypto, PayPal & Banking in one place</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        <WalletDashboard userId={userId} />
        <TransactionHistory userId={userId} refresh={0} />
      </main>
    </div>
  );
}

export default App;
