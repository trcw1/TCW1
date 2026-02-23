


import { WalletDashboard } from './components/WalletDashboard';
import { TransactionHistory } from './components/TransactionHistory';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  // Demo userId for now; replace with real auth/user context as needed
  const userId = 'demo-user';
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img src="/logo.svg" alt="tcw1 logo" className="app-logo" />
          <div className="title-block">
            <h1>tcw1</h1>
          </div>
        </div>
      </header>
      <main className="app-main">
        <WalletDashboard userId={userId} />
        <TransactionHistory userId={userId} refresh={0} />
      </main>
      <BottomNav />
    </div>
  );
}

export default App;
