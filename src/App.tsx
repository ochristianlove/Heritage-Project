import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { auth, onAuthStateChanged, doc, getDoc, db, FirebaseUser } from './firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  role: 'admin' | 'client' | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<'admin' | 'client' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role as 'admin' | 'client');
          } else {
            setRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'admin' | 'client' }) => {
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center font-headline text-2xl">Loading Heritage Trust...</div>;
    if (!user) return <Navigate to="/login" />;
    if (requiredRole && role !== requiredRole) return <Navigate to="/" />;
    return <>{children}</>;
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{ user, role, loading }}>
        <Router>
          <div className="min-h-screen bg-background text-on-surface">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <Toaster position="top-right" richColors closeButton />
          </div>
        </Router>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}
