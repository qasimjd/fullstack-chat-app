import React, { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from '../components/AuthImagePattern';
import useAuthStore from '../store/useAuthStore';
import { toast } from "react-hot-toast";

const SignupPage = () => {
  const { isSignin, signup } = useAuthStore();

  const [showPassword, setshowPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const isValidForm = () => {

    // Check if any field is empty
    if (!formData.fullname.trim()) {
      toast.error("Full Name is required!");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required!");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required!");
      return false;
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return false;
    }

    // Check for strong password (minimum 6 characters)
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return false;
    }

    // If all checks pass
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const succeess = isValidForm();
    if (succeess === true) {
      signup(formData);
    }
  };


  return (
    <div>
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">Get started with your free account</p>
              </div>
            </div>

            {/* Input Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="Qasim Ali Javed"
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    value={formData.fullname}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="qasimalijaved65@gmai.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    value={formData.email}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    value={formData.password}
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={(e) => setshowPassword(!showPassword)}>
                    {showPassword ? <Eye className="size-5 text-base-content/40" /> : <EyeOff className="size-5 text-base-content/40" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-full" disabled={isSignin} >
                {isSignin ? <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </> : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <AuthImagePattern
          title="Join our community"
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
        />
      </div>

    </div>
  )
}

export default SignupPage