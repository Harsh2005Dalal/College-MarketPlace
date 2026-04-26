import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Signup({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signUp({ fullName, email, phone, password });
      onNavigate("marketplace");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-shell flex items-center justify-center px-4 py-12">
      <div className="premium-card max-w-md w-full p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input className="premium-input" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input className="premium-input" type="email" placeholder="entry_number@iitrpr.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="premium-input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <input className="premium-input" type="password" placeholder="Min 6 chars" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button disabled={loading} className="btn-primary w-full">{loading ? "Creating account..." : "Create Account"}</button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-300">Already have an account? <button className="text-indigo-300 hover:text-violet-300 transition-colors" onClick={() => onNavigate("login")}>Sign in</button></p>
      </div>
    </div>
  );
}
