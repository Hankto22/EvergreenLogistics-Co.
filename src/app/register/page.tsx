"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Building, UserPlus } from "lucide-react";
import { login } from "../../store/authSlice";
import { useCreateUserMutation } from "../../store/authApi";
import type { AppDispatch, RootState } from "../../store";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [registerMutation, { isLoading }] = useCreateUserMutation();
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

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const result = await registerMutation({
        fullName,
        email,
        password,
        role: "client", // Default to client for registration
        phone: phone || null,
        company: company || null,
      }).unwrap();
      dispatch(login(result));
      navigate(`/dashboard/${roleToDashboardPath(result.user.role)}`, { replace: true });
    } catch (error) {
      alert("Registration failed. Please try again.");
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
          <h1>Create Account</h1>
          <p>Join Evergreen Logistics to track your shipments</p>
        </div>

        <div className="login-card">
          <form onSubmit={submit}>
            <label className="input-label">Full Name</label>
            <div className="input-field">
              <User size={18} />
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>

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

            <label className="input-label">Phone Number</label>
            <div className="input-field">
              <Phone size={18} />
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>

            <label className="input-label">Company</label>
            <div className="input-field">
              <Building size={18} />
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                type="text"
                placeholder="Enter your company name"
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

            <label className="input-label">Confirm Password</label>
            <div className="input-field">
              <Lock size={18} />
              <input
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              <UserPlus size={18} />
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="register-link">
            <p>Already have an account? <a href="/login">Sign in here</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}