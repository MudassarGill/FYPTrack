import { useState } from "react";
import mainImage from "../../assets/main.jpg";
import { activateInvitation } from "../../services/auth";

function SupervisorActivationForm({ onBackToLogin, onActivated }) {
  const [invitationToken, setInvitationToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const result = await activateInvitation({
        invitation_token: invitationToken.trim(),
        password,
      });
      onActivated(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `linear-gradient(#10261fc9, #10261fc9), url(${mainImage})` }}
    >
      <form className="w-full max-w-md rounded-lg bg-white p-7 shadow-xl" onSubmit={handleSubmit}>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">FYPTrack access</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Activate supervisor account</h1>
        <label className="mt-6 block text-sm font-medium text-slate-700" htmlFor="invitation-token">
          Invitation token
        </label>
        <textarea
          id="invitation-token"
          autoComplete="off"
          required
          rows={3}
          value={invitationToken}
          onChange={(event) => setInvitationToken(event.target.value)}
          className="mt-2 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        />
        <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="new-password">
          Set password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        />
        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded bg-emerald-800 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Activating..." : "Activate account"}
        </button>
        <button type="button" onClick={onBackToLogin} className="mt-4 w-full text-sm font-medium text-emerald-800">
          Back to login
        </button>
      </form>
    </main>
  );
}

export default SupervisorActivationForm;