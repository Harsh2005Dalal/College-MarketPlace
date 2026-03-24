import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Signup({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { sendOtp, signUp } = useAuth();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await sendOtp(email);
      setStep("otp");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await signUp({ fullName, email, phone, password, otp });
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
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</div>}
        {step === "details" ? (
          <form onSubmit={send} className="space-y-4">
            <input className="w-full px-4 py-3 border rounded-lg" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input className="w-full px-4 py-3 border rounded-lg" type="email" placeholder="your.name@iitrpr.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="w-full px-4 py-3 border rounded-lg" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <input className="w-full px-4 py-3 border rounded-lg" type="password" placeholder="Min 6 chars" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">{loading ? "Sending OTP..." : "Send OTP"}</button>
          </form>
        ) : (
          <form onSubmit={complete} className="space-y-4">
            <p className="text-sm text-gray-600">Enter OTP sent to {email}</p>
            <input className="w-full px-4 py-3 border rounded-lg text-center text-xl" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">{loading ? "Creating account..." : "Verify and Sign Up"}</button>
            <button type="button" className="w-full text-blue-600" onClick={() => setStep("details")}>Back</button>
          </form>
        )}
        <p className="mt-5 text-center text-sm">Already have an account? <button className="text-blue-600" onClick={() => onNavigate("login")}>Sign in</button></p>
      </div>
    </div>
  );
}
