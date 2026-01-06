"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { login } from "../../store/authSlice";
import { useLoginMutation } from "../../store/authApi";
import type { AppDispatch, RootState } from "../../store";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const roleToDashboardPath = (role?: string) => {
    if (!role) return "login";
    const lower = role.toLowerCase();
    return lower === "super_admin" ? "admin" : lower;
  };

  useEffect(() => {
    if (isAuthenticated && user) {
        const target = `/dashboard/${roleToDashboardPath(user.role)}`;
        if (location.pathname !== target) {
          navigate(target, { replace: true });
        }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginMutation({ email, password }).unwrap();
      dispatch(login(result));
      navigate(`/dashboard/${roleToDashboardPath(result.user.role)}`, { replace: true });
    } catch (error) {
      alert("Invalid credentials. Use demo accounts below.");
    }
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

            <div className="register-prompt">
              <p>Don't have an account? <a href="/register" className="link">Create one here</a></p>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              <LogIn size={18} />
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}
