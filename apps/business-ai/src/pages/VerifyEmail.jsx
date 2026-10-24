import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "../services/api";
import BrandMark from "../components/BrandMark";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verify = async () => {
      try {
        const response = await api.get(`/auth/verify?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Your email has been successfully verified!");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The token may be invalid or expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#060b17] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg">
          <BrandMark size={36} />
        </div>

        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
            <p className="text-slate-400 text-sm">Please wait a moment while we verify your account.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Email Verified!</h2>
            <p className="text-emerald-300/80 text-sm">{message}</p>
            <Link to="/login" className="inline-block mt-4 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition">
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Verification Failed</h2>
            <p className="text-rose-300/80 text-sm">{message}</p>
            <Link to="/register" className="inline-block mt-4 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold transition">
              Back to Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
