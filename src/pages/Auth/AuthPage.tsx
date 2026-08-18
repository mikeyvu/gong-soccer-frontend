import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, verifyEmail, login as loginService, resendVerification } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

type AuthView = "login" | "signup" | "verify";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [view, setView] = useState<AuthView>("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function switchView(next: AuthView) {
    setError("");
    setView(next);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginService({ email: form.email, password: form.password });
      authLogin(response);
      if (!response.hasProfile) {
        navigate("/complete-profile");
      } else {
        const teamId = response.memberships[0]?.teamId ?? "";
        navigate(`/${teamId}/dashboard`);
      }
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp({ email: form.email, password: form.password });
      setPendingEmail(form.email);
      setForm((f) => ({ ...f, code: "" }));
      setView("verify");
    } catch {
      setError("Sign up failed. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setLoading(true);
    try {
      await resendVerification(pendingEmail);
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyEmail({ email: pendingEmail, verificationCode: form.code });
      setForm((f) => ({ ...f, email: pendingEmail, password: "", confirmPassword: "", code: "" }));
      setView("login");
    } catch {
      setError("Verification failed. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 h-auto rounded-xl bg-white/10 border border-white/25 text-white placeholder:text-white/40 focus-visible:ring-white/40 focus-visible:border-transparent";
  const labelClass = "text-white/80 text-sm font-medium mb-1.5";

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: "#0a1a0f" }}
    >
      {/* Blurred background image */}
      <img
        src="/soccer-background.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        style={{ filter: "blur(4px) brightness(0.72)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/15 border border-white/30 mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
              <path
                d="M12 2a10 10 0 0 1 6.32 17.85L14 14l2-4-4-1-4 1 2 4-4.32 5.85A10 10 0 0 1 12 2z"
                fill="white"
                opacity="0.85"
              />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">GongSoccer</h1>
          <p className="text-white/60 text-sm mt-1">Your game, your way.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-8 shadow-2xl">
          {/* Error banner */}
          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          {/* LOGIN */}
          {view === "login" && (
            <>
              <h2 className="text-white text-xl font-semibold mb-6">Welcome back</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className={labelClass}>Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className={labelClass}>Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-white/60 text-sm hover:text-white transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 h-auto rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/30 active:scale-[0.98]"
                >
                  {loading ? "Logging in…" : "Log In"}
                </Button>
                <p className="text-center text-white/50 text-sm pt-1">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("signup")}
                    className="text-white font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </>
          )}

          {/* SIGN UP */}
          {view === "signup" && (
            <>
              <h2 className="text-white text-xl font-semibold mb-6">Create an account</h2>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email" className={labelClass}>Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className={labelClass}>Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-confirm" className={labelClass}>Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 h-auto rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/30 active:scale-[0.98]"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
                <p className="text-center text-white/50 text-sm pt-1">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("login")}
                    className="text-white font-medium hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </form>
            </>
          )}

          {/* VERIFY EMAIL */}
          {view === "verify" && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 border border-green-400/40 mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-white text-xl font-semibold">Check your email</h2>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                  We sent a 6-digit code to
                  <br />
                  <span className="text-white font-medium">
                    {pendingEmail || "your email address"}
                  </span>
                </p>
              </div>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <Label htmlFor="verify-code" className={`${labelClass} block text-center`}>
                    Verification Code
                  </Label>
                  <Input
                    id="verify-code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    value={form.code}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        code: e.target.value.replace(/\D/g, "").slice(0, 6),
                      }))
                    }
                    required
                    className={`${inputClass} text-center text-2xl tracking-[0.5em] font-mono`}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 h-auto rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/30 active:scale-[0.98]"
                >
                  {loading ? "Verifying…" : "Verify Email"}
                </Button>
                <p className="text-center text-white/50 text-sm">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-white font-medium hover:underline disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </p>
                <p className="text-center">
                  <button
                    type="button"
                    onClick={() => switchView("signup")}
                    className="text-white/40 text-sm hover:text-white/70 transition"
                  >
                    ← Back to sign up
                  </button>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
}
