function SignUpForm() {
  return (
    <div className="w-[450px] rounded-3xl border border-white/30 bg-white/75 p-8 shadow-2xl backdrop-blur-md">

      {/* Heading */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Create Account
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Create your FYPTrack student account
        </p>
      </div>

      {/* Form */}
      <form className="mt-8">

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Password */}
        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Confirm Password */}
        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
        >
          Create Account
        </button>

      </form>

      {/* Login */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          className="font-semibold text-blue-600 transition hover:text-blue-700 cursor-pointer"
        >
          Login
        </button>
      </p>

    </div>
  );
}

export default SignUpForm;