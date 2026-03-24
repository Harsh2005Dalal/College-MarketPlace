import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPassword({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await forgotPassword(email);
      setMessage("If your email exists, reset instructions have been sent.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">{message}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full px-4 py-3 border rounded-lg" type="email" placeholder="your.name@iitrpr.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">{loading ? "Sending..." : "Send Reset Link"}</button>
        </form>
        <button className="text-blue-600 mt-4" onClick={() => onNavigate("login")}>Back to login</button>
      </div>
    </div>
  );
}
