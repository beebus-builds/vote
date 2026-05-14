'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, setStoredUser, setToken } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem('ivote_token')) {
      const user = window.localStorage.getItem('ivote_user');
      if (user) {
        const parsed = JSON.parse(user);
        router.replace(parsed.role === 'election_head' ? '/admin/dashboard' : '/student/dashboard');
      }
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      setToken(data.access_token);
      setStoredUser(data.user);
      router.push(data.user.role === 'election_head' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-brand">iVote</div>
        <p className="auth-tagline">Transparent. Secure. Democratic. Powered by Homomorphic Encryption.</p>
        <div className="auth-features">
          <div className="auth-feat">Ballots encrypted in your browser</div>
          <div className="auth-feat">Verified student participation</div>
          <div className="auth-feat">Mathematically verifiable results</div>
          <div className="auth-feat">Complete audit trail</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p className="sub">Sign in to your iVote account</p>
          {error ? (
            <div className={`alert alert-danger`} style={{ display: 'flex' }}>
              <span>✕</span>
              <span>{error}</span>
            </div>
          ) : null}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address <span className="req">*</span></label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password <span className="req">*</span></label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Signing in…' : 'Login to iVote'}
            </button>
          </form>
          <div className="auth-footer">New student? <a href="/register">Register here</a></div>
        </div>
      </div>
    </div>
  );
}
