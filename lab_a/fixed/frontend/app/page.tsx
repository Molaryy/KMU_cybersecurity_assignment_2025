'use client';

import { useState, React } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setUser(null);
      setMessage('');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setUser(null);

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setMessage(data.message);
      } else {
        setError(data.error || data.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            User Login
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enter your credentials to access the system
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Username (Email)
              </label>
              <input
                id="username"
                type="text"
                placeholder="admin@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
              Error:
            </p>
            <code className="text-sm text-red-900 dark:text-red-100 break-all">
              {error}
            </code>
          </div>
        )}

        {user && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-green-300 dark:border-green-700 overflow-hidden">
            <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700">
              <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">
                Login Successful!
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-20">ID:</span>
                  <span className="text-lg text-slate-900 dark:text-slate-100">{user.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-20">Name:</span>
                  <span className="text-lg text-slate-900 dark:text-slate-100">{user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-20">Email:</span>
                  <span className="text-lg text-slate-900 dark:text-slate-100">{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
