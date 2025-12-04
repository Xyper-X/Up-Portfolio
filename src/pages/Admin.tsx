import React, { useState, useEffect } from 'react';
import { Shield, Lock, LayoutDashboard, FileText } from 'lucide-react';
import { AdminDashboard } from '../components/AdminDashboard';
import { AdminContentManager } from '../components/AdminContentManager';

export function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [activePanel, setActivePanel] = useState<'dashboard' | 'content'>('dashboard');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const ADMIN_PASSWORD = 'admin123';

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'authenticated');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return (
      <>
        {activePanel === 'dashboard' && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setActivePanel('content')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Content Manager
            </button>
          </div>
        )}
        {activePanel === 'content' && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setActivePanel('dashboard')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              Messages
            </button>
          </div>
        )}
        {activePanel === 'dashboard' ? <AdminDashboard /> : <AdminContentManager />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 p-8 rounded-lg border border-red-600">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-10 h-10 text-red-600" />
            <h1 className="text-3xl font-bold">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white transition-colors duration-300"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6 p-4 bg-red-900/20 rounded-lg">
            <p className="text-gray-400 text-sm">
              <span className="text-red-400">Note:</span> Change the default password in the Admin.tsx file before deploying to production.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-gray-400 hover:text-red-500 transition-colors duration-300"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
