"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "../../public/logo2.png";
import "../styles/land.css";

type LoginStatus = 'idle' | 'success' | 'error';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement)?.value.trim();
    const password = (document.getElementById("password") as HTMLInputElement)?.value.trim();

    if (!email || !password) {
      alert("Both email and password are required.");
      return;
    }

    setLoading(true);
    setLoginStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check for incorrect credentials - for demo, "wrong" or "error" in input triggers error
      if (email.toLowerCase().includes('wrong') || 
          email.toLowerCase().includes('error') || 
          password.toLowerCase().includes('wrong') ||
          password.toLowerCase().includes('error')) {
        setLoginStatus('error');
        setLoading(false);
        return;
      }

      // Decide dashboard based on email (NO role system)
      let redirectPath = "/dashboard/student";

      if (email.includes("admin")) {
        redirectPath = "/dashboard/admin";
      } else if (email.includes("teacher")) {
        redirectPath = "/dashboard/teacher";
      } else if (email.includes("parent")) {
        redirectPath = "/dashboard/parent";
      }

      localStorage.setItem("userEmail", email);

      setLoginStatus('success');
      
      // Delay redirect to show success animation
      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Render success feedback
  const renderSuccessFeedback = () => (
    <div className="login-feedback">
      <div className="feedback-circle success">
        <div className="checkmark"></div>
      </div>
      <p className="feedback-message success">Login Successful!</p>
    </div>
  );

  // Render error feedback
  const renderErrorFeedback = () => (
    <div className="login-feedback">
      <div className="feedback-circle error">
        <div className="cross"></div>
      </div>
      <p className="feedback-message error">Invalid credentials. Please try again.</p>
    </div>
  );

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-panel">
        <h1>
          Karibu <span className="red-text">Green Valley</span>{" "}
          <span className="blue-text">HIGH SCHOOL</span>
        </h1>
        <p className="slogan">The Holistic Community</p>

        <div className="image-wrapper">
          <Image src="/school.png" alt="Main Students" width={500} height={500} className="circle-img large" priority />
          <div className="small-circle-stack">
            <Image src="/game.png" alt="Lecture" width={130} height={130} className="circle-img" />
            <Image src="/one.png" alt="Campus" width={130} height={130} className="circle-img" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <Image src={logo} alt="Green Valley Logo" width={100} height={100} className="logo" />
        <h2 className="welcome-title">Hi, welcome 👋</h2>
        <p className="subtext">Please fill in your details to log in</p>

        {/* Show feedback messages */}
        {loginStatus === 'success' && renderSuccessFeedback()}
        {loginStatus === 'error' && renderErrorFeedback()}

        {/* ✅ No method="POST" here! */}
        <form onSubmit={handleSubmit} className={`sign-in-form ${loginStatus === 'error' ? 'shake' : ''}`}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="text" placeholder="Enter Email Address" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Enter your Password" required />
          </div>

          <div className="form-options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <Link href="/forgotpassword" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="register">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
