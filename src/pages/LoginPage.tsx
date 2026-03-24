import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Chrome } from 'lucide-react';
import { auth, signInWithPopup, googleProvider, db, doc, getDoc, setDoc } from '../firebase';
import { toast } from 'sonner';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user. Assign 'admin' role if email matches the specified admin.
        const isAdminEmail = user.email === 'ochristian1000@gmail.com';
        const newUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: isAdminEmail ? 'admin' : 'client',
          createdAt: new Date()
        };
        await setDoc(userDocRef, newUser);
        toast.success(isAdminEmail ? 'Welcome, Administrator!' : 'Welcome to Heritage Trust!');
        navigate(isAdminEmail ? '/admin' : '/dashboard');
      } else {
        const userData = userDoc.data();
        toast.success(`Welcome back, ${userData.displayName || 'Client'}`);
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side: Branding & Info */}
      <div className="hidden md:flex md:w-1/2 silk-gradient p-20 flex-col justify-between text-surface-bright relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] border-[1px] border-surface-bright/20 rounded-full"></div>
          <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-[1px] border-surface-bright/20 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-headline font-semibold tracking-tight mb-12 block">
            Heritage Trust
          </Link>
          <div className="max-w-md">
            <h2 className="font-headline text-5xl leading-tight mb-8">Secure Access to Your Legacy.</h2>
            <p className="text-surface-bright/80 text-xl font-light leading-relaxed">
              Our encrypted portal provides real-time oversight of your assets, performance reporting, and direct communication with your fiduciary team.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-surface-bright/60 font-label text-xs uppercase tracking-[0.2em]">
          <ShieldCheck size={20} />
          <span>Military-Grade Encryption Active</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-24 bg-surface">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h1 className="font-headline text-4xl text-on-surface mb-4">Client Portal</h1>
            <p className="text-on-surface-variant font-body">Sign in using your authorized Google account.</p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface py-5 rounded-sm font-label text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-surface-container transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Chrome size={20} className="text-primary" />
              {loading ? 'Authenticating...' : 'Sign in with Google'}
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant/10"></div>
              <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-on-surface-variant">Secure Fiduciary Access</span>
              <div className="flex-grow border-t border-outline-variant/10"></div>
            </div>

            <div className="bg-surface-container-low p-6 rounded-sm border border-outline-variant/10">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-primary/10 text-primary rounded-full mt-1">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface mb-1 uppercase tracking-wider">Authorized Access Only</p>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    This portal is restricted to Heritage Trust clients and authorized personnel. All activity is logged and monitored for compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-on-surface-variant text-sm font-body">
              New to Heritage Trust? <a href="#" className="text-primary font-semibold hover:underline underline-offset-4">Contact your advisor</a> to request access.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
