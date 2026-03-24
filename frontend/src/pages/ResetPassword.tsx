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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">{message}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full px-4 py-3 border rounded-lg" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input className="w-full px-4 py-3 border rounded-lg" type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">Reset Password</button>
        </form>
        <button className="text-blue-600 mt-4" onClick={() => onNavigate("login")}>Back to login</button>
      </div>
    </div>
  );
}
