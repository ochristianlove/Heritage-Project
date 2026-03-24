import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  MoreVertical, 
  ShieldCheck, 
  TrendingUp, 
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Palette,
  Newspaper,
  Image as ImageIcon,
  Briefcase,
  ChevronRight,
  Save,
  Trash2,
  Edit3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, onSnapshot, collection, query, orderBy, limit, signOut, handleFirestoreError, OperationType, where } from '../firebase';
import { useAuth } from '../App';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string;
  role: string;
  assets?: string;
  status: string;
  advisor: string;
  lastLogin: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: any;
  isAlert?: boolean;
}

type AdminTab = 'overview' | 'clients' | 'content' | 'assets' | 'compliance';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Content Management State
  const [siteSettings, setSiteSettings] = useState({
    logoName: 'Heritage Trust',
    primaryColor: '#2c6183',
    secondaryColor: '#586331',
    announcement: 'Celebrating 100 years of fiduciary excellence.'
  });

  useEffect(() => {
    if (!user) return;

    const clientsPath = 'users';
    const unsubscribeClients = onSnapshot(query(collection(db, clientsPath), where('role', '==', 'client')), (snapshot) => {
      const clientList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || 'Unnamed Client',
          email: data.email,
          role: data.role,
          status: 'Active',
          advisor: 'Sarah Jenkins',
          lastLogin: 'Recent',
          assets: '$' + (Math.random() * 10000000).toLocaleString(undefined, { maximumFractionDigits: 0 })
        };
      });
      setClients(clientList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, clientsPath);
    });

    const activityPath = 'system/activity';
    const unsubscribeActivity = onSnapshot(query(collection(db, activityPath), orderBy('timestamp', 'desc'), limit(10)), (snapshot) => {
      const activityList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
      setActivities(activityList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, activityPath);
    });

    return () => {
      unsubscribeClients();
      unsubscribeActivity();
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

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-headline text-2xl">Loading Admin Console...</div>;
  }

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside className="w-72 bg-on-surface text-surface flex flex-col border-r border-outline-variant/10 sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="text-2xl font-headline font-semibold tracking-tight block">
            {siteSettings.logoName}
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-surface/40 mt-2">Admin Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Client Directory" 
            active={activeTab === 'clients'} 
            onClick={() => setActiveTab('clients')}
          />
          <SidebarItem 
            icon={<Briefcase size={20} />} 
            label="Client Assets" 
            active={activeTab === 'assets'} 
            onClick={() => setActiveTab('assets')}
          />
          <SidebarItem 
            icon={<Palette size={20} />} 
            label="Design & Content" 
            active={activeTab === 'content'} 
            onClick={() => setActiveTab('content')}
          />
          <SidebarItem 
            icon={<FileText size={20} />} 
            label="Compliance" 
            active={activeTab === 'compliance'} 
            onClick={() => setActiveTab('compliance')}
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
          <div className="flex items-center gap-8 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
              <input 
                type="text" 
                placeholder="Search console..." 
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors font-body text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low rounded-sm">
                <Bell size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface">{user?.displayName}</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Senior Fiduciary</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-semibold overflow-hidden">
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <AdminStatCard label="Total AUM" value="$1.24B" change="+4.2%" trend="up" />
                  <AdminStatCard label="Active Clients" value={clients.length.toString()} change="+12" trend="up" />
                  <AdminStatCard label="Pending Approvals" value="8" change="-2" trend="down" />
                  <AdminStatCard label="Compliance Score" value="98%" change="Stable" trend="neutral" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-surface p-8 rounded-sm shadow-sm border border-outline-variant/10">
                    <h3 className="font-headline text-xl mb-6">Recent System Activity</h3>
                    <div className="space-y-6">
                      {activities.length > 0 ? activities.map(activity => (
                        <ActivityItem 
                          key={activity.id}
                          user={activity.user} 
                          action={activity.action} 
                          target={activity.target} 
                          time={activity.timestamp?.toDate().toLocaleTimeString()} 
                          alert={activity.isAlert}
                        />
                      )) : (
                        <p className="text-on-surface-variant text-sm italic">No recent activity logged.</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-on-surface text-surface p-8 rounded-sm shadow-xl">
                    <h3 className="font-headline text-xl mb-6">Critical Tasks</h3>
                    <div className="space-y-6">
                      <TaskItem title="Review Q3 Disclosures" deadline="Oct 30" priority="High" />
                      <TaskItem title="Annual AML Certification" deadline="Nov 15" priority="Critical" />
                      <TaskItem title="Client KYC Refresh" deadline="Dec 01" priority="Medium" />
                    </div>
                    <button className="w-full mt-10 py-3 bg-surface text-on-surface font-label text-xs uppercase tracking-widest hover:bg-surface-bright transition-colors">
                      View All Tasks
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'clients' && (
              <motion.div 
                key="clients"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="bg-surface rounded-sm shadow-sm border border-outline-variant/10 overflow-hidden">
                  <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                    <div>
                      <h3 className="font-headline text-2xl text-on-surface">Client Directory</h3>
                      <p className="text-sm text-on-surface-variant font-body">Manage and monitor all trust accounts.</p>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 px-6 py-2 silk-gradient text-on-primary font-label text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                        <Plus size={14} /> Add New Client
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low">
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Client Name</th>
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Assets</th>
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Advisor</th>
                          <th className="px-8 py-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {filteredClients.map((client) => (
                          <tr key={client.id} className="hover:bg-surface-container-lowest transition-colors group">
                            <td className="px-8 py-6">
                              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{client.name}</p>
                              <p className="text-xs text-on-surface-variant">{client.email}</p>
                            </td>
                            <td className="px-8 py-6 text-sm font-body text-on-surface">{client.assets}</td>
                            <td className="px-8 py-6">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-secondary/10 text-secondary">
                                <CheckCircle2 size={10} /> Active
                              </span>
                            </td>
                            <td className="px-8 py-6 text-sm text-on-surface">{client.advisor}</td>
                            <td className="px-8 py-6">
                              <div className="flex gap-2">
                                <button className="p-2 text-outline-variant hover:text-primary transition-colors"><Edit3 size={16} /></button>
                                <button className="p-2 text-outline-variant hover:text-error transition-colors"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                {/* Branding Management */}
                <div className="bg-surface p-8 rounded-sm shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-8">
                    <Palette className="text-primary" size={24} />
                    <h3 className="font-headline text-2xl">Branding & Design</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Institution Name (Logo)</label>
                      <input 
                        type="text" 
                        value={siteSettings.logoName}
                        onChange={(e) => setSiteSettings({...siteSettings, logoName: e.target.value})}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm py-3 px-4 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Primary Color</label>
                        <div className="flex gap-3">
                          <input type="color" value={siteSettings.primaryColor} className="w-12 h-12 rounded-sm cursor-pointer" />
                          <input type="text" value={siteSettings.primaryColor} className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-sm px-4" />
                        </div>
                      </div>
                      <div>
                        <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Secondary Color</label>
                        <div className="flex gap-3">
                          <input type="color" value={siteSettings.secondaryColor} className="w-12 h-12 rounded-sm cursor-pointer" />
                          <input type="text" value={siteSettings.secondaryColor} className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-sm px-4" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Global Announcement</label>
                      <textarea 
                        value={siteSettings.announcement}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-sm py-3 px-4 h-24 focus:outline-none focus:border-primary transition-colors"
                      ></textarea>
                    </div>
                    <button className="silk-gradient text-on-primary w-full py-4 rounded-sm font-label text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </div>

                {/* Blog/Insights Management */}
                <div className="bg-surface p-8 rounded-sm shadow-sm border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Newspaper className="text-primary" size={24} />
                      <h3 className="font-headline text-2xl">Insights & Blogs</h3>
                    </div>
                    <button className="text-primary font-label text-[10px] uppercase tracking-widest border border-primary/30 px-4 py-2 hover:bg-primary/5 transition-colors">
                      New Post
                    </button>
                  </div>
                  <div className="space-y-4">
                    <BlogPostItem title="2024 Mid-Year Economic Forecast" status="Published" date="June 12, 2024" />
                    <BlogPostItem title="The Art of The Family Meeting" status="Published" date="May 28, 2024" />
                    <BlogPostItem title="Strategic Giving: Impact Beyond..." status="Draft" date="In Progress" />
                    <BlogPostItem title="Estate Planning in a Digital Age" status="Scheduled" date="July 15, 2024" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'assets' && (
              <motion.div 
                key="assets"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-surface p-8 rounded-sm shadow-sm border border-outline-variant/10">
                  <h3 className="font-headline text-2xl mb-8">Aggregate Asset Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 h-[400px] bg-surface-container-low rounded-sm flex items-center justify-center text-outline-variant italic">
                      [Interactive AUM Heatmap Visualization]
                    </div>
                    <div className="space-y-6">
                      <h4 className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Asset Class Breakdown</h4>
                      <AssetClassItem label="Domestic Equities" value="42%" color="#2c6183" />
                      <AssetClassItem label="Fixed Income" value="28%" color="#586331" />
                      <AssetClassItem label="International Equities" value="15%" color="#3f5f78" />
                      <AssetClassItem label="Alternatives" value="10%" color="#bfcd8f" />
                      <AssetClassItem label="Cash & Equivalents" value="5%" color="#e5e2e1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'compliance' && (
              <motion.div 
                key="compliance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-surface p-8 rounded-sm border border-outline-variant/10 shadow-sm">
                    <h3 className="font-headline text-xl mb-6">Audit Trail</h3>
                    <div className="space-y-4">
                      <AuditItem action="User Login" user="john.doe@example.com" status="Success" time="2 mins ago" />
                      <AuditItem action="Document Download" user="admin_sj" status="Success" time="15 mins ago" />
                      <AuditItem action="Portfolio Update" user="system" status="Success" time="1 hour ago" />
                      <AuditItem action="Failed Login" user="unknown" status="Failed" time="3 hours ago" />
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-surface p-8 rounded-sm border border-outline-variant/10 shadow-sm">
                    <h3 className="font-headline text-xl mb-6">KYC/AML Status Overview</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 bg-surface-container-low rounded-sm">
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Pending KYC Reviews</p>
                        <p className="text-4xl font-headline text-primary">14</p>
                      </div>
                      <div className="p-6 bg-surface-container-low rounded-sm">
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Expiring Documents (30d)</p>
                        <p className="text-4xl font-headline text-secondary">23</p>
                      </div>
                    </div>
                    <button className="w-full mt-8 py-4 border border-primary/30 text-primary font-label text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors">
                      Launch Compliance Audit Tool
                    </button>
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

function AdminStatCard({ label, value, change, trend }: { label: string, value: string, change: string, trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-surface p-6 rounded-sm shadow-sm border border-outline-variant/10">
      <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2">{label}</p>
      <div className="flex justify-between items-end">
        <h4 className="text-3xl font-headline text-on-surface">{value}</h4>
        <span className={`text-xs font-semibold flex items-center gap-1 ${
          trend === 'up' ? 'text-secondary' : 
          trend === 'down' ? 'text-error' : 
          'text-on-surface'
        }`}>
          {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <AlertCircle size={14} /> : null}
          {change}
        </span>
      </div>
    </div>
  );
}

function ActivityItem({ user, action, target, time, alert = false }: { user: string, action: string, target: string, time: string, alert?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-2 h-2 rounded-full mt-2 ${alert ? 'bg-error' : 'bg-secondary'}`}></div>
      <div className="flex-1">
        <p className="text-sm text-on-surface font-body">
          <span className="font-semibold">{user}</span> {action} <span className="text-primary font-semibold">{target}</span>
        </p>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{time}</p>
      </div>
    </div>
  );
}

function TaskItem({ title, deadline, priority }: { title: string, deadline: string, priority: string }) {
  return (
    <div className="flex justify-between items-center border-b border-surface/10 pb-4 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[10px] text-surface/60 uppercase tracking-widest mt-1">Due: {deadline}</p>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
        priority === 'Critical' ? 'bg-error text-on-error' : 
        priority === 'High' ? 'bg-secondary text-on-secondary' : 
        'bg-surface/20 text-surface'
      }`}>
        {priority}
      </span>
    </div>
  );
}

function BlogPostItem({ title, status, date }: { title: string, status: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-sm group hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-surface flex items-center justify-center text-primary border border-outline-variant/20">
          <Newspaper size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{title}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{date}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
        status === 'Published' ? 'bg-secondary/10 text-secondary' : 
        status === 'Scheduled' ? 'bg-tertiary/10 text-tertiary' : 
        'bg-on-surface/10 text-on-surface-variant'
      }`}>
        {status}
      </span>
    </div>
  );
}

function AssetClassItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-body">
        <span className="text-on-surface-variant">{label}</span>
        <span className="font-semibold text-on-surface">{value}</span>
      </div>
      <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: value, backgroundColor: color }}></div>
      </div>
    </div>
  );
}

function AuditItem({ action, user, status, time }: { action: string, user: string, status: string, time: string }) {
  return (
    <div className="flex justify-between items-center text-xs border-b border-outline-variant/10 pb-3 last:border-0 last:pb-0">
      <div>
        <p className="font-semibold text-on-surface">{action}</p>
        <p className="text-on-surface-variant">{user}</p>
      </div>
      <div className="text-right">
        <p className={status === 'Failed' ? 'text-error' : 'text-secondary'}>{status}</p>
        <p className="text-on-surface-variant text-[10px]">{time}</p>
      </div>
    </div>
  );
}
