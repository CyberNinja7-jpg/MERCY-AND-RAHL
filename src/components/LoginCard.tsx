import { useState } from "react";

type Props = { onSuccess: () => void };

export default function LoginCard({ onSuccess }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const tryLogin = () => {
    const pass = value.trim().toLowerCase();
    if (pass === "mercy" || pass === "rahl") {
      setError("");
      onSuccess();
    } else {
      setError("Invalid password");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div
      className={`w-[320px] rounded-2xl bg-[#1e1e1e] p-6 text-white shadow-2xl 
                  ${shake ? "animate-[shake_0.4s]" : ""}`}
      style={{
        // tiny keyframes for shake
        animationTimingFunction: "ease-in-out",
      }}
    >
      <h2 className="text-2xl font-bold text-center mb-4">🔐 Login</h2>
      <input
        type="password"
        placeholder="Enter password (mercy / rahl)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && tryLogin()}
        className="w-full rounded-lg bg-[#2b2b2b] px-3 py-2 outline-none"
      />
      <button
        onClick={tryLogin}
        className="mt-4 w-full rounded-lg bg-pink-600 py-2 font-semibold hover:opacity-90"
      >
        Login
      </button>
      <p className="mt-3 text-center text-pink-300 text-sm h-5">{error}</p>

      {/* local keyframes */}
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
