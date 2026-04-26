import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ResetPassword({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = new URLSearchParams(window.location.search).get("token") || "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      setError("");
      await resetPassword(token, password);
      setMessage("Password reset successful. You can login now.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="premium-shell flex items-center justify-center p-4">
      <div className="premium-card max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Reset Password</h2>
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">{message}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input className="premium-input" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input className="premium-input" type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <button className="btn-primary w-full">Reset Password</button>
        </form>
        <button className="text-indigo-300 hover:text-violet-300 transition-colors mt-4" onClick={() => onNavigate("login")}>Back to login</button>
      </div>
    </div>
  );
}
