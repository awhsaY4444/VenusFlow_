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

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted/30">
      <div className="flex min-h-full flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div
          className={`mx-auto flex w-full max-w-md flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ${
            mode === "login" ? "my-auto" : ""
          }`}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-brand-600 text-white shadow-xl ring-8 ring-brand-50">
              <Building2 className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h1 className="text-[2.1rem] font-extrabold tracking-tight text-ink-950 sm:text-[2.5rem]">
              {isForgotPassword
                ? tr("Reset your password", "Reset your password")
                : mode === "register"
                  ? tr("Create your workspace", "Create your workspace")
                  : tr("Sign in to your account", "Sign in to your account")}
            </h1>
            <p className="mx-auto mt-3 max-w-[23rem] text-base leading-7 text-ink-500">
              {isForgotPassword
                ? tr(
                    "Enter your email to receive a password reset link.",
                    "Enter your email to receive a password reset link."
                  )
                : tr(
                    "Experience the next generation of team operations.",
                    "Experience the next generation of team operations."
                  )}
            </p>
          </div>

          <form
            className="surface-panel flex flex-col overflow-visible p-0 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            onSubmit={onSubmit}
          >
            {!isForgotPassword && (
              <div className="bg-surface-muted/50 p-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                      mode === "login"
                        ? "bg-white text-ink-950 shadow-md"
                        : "text-ink-400 hover:bg-white/40 hover:text-ink-700"
                    }`}
                    onClick={() => onModeChange("login")}
                  >
                    {tr("Login", "Login")}
                  </button>
                  <button
                    type="button"
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                      mode === "register"
                        ? "bg-white text-ink-950 shadow-md"
                        : "text-ink-400 hover:bg-white/40 hover:text-ink-700"
                    }`}
                    onClick={() => onModeChange("register")}
                  >
                    {tr("Register", "Register")}
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-5 p-6 sm:gap-6 sm:p-8">
              {mode === "register" && (
                <div className="grid gap-5">
                  <div className="min-w-0">
                    <label className="field-label mb-2 text-[0.95rem] font-bold leading-none tracking-[0.12em] text-ink-950">
                      {tr("Workspace Name", "Workspace Name")}
                    </label>
                    <input
                      className="field-input min-w-0 py-3 text-base"
                      value={authForm.organizationName}
                      onChange={(event) =>
                        onChange("organizationName", event.target.value)
                      }
                      placeholder="e.g. Acme Corp"
                      required
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="field-label mb-2 text-[0.95rem] font-bold leading-none tracking-[0.12em] text-ink-950">
                      {tr("Full Name", "Full Name")}
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
                  {tr("Email Address", "Email Address")}
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
                      {tr("Password", "Password")}
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        className="text-xs font-bold text-brand-600 hover:underline"
                        onClick={() => onModeChange("forgot-password")}
                      >
                        {tr("Forgot Password?", "Forgot Password?")}
                      </button>
                    )}
                  </div>
                  <input
                    className="field-input min-w-0 py-3 text-base"
                    type="password"
                    value={authForm.password}
                    onChange={(event) => onChange("password", event.target.value)}
                    placeholder="........"
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
                  ? tr("Processing...", "Processing...")
                  : isForgotPassword
                    ? tr("Send Reset Link", "Send Reset Link")
                    : mode === "register"
                      ? tr("Create Workspace", "Create Workspace")
                      : tr("Sign In", "Sign In")}
                <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
              </button>

              {isForgotPassword && (
                <button
                  type="button"
                  className="w-full text-center text-sm font-bold text-ink-500 transition-colors hover:text-ink-800"
                  onClick={() => onModeChange("login")}
                >
                  {tr("Back to Login", "Back to Login")}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-xs font-medium leading-tight text-ink-400">
            (c) 2026 VenusFlow Systems.{" "}
            {tr("All rights reserved.", "All rights reserved.")}
          </p>
        </div>
      </div>
    </div>
  );
}
