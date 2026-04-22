import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, ShieldCheck, Lock } from "lucide-react";
import { api } from "../../api";
import { useToast } from "../../contexts/ToastContext";
import { tr } from "../../utils/i18n";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      pushToast(tr("Passwords do not match", "पासवर्ड मेल नहीं खाते"), "error");
      return;
    }

    if (password.length < 8) {
        pushToast(tr("Password must be at least 8 characters", "पासवर्ड कम से कम 8 अक्षर का होना चाहिए"), "error");
        return;
    }

    setBusy(true);
    setMessage("");

    try {
      await api.resetPassword({ token, password });
      pushToast(tr("Password reset successfully!", "पासवर्ड सफलतापूर्वक रीसेट हो गया!"), "success");
      navigate("/");
    } catch (error) {
      setMessage(error.message);
      pushToast(error.message, "error");
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-surface-muted/30 p-4">
        <div className="w-full max-w-[440px] text-center space-y-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-amber-100 text-amber-600 shadow-xl">
             <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-ink-950">{tr("Invalid Reset Link", "अमान्य रीसेट लिंक")}</h1>
          <p className="text-ink-500">{tr("This password reset link is invalid or has expired.", "यह पासवर्ड रीसेट लिंक अमान्य है या समाप्त हो गया है।")}</p>
          <button 
            onClick={() => navigate("/")}
            className="btn-primary w-full py-4 h-auto"
          >
            {tr("Go to Login", "लॉगिन पर जाएं")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface-muted/30 p-4">
      <div className="w-full max-w-[440px] space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-brand-600 text-white shadow-xl ring-8 ring-brand-50">
             <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-950">
            {tr("Set New Password", "नया पासवर्ड सेट करें")}
          </h1>
          <p className="mt-3 text-base text-ink-500">
             {tr("Your new password must be different from previous passwords.", "आपका नया पासवर्ड पिछले पासवर्ड से अलग होना चाहिए।")}
          </p>
        </div>

        <form className="surface-panel overflow-hidden p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="field-label font-bold text-ink-950">{tr("New Password", "नया पासवर्ड")}</label>
              <input
                className="field-input py-3"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="field-label font-bold text-ink-950">{tr("Confirm New Password", "नए पासवर्ड की पुष्टि करें")}</label>
              <input
                className="field-input py-3"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            {message && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
                {message}
              </div>
            )}

            <button className="btn-primary mt-6 w-full py-4.5 h-auto text-base shadow-[0_15px_30px_rgba(37,99,235,0.15)] group" type="submit" disabled={busy}>
               {busy ? tr("Updating...", "अपडेट हो रहा है...") : tr("Update Password", "पासवर्ड अपडेट करें")}
               <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
