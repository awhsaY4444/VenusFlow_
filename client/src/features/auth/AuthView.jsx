import { ArrowRight, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { tr } from "../../utils/i18n";

export function AuthView({
  mode,
  busy,
  message,
  authForm,
  onModeChange,
  onChange,
  onSubmit,
}) {
  const isForgotPassword = mode === "forgot-password";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface-muted/30 p-4">
      <div className="w-full max-w-[440px] space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-brand-600 text-white shadow-xl ring-8 ring-brand-50">
             <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-950">
            {isForgotPassword 
              ? tr("Reset your password", "अपना पासवर्ड रीसेट करें")
              : mode === "register" 
                ? tr("Create your workspace", "अपना वर्कस्पेस बनाएं") 
                : tr("Sign in to your account", "अपने अकाउंट में साइन इन करें")}
          </h1>
          <p className="mt-3 text-base text-ink-500">
             {isForgotPassword
               ? tr("Enter your email to receive a password reset link.", "पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें।")
               : tr("Experience the next generation of team operations.", "टीम ऑपरेशन्स की अगली पीढ़ी का अनुभव करें।")}
          </p>
        </div>

        <form className="surface-panel overflow-hidden p-0 shadow-[0_20px_50px_rgba(0,0,0,0.08)]" onSubmit={onSubmit}>
          {!isForgotPassword && (
            <div className="bg-surface-muted/50 p-1.5">
               <div className="grid grid-cols-2 gap-1.5">
                 <button
                   type="button"
                   className={`rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                     mode === "login" ? "bg-white text-ink-950 shadow-md" : "text-ink-400 hover:text-ink-700 hover:bg-white/40"
                   }`}
                   onClick={() => onModeChange("login")}
                 >
                   {tr("Login", "लॉगिन")}
                 </button>
                 <button
                   type="button"
                   className={`rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                     mode === "register" ? "bg-white text-ink-950 shadow-md" : "text-ink-400 hover:text-ink-700 hover:bg-white/40"
                   }`}
                   onClick={() => onModeChange("register")}
                 >
                   {tr("Register", "रजिस्टर")}
                 </button>
               </div>
            </div>
          )}

          <div className="space-y-6 p-8">
            {mode === "register" && (
              <div className="space-y-5">
                 <div>
                    <label className="field-label font-bold text-ink-950">{tr("Workspace Name", "वर्कस्पेस नाम")}</label>
                    <input
                      className="field-input py-3"
                      value={authForm.organizationName}
                      onChange={(event) => onChange("organizationName", event.target.value)}
                      placeholder="e.g. Acme Corp"
                      required
                    />
                 </div>
                 <div>
                    <label className="field-label font-bold text-ink-950">{tr("Full Name", "पूरा नाम")}</label>
                    <input
                      className="field-input py-3"
                      value={authForm.name}
                      onChange={(event) => onChange("name", event.target.value)}
                      placeholder="e.g. John Doe"
                      required
                    />
                 </div>
              </div>
            )}

            <div>
              <label className="field-label font-bold text-ink-950">{tr("Email Address", "ईमेल पता")}</label>
              <input
                className="field-input py-3"
                type="email"
                value={authForm.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="you@work.com"
                required
              />
            </div>

            {!isForgotPassword && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                   <label className="field-label mb-0 font-bold text-ink-950">{tr("Password", "पासवर्ड")}</label>
                   {mode === "login" && (
                      <button 
                        type="button" 
                        className="text-xs font-bold text-brand-600 hover:underline"
                        onClick={() => onModeChange("forgot-password")}
                      >
                         {tr("Forgot Password?", "पासवर्ड भूल गए?")}
                      </button>
                   )}
                </div>
                <input
                  className="field-input py-3"
                  type="password"
                  value={authForm.password}
                  onChange={(event) => onChange("password", event.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
                {message}
              </div>
            )}

            <button className="btn-primary mt-6 w-full py-4.5 h-auto text-base shadow-[0_15px_30px_rgba(37,99,235,0.15)] group" type="submit" disabled={busy}>
               {busy 
                 ? tr("Processing...", "प्रोसेसिंग...") 
                 : isForgotPassword
                   ? tr("Send Reset Link", "रीसेट लिंक भेजें")
                   : mode === "register" 
                     ? tr("Create Workspace", "वर्कस्पेस बनाएं") 
                     : tr("Sign In", "साइन इन")}
               <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
            </button>

            {isForgotPassword && (
              <button 
                type="button" 
                className="w-full text-center text-sm font-bold text-ink-500 hover:text-ink-800 transition-colors"
                onClick={() => onModeChange("login")}
              >
                {tr("Back to Login", "वापस लॉगिन पर")}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-xs font-medium text-ink-400">
           © 2026 VenusFlow Systems. {tr("All rights reserved.", "सर्वाधिकार सुरक्षित।")}
        </p>
      </div>
    </div>
  );
}

