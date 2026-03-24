import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Bell, 
  ChevronRight,
  Wallet,
  Clock,
  ShieldCheck,
  PieChart as PieChartIcon,
  Download,
  Send,
  User,
  ExternalLink,
  Info,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { auth, db, onSnapshot, collection, doc, signOut, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../App';
import { toast } from 'sonner';

interface PortfolioData {
  netWorth: number;
  ytdPerformance: number;
  availableCash: number;
  riskScore: string;
  allocation: {
    equities: number;
    fixedIncome: number;
    alternatives: number;
    cash: number;
  };
}

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'credit' | 'debit';
  timestamp: any;
}

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  url: string;
  uploadedAt: any;
}

type ClientTab = 'overview' | 'performance' | 'holdings' | 'documents' | 'advisor';

const chartData = [
  { name: 'Jan', value: 4200000 },
  { name: 'Feb', value: 4350000 },
  { name: 'Mar', value: 4300000 },
  { name: 'Apr', value: 4450000 },
  { name: 'May', value: 4600000 },
  { name: 'Jun', value: 4580000 },
  { name: 'Jul', value: 4750000 },
];

const performanceData = [
  { name: '2019', return: 12.4 },
  { name: '2020', return: 18.2 },
  { name: '2021', return: 22.1 },
  { name: '2022', return: -8.4 },
  { name: '2023', return: 15.6 },
  { name: '2024', return: 8.2 },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ClientTab>('overview');
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const portfolioPath = `portfolios/${user.uid}`;
    const unsubscribePortfolio = onSnapshot(doc(db, portfolioPath), (snapshot) => {
      if (snapshot.exists()) {
        setPortfolio(snapshot.data() as PortfolioData);
      } else {
        // Mock data if none exists
        setPortfolio({
          netWorth: 4750000,
          ytdPerformance: 8.24,
          availableCash: 125000,
          riskScore: 'Moderate-Aggressive',
          allocation: { equities: 65, fixedIncome: 20, alternatives: 10, cash: 5 }
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, portfolioPath);
    });

    const transactionsPath = `transactions/${user.uid}/history`;
    const unsubscribeTransactions = onSnapshot(collection(db, transactionsPath), (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    }, (error) => {
      // If collection doesn't exist yet, it's fine
      setTransactions([
        { id: '1', title: 'Dividend Reinvestment', subtitle: 'Vanguard S&P 500', amount: 1240.50, type: 'credit', timestamp: { toDate: () => new Date() } },
        { id: '2', title: 'Quarterly Management Fee', subtitle: 'Fiduciary Services', amount: 3500.00, type: 'debit', timestamp: { toDate: () => new Date(Date.now() - 86400000 * 5) } },
        { id: '3', title: 'Cash Transfer', subtitle: 'Chase Bank Checking', amount: 15000.00, type: 'credit', timestamp: { toDate: () => new Date(Date.now() - 86400000 * 12) } },
      ]);
    });

    const documentsPath = `documents/${user.uid}/vault`;
    const unsubscribeDocuments = onSnapshot(collection(db, documentsPath), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
      setDocuments(docs.sort((a, b) => b.uploadedAt?.seconds - a.uploadedAt?.seconds));
    }, (error) => {
      setDocuments([
        { id: '1', title: 'Q2 2024 Performance Report', type: 'PDF', size: '2.4 MB', url: '#', uploadedAt: { toDate: () => new Date() } },
        { id: '2', title: '2023 Tax Consolidated 1099', type: 'PDF', size: '1.1 MB', url: '#', uploadedAt: { toDate: () => new Date(Date.now() - 86400000 * 60) } },
        { id: '3', title: 'Trust Agreement - Executed', type: 'PDF', size: '4.8 MB', url: '#', uploadedAt: { toDate: () => new Date(Date.now() - 86400000 * 365) } },
      ]);
    });

    return () => {
      unsubscribePortfolio();
      unsubscribeTransactions();
      unsubscribeDocuments();
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const allocationData = portfolio ? [
    { name: 'Equities', value: portfolio.allocation.equities, color: '#2c6183' },
    { name: 'Fixed Income', value: portfolio.allocation.fixedIncome, color: '#586331' },
    { name: 'Alternatives', value: portfolio.allocation.alternatives, color: '#3f5f78' },
    { name: 'Cash', value: portfolio.allocation.cash, color: '#bfcd8f' },
  ] : [];

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-headline text-2xl">Loading Portfolio...</div>;
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside className="w-72 bg-on-surface text-surface flex flex-col border-r border-outline-variant/10 sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="text-2xl font-headline font-semibold tracking-tight block">
            Heritage Trust
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-surface/40 mt-2">Private Client Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          />
          <SidebarItem 
            icon={<TrendingUp size={20} />} 
            label="Performance" 
            active={activeTab === 'performance'} 
            onClick={() => setActiveTab('performance')}
          />
          <SidebarItem 
            icon={<Wallet size={20} />} 
            label="Holdings" 
            active={activeTab === 'holdings'} 
            onClick={() => setActiveTab('holdings')}
          />
          <SidebarItem 
            icon={<FileText size={20} />} 
            label="Document Vault" 
            active={activeTab === 'documents'} 
            onClick={() => setActiveTab('documents')}
          />
          <SidebarItem 
            icon={<MessageSquare size={20} />} 
            label="Advisor Contact" 
            active={activeTab === 'advisor'} 
            onClick={() => setActiveTab('advisor')}
          />
        </nav>

        <div className="p-4 mt-auto border-t border-outline-variant/10">
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
          <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all text-surface/60 hover:text-surface hover:bg-surface/5">
            <LogOut size={20} />
            <span className="font-label text-sm tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-surface px-12 py-6 flex justify-between items-center border-b border-outline-variant/10 sticky top-0 z-20">
          <div>
            <h1 className="font-headline text-2xl text-on-surface">Welcome back, {user?.displayName?.split(' ')[0]}</h1>
            <p className="text-on-surface-variant text-sm font-body">Market is currently <span className="text-secondary font-semibold uppercase tracking-widest text-[10px]">Open</span></p>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-on-surface-variant hover:text-primary transition-colors p-2 bg-surface-container-low rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface">{user?.displayName}</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Private Client</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-semibold overflow-hidden">
                {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : user?.displayName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard 
                    label="Total Net Worth" 
                    value={portfolio ? `$${portfolio.netWorth.toLocaleString()}` : '$0.00'} 
                    change="+12.4%" 
                    trend="up" 
                    icon={<Wallet className="text-primary" />}
                  />
                  <StatCard 
                    label="YTD Performance" 
                    value={portfolio ? `${portfolio.ytdPerformance}%` : '0.00%'} 
                    change="+1.2%" 
                    trend="up" 
                    icon={<TrendingUp className="text-secondary" />}
                  />
                  <StatCard 
                    label="Available Cash" 
                    value={portfolio ? `$${portfolio.availableCash.toLocaleString()}` : '$0.00'} 
                    change="-2.4%" 
                    trend="down" 
                    icon={<Clock className="text-tertiary" />}
                  />
                  <StatCard 
                    label="Risk Profile" 
                    value={portfolio?.riskScore || 'Moderate'} 
                    change="Stable" 
                    trend="neutral" 
                    icon={<ShieldCheck className="text-on-surface" />}
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-surface p-8 rounded-sm shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="font-headline text-xl">Portfolio Growth</h3>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-surface-container-low text-[10px] font-label uppercase tracking-widest rounded-sm border border-outline-variant/10">1M</button>
                        <button className="px-3 py-1 bg-primary text-on-primary text-[10px] font-label uppercase tracking-widest rounded-sm">6M</button>
                        <button className="px-3 py-1 bg-surface-container-low text-[10px] font-label uppercase tracking-widest rounded-sm border border-outline-variant/10">YTD</button>
                      </div>
                    </div>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2c6183" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#2c6183" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e2e1" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#71787e', fontSize: 12 }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#71787e', fontSize: 12 }}
                            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fcf9f8', border: '1px solid #e5e2e1', borderRadius: '4px' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2c6183" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-surface p-8 rounded-sm shadow-sm border border-outline-variant/10">
                    <h3 className="font-headline text-xl mb-8">Asset Allocation</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={allocationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {allocationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-4">
                      {allocationData.map((item) => (
                        <div key={item.name} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm font-body text-on-surface-variant">{item.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-on-surface">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity & Documents */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-surface p-8 rounded-sm shadow-sm border border-outline-variant/10">
                    <h3 className="font-headline text-xl mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                      {transactions.length > 0 ? transactions.slice(0, 4).map(tx => (
                        <TransactionItem 
                          key={tx.id}
                          title={tx.title} 
                          subtitle={tx.subtitle} 
                          amount={`${tx.type === 'credit' ? '+' : '-'}$${tx.amount.toLocaleString()}`} 
                          date={tx.timestamp?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        />
                      )) : (
                        <p className="text-on-surface-variant text-sm italic">No recent transactions found.</p>
                      )}
                    </div>
                    <button onClick={() => setActiveTab('performance')} className="w-full mt-8 py-3 border border-outline-variant/30 text-primary font-label text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors">
                      View Full History
                    </button>
                  </div>

                  <div className="bg-surface p-8 rounded-sm shadow-sm border border-outline-variant/10">
                    <h3 className="font-headline text-xl mb-6">Vault Updates</h3>
                    <div className="space-y-4">
                      {documents.length > 0 ? documents.slice(0, 4).map(doc => (
                        <DocumentItem 
                          key={doc.id}
                          title={doc.title} 
                          type={doc.type} 
                          size={doc.size} 
                        />
                      )) : (
                        <p className="text-on-surface-variant text-sm italic">No recent documents found.</p>
                      )}
                    </div>
                    <button onClick={() => setActiveTab('documents')} className="w-full mt-8 py-3 border border-outline-variant/30 text-primary font-label text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors">
                      Access Document Vault
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div 
                key="performance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-surface p-8 rounded-sm border border-outline-variant/10 shadow-sm">
                  <h3 className="font-headline text-2xl mb-8">Historical Returns</h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e2e1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <Tooltip cursor={{ fill: '#f6f3f2' }} />
                        <Bar dataKey="return" fill="#2c6183" radius={[4, 4, 0, 0]}>
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.return > 0 ? '#2c6183' : '#ba1a1a'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <PerformanceMetric label="Alpha" value="1.24" desc="Excess return vs benchmark" />
                  <PerformanceMetric label="Sharpe Ratio" value="1.85" desc="Risk-adjusted return" />
                  <PerformanceMetric label="Standard Deviation" value="12.4%" desc="Portfolio volatility" />
                </div>
              </motion.div>
            )}

            {activeTab === 'holdings' && (
              <motion.div 
                key="holdings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="bg-surface rounded-sm border border-outline-variant/10 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                    <h3 className="font-headline text-2xl">Current Holdings</h3>
                    <button className="flex items-center gap-2 text-primary font-label text-[10px] uppercase tracking-widest border border-primary/30 px-4 py-2 rounded-sm hover:bg-primary/5 transition-colors">
                      <Download size={14} /> Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low">
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Asset Name</th>
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Category</th>
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Allocation</th>
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Current Value</th>
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Gain/Loss</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        <HoldingRow name="Vanguard S&P 500 ETF" category="Equity" allocation="24.5%" value="$1,163,750" change="+18.4%" />
                        <HoldingRow name="Apple Inc. (AAPL)" category="Equity" allocation="12.2%" value="$579,500" change="+24.1%" />
                        <HoldingRow name="US Treasury 10Y Note" category="Fixed Income" allocation="15.0%" value="$712,500" change="-2.4%" />
                        <HoldingRow name="Blackstone Real Estate" category="Alternative" allocation="8.5%" value="$403,750" change="+5.2%" />
                        <HoldingRow name="Cash & Equivalents" category="Cash" allocation="5.0%" value="$237,500" change="--" />
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div 
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-headline text-2xl">Document Vault</h3>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={14} />
                      <input type="text" placeholder="Search documents..." className="bg-surface border border-outline-variant/20 rounded-sm py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    {documents.map(doc => (
                      <DocumentItem key={doc.id} title={doc.title} type={doc.type} size={doc.size} />
                    ))}
                  </div>
                  <div className="bg-on-surface text-surface p-8 rounded-sm shadow-xl">
                    <h4 className="font-headline text-xl mb-6">Upload Document</h4>
                    <div className="border-2 border-dashed border-surface/20 rounded-sm p-8 text-center hover:border-surface/40 transition-colors cursor-pointer">
                      <Download className="mx-auto mb-4 text-surface/40 rotate-180" size={32} />
                      <p className="text-sm font-body mb-2">Drag and drop files here</p>
                      <p className="text-[10px] text-surface/40 uppercase tracking-widest">Max size: 50MB</p>
                    </div>
                    <p className="mt-6 text-xs text-surface/60 leading-relaxed">
                      All documents are encrypted at rest and in transit. Your advisor will be notified of any uploads.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'advisor' && (
              <motion.div 
                key="advisor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-surface rounded-sm border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col h-[600px]">
                  <div className="p-6 bg-surface-container border-b border-outline-variant/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-semibold">
                        SJ
                      </div>
                      <div>
                        <h3 className="font-headline text-lg">Sarah Jenkins, CFA</h3>
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Online
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><Bell size={20} /></button>
                      <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><Settings size={20} /></button>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-surface-container-lowest">
                    <ChatMessage 
                      sender="Sarah Jenkins" 
                      text="Good morning! I've just uploaded your Q2 performance review to the vault. We're seeing strong growth in the alternative energy sector." 
                      time="10:15 AM"
                      isMe={false}
                    />
                    <ChatMessage 
                      sender="You" 
                      text="Thanks Sarah, I'll take a look. How are we positioned for the upcoming interest rate decision?" 
                      time="10:22 AM"
                      isMe={true}
                    />
                    <ChatMessage 
                      sender="Sarah Jenkins" 
                      text="We've slightly increased our short-duration fixed income exposure to mitigate volatility. I'd like to discuss this on our call next Tuesday." 
                      time="10:25 AM"
                      isMe={false}
                    />
                  </div>

                  <div className="p-6 border-t border-outline-variant/10 bg-surface">
                    <form className="flex gap-4" onSubmit={(e) => { e.preventDefault(); toast.info('Message sent to advisor'); setMessage(''); }}>
                      <input 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message to Sarah..." 
                        className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-sm py-3 px-4 focus:outline-none focus:border-primary transition-colors"
                      />
                      <button className="silk-gradient text-on-primary p-3 rounded-sm hover:opacity-90 transition-all">
                        <Send size={20} />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all ${active ? 'bg-primary text-on-primary shadow-lg' : 'text-surface/60 hover:text-surface hover:bg-surface/5'}`}
    >
      {icon}
      <span className="font-label text-sm tracking-wide">{label}</span>
    </button>
  );
}

function StatCard({ label, value, change, trend, icon }: { label: string, value: string, change: string, trend: 'up' | 'down' | 'neutral', icon: React.ReactNode }) {
  return (
    <div className="bg-surface p-6 rounded-sm shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-surface-container-low rounded-sm">
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-secondary/10 text-secondary' : 
          trend === 'down' ? 'bg-error/10 text-error' : 
          'bg-on-surface/10 text-on-surface'
        }`}>
          {change}
        </span>
      </div>
      <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-headline text-on-surface">{value}</h4>
    </div>
  );
}

function TransactionItem({ title, subtitle, amount, date }: { title: string, subtitle: string, amount: string, date: string }) {
  return (
    <div className="flex justify-between items-center group cursor-pointer">
      <div>
        <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{title}</p>
        <p className="text-xs text-on-surface-variant">{subtitle}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${amount.startsWith('+') ? 'text-secondary' : amount.startsWith('-') ? 'text-error' : 'text-on-surface'}`}>
          {amount}
        </p>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{date}</p>
      </div>
    </div>
  );
}

function DocumentItem({ title, type, size }: { title: string, type: string, size: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-sm hover:bg-surface-container transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-surface flex items-center justify-center text-primary border border-outline-variant/20">
          <FileText size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{title}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{type} • {size}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-outline-variant group-hover:text-primary transition-colors" />
    </div>
  );
}

function PerformanceMetric({ label, value, desc }: { label: string, value: string, desc: string }) {
  return (
    <div className="bg-surface p-6 rounded-sm border border-outline-variant/10">
      <div className="flex items-center gap-2 text-on-surface-variant mb-2">
        <Info size={14} />
        <p className="text-[10px] uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-3xl font-headline text-on-surface mb-1">{value}</p>
      <p className="text-xs text-on-surface-variant">{desc}</p>
    </div>
  );
}

function HoldingRow({ name, category, allocation, value, change }: { name: string, category: string, allocation: string, value: string, change: string }) {
  return (
    <tr className="hover:bg-surface-container-lowest transition-colors group">
      <td className="px-8 py-6">
        <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Ticker: {name.split('(')[1]?.replace(')', '') || 'N/A'}</span>
          <ExternalLink size={10} className="text-outline-variant" />
        </div>
      </td>
      <td className="px-8 py-6 text-sm text-on-surface-variant">{category}</td>
      <td className="px-8 py-6 text-sm font-semibold text-on-surface">{allocation}</td>
      <td className="px-8 py-6 text-sm font-body text-on-surface">{value}</td>
      <td className={`px-8 py-6 text-sm font-semibold ${change.startsWith('+') ? 'text-secondary' : change.startsWith('-') ? 'text-error' : 'text-on-surface'}`}>
        {change}
      </td>
    </tr>
  );
}

function ChatMessage({ sender, text, time, isMe }: { sender: string, text: string, time: string, isMe: boolean }) {
  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[80%] p-4 rounded-sm ${isMe ? 'bg-primary text-on-primary' : 'bg-surface border border-outline-variant/10 text-on-surface'}`}>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">{sender} • {time}</p>
    </div>
  );
}
