import { useState } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signIn(email, password);
      onNavigate("marketplace");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8"><LogIn className="w-8 h-8 text-white bg-blue-600 rounded-full p-1 mx-auto mb-3" /><h2 className="text-3xl font-bold">Welcome Back</h2></div>
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full px-4 py-3 border rounded-lg" type="email" placeholder="your.name@iitrpr.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full px-4 py-3 border rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" className="text-sm text-blue-600" onClick={() => onNavigate("forgot-password")}>Forgot password?</button>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p className="mt-5 text-center text-sm">No account? <button className="text-blue-600" onClick={() => onNavigate("signup")}>Sign up</button></p>
      </div>
    </div>
  );
}
