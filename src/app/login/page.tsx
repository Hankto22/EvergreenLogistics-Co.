"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { login } from "../../store/authSlice";
import type { AppDispatch } from "../../store";

const demoAccounts = [
  { role: "admin", email: "admin@evergreen.com" },
  { role: "staff", email: "staff@evergreen.com" },
  { role: "client", email: "client@evergreen.com" }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication - in real app, this would be an API call
    setTimeout(() => {
      const account = demoAccounts.find(acc => acc.email === email);
      if (account) {
        dispatch(login({ email: account.email, role: account.role as "admin" | "staff" | "client" }));
        navigate(`/dashboard/${account.role}`);
      } else {
        alert("Invalid credentials. Use demo accounts below.");
      }
      setLoading(false);
    }, 900);
  };

  return (
    <section className="login-page">
      <div className="login-shell">
        <div className="login-brand">
          <div className="brand-mark">E</div>
          <div className="brand-text">
            <span className="brand-title">EVERGREEN LOGISTICS</span>
          </div>
        </div>

        <div className="login-heading">
          <h1>Welcome Back</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <div className="login-card">
          <form onSubmit={submit}>
            <label className="input-label">Email Address</label>
            <div className="input-field">
              <Mail size={18} />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <label className="input-label">Password</label>
            <div className="input-field">
              <Lock size={18} />
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="login-actions">
              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a className="link" href="#">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <LogIn size={18} />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="demo-list">
            <div className="demo-title">Demo Accounts:</div>
            {demoAccounts.map(account => (
              <div key={account.role} className="demo-row">
                <span className="demo-role">{account.role}</span>
                <span className="demo-email">{account.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
