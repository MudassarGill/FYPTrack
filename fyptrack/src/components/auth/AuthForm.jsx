import { useState } from "react";
import { logIn } from "../../services/auth";

function AuthForm({ onSignUp, onActivateInvitation, notice, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await logIn({ email, password });
      onLoginSuccess(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-112.5 rounded-2xl border border-white/30 bg-white/75 p-5 shadow-2xl sm:rounded-3xl sm:p-8">

      {/* Heading */}
      <div>
        <h2 className="welcome-text text-3xl font-bold">
          Welcome Back
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Login to your FYPTrack account
        </p>
      </div>

      {/* Form */}
      <form className="mt-8" onSubmit={handleSubmit}>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#DDE2DC] px-4 py-3 text-sm text-[#1B2523] outline-none transition focus:border-[#E9B44C] focus:ring-2 focus:ring-[#E9B44C]/30"
          />
        </div>

        {/* Password */}
        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#DDE2DC] px-4 py-3 pr-20 text-sm text-[#1B2523] outline-none transition focus:border-[#E9B44C] focus:ring-2 focus:ring-[#E9B44C]/30"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-medium text-[#5C6A66] transition hover:text-[#17302B]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-[#17302B] transition hover:text-[#5C6A66]"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full cursor-pointer rounded-lg bg-[#E9B44C] py-3 font-semibold text-[#17302B] transition hover:bg-[#F1C76F] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

      </form>

      {(notice || error) && (
        <p
          className={`mt-4 text-sm ${error ? "text-red-600" : "text-emerald-700"}`}
          role="status"
          aria-live="polite"
        >
          {error || notice}
        </p>
      )}

      {/* Sign Up */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSignUp}
          className="cursor-pointer font-semibold text-[#17302B] transition hover:text-[#5C6A66]"
        >
          Sign Up
        </button>
      </p>
      <p className="mt-3 text-center text-sm text-slate-500">
        Have a supervisor invitation?{" "}
        <button
          type="button"
          onClick={onActivateInvitation}
          className="font-semibold text-[#17302B] transition hover:text-[#5C6A66]"
        >
          Activate account
        </button>
      </p>

    </div>
  );
}

export default AuthForm;