import { ArrowRight, Building2 } from "lucide-react";
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
  const shouldTopAlign = mode === "register";

  return (
    <div
      className={`flex min-h-screen w-full justify-center overflow-y-auto bg-surface-muted/30 px-4 py-6 sm:px-6 sm:py-10 ${
        shouldTopAlign ? "items-start" : "items-center"
      }`}
    >
      <div className="flex w-full max-w-[400px] flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="shrink-0 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-brand-600 text-white shadow-xl ring-8 ring-brand-50">
            <Building2 className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-[2.1rem] font-extrabold tracking-tight text-ink-950 sm:text-[2.5rem]">
            {isForgotPassword
              ? tr("Reset your password", "à¤…à¤ªà¤¨à¤¾ à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤°à¥€à¤¸à¥‡à¤Ÿ à¤•à¤°à¥‡à¤‚")
              : mode === "register"
                ? tr("Create your workspace", "à¤…à¤ªà¤¨à¤¾ à¤µà¤°à¥à¤•à¤¸à¥à¤ªà¥‡à¤¸ à¤¬à¤¨à¤¾à¤à¤‚")
                : tr("Sign in to your account", "à¤…à¤ªà¤¨à¥‡ à¤…à¤•à¤¾à¤‰à¤‚à¤Ÿ à¤®à¥‡à¤‚ à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨ à¤•à¤°à¥‡à¤‚")}
          </h1>
          <p className="mx-auto mt-3 max-w-[23rem] text-base leading-7 text-ink-500">
            {isForgotPassword
              ? tr("Enter your email to receive a password reset link.", "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤°à¥€à¤¸à¥‡à¤Ÿ à¤²à¤¿à¤‚à¤• à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤ªà¤¨à¤¾ à¤ˆà¤®à¥‡à¤² à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚à¥¤")
              : tr("Experience the next generation of team operations.", "à¤Ÿà¥€à¤® à¤‘à¤ªà¤°à¥‡à¤¶à¤¨à¥à¤¸ à¤•à¥€ à¤…à¤—à¤²à¥€ à¤ªà¥€à¤¢à¤¼à¥€ à¤•à¤¾ à¤…à¤¨à¥à¤­à¤µ à¤•à¤°à¥‡à¤‚à¥¤")}
          </p>
        </div>

        <form
          className="surface-panel flex flex-col overflow-hidden p-0 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
          onSubmit={onSubmit}
        >
          {!isForgotPassword && (
            <div className="shrink-0 bg-surface-muted/50 p-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                    mode === "login" ? "bg-white text-ink-950 shadow-md" : "text-ink-400 hover:bg-white/40 hover:text-ink-700"
                  }`}
                  onClick={() => onModeChange("login")}
                >
                  {tr("Login", "à¤²à¥‰à¤—à¤¿à¤¨")}
                </button>
                <button
                  type="button"
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                    mode === "register" ? "bg-white text-ink-950 shadow-md" : "text-ink-400 hover:bg-white/40 hover:text-ink-700"
                  }`}
                  onClick={() => onModeChange("register")}
                >
                  {tr("Register", "à¤°à¤œà¤¿à¤¸à¥à¤Ÿà¤°")}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5 p-6 sm:gap-6 sm:p-8">
            {mode === "register" && (
              <div className="grid gap-5">
                <div className="min-w-0">
                  <label className="field-label mb-2 text-[0.95rem] font-bold leading-none tracking-[0.12em] text-ink-950">
                    {tr("Workspace Name", "à¤µà¤°à¥à¤•à¤¸à¥à¤ªà¥‡à¤¸ à¤¨à¤¾à¤®")}
                  </label>
                  <input
                    className="field-input min-w-0 py-3 text-base"
                    value={authForm.organizationName}
                    onChange={(event) => onChange("organizationName", event.target.value)}
                    placeholder="e.g. Acme Corp"
                    required
                  />
                </div>
                <div className="min-w-0">
                  <label className="field-label mb-2 text-[0.95rem] font-bold leading-none tracking-[0.12em] text-ink-950">
                    {tr("Full Name", "à¤ªà¥‚à¤°à¤¾ à¤¨à¤¾à¤®")}
                  </label>
                  <input
                    className="field-input min-w-0 py-3 text-base"
                    value={authForm.name}
                    onChange={(event) => onChange("name", event.target.value)}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="min-w-0">
              <label className="field-label mb-2 text-[0.95rem] font-bold leading-none tracking-[0.12em] text-ink-950">
                {tr("Email Address", "à¤ˆà¤®à¥‡à¤² à¤ªà¤¤à¤¾")}
              </label>
              <input
                className="field-input min-w-0 py-3 text-base"
                type="email"
                value={authForm.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="you@work.com"
                required
              />
            </div>

            {!isForgotPassword && (
              <div className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="field-label mb-0 text-[0.95rem] font-bold leading-none tracking-[0.12em] text-ink-950">
                    {tr("Password", "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡")}
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-xs font-bold text-brand-600 hover:underline"
                      onClick={() => onModeChange("forgot-password")}
                    >
                      {tr("Forgot Password?", "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤­à¥‚à¤² à¤—à¤?")}
                    </button>
                  )}
                </div>
                <input
                  className="field-input min-w-0 py-3 text-base"
                  type="password"
                  value={authForm.password}
                  onChange={(event) => onChange("password", event.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  required
                />
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm font-semibold text-amber-800">
                {message}
              </div>
            )}

            <button
              className="btn-primary h-auto w-full py-3.5 text-base shadow-[0_15px_30px_rgba(37,99,235,0.15)] group"
              type="submit"
              disabled={busy}
            >
              {busy
                ? tr("Processing...", "à¤ªà¥à¤°à¥‹à¤¸à¥‡à¤¸à¤¿à¤‚à¤—...")
                : isForgotPassword
                  ? tr("Send Reset Link", "à¤°à¥€à¤¸à¥‡à¤Ÿ à¤²à¤¿à¤‚à¤• à¤­à¥‡à¤œà¥‡à¤‚")
                  : mode === "register"
                    ? tr("Create Workspace", "à¤µà¤°à¥à¤•à¤¸à¥à¤ªà¥‡à¤¸ à¤¬à¤¨à¤¾à¤à¤‚")
                    : tr("Sign In", "à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨")}
              <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
            </button>

            {isForgotPassword && (
              <button
                type="button"
                className="w-full text-center text-sm font-bold text-ink-500 transition-colors hover:text-ink-800"
                onClick={() => onModeChange("login")}
              >
                {tr("Back to Login", "à¤µà¤¾à¤ªà¤¸ à¤²à¥‰à¤—à¤¿à¤¨ à¤ªà¤°")}
              </button>
            )}
          </div>
        </form>

        <p className="shrink-0 text-center text-xs font-medium leading-tight text-ink-400">
          Â© 2026 VenusFlow Systems. {tr("All rights reserved.", "à¤¸à¤°à¥à¤µà¤¾à¤§à¤¿à¤•à¤¾à¤° à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤à¥¤")}
        </p>
      </div>
    </div>
  );
}
