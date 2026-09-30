import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import Logo from "../components/Logo";
import { ThemeContext } from "../context/ThemeContext";
import { login, getApiBaseUrl, setCustomApiUrl } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiSavedMsg, setApiSavedMsg] = useState("");

  const handleSaveApiUrl = (e) => {
    e?.preventDefault();
    setCustomApiUrl(apiUrl);
    setApiSavedMsg("Backend URL saved! You can now log in.");
    setError("");
    setTimeout(() => setApiSavedMsg(""), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(email, password);
      console.log("Login successful:", response);
      const userRole = response?.user?.role || role;
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const isNetworkError = err.message === "Network Error" || !err.response;
      const msg = err.response?.data?.error || (isNetworkError ? "Cannot connect to Backend. Paste your active Cloudflare Tunnel URL below." : "Login failed. Please check your credentials.");
      setError(msg);
      if (isNetworkError) {
        setShowApiConfig(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen text-white overflow-hidden ${
      isDark
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-purple-700 via-purple-600 to-violet-500"
    }`}>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 min-h-screen items-center">

        {/* LEFT — AI VISUAL STORY */}
        <div className="relative hidden md:flex items-center justify-center h-[500px]">

          {/* Pulse Core */}
          <div className="absolute w-[360px] h-[360px] rounded-full bg-gray-100 text-gray-800 backdrop-blur-2xl animate-pulse" />

          {/* Floating Emotions */}
          <div className="absolute top-10 left-20 text-2xl animate-bounce">😡</div>
          <div className="absolute top-24 right-16 text-2xl animate-pulse">😏</div>
          <div className="absolute bottom-20 left-24 text-2xl animate-bounce">😐</div>
          <div className="absolute bottom-10 right-20 text-2xl animate-pulse">😊</div>

          {/* Center Icon */}
          <div className="text-[120px] opacity-90">🎙️</div>
        </div>

        {/* RIGHT — LOGIN/2FA PANEL */}
        <div className="flex justify-center">
          <div className={`w-full max-w-md backdrop-blur-xl rounded-lg p-8 shadow-2xl ${
            isDark
              ? "bg-slate-800 text-white"
              : "bg-gray-100 text-gray-800"
          }`}>

            {/* LOGO */}
            <div className="flex justify-center mb-6">
              <Logo size="lg" theme={isDark ? "dark" : "light"} />
            </div>

            <h2 className="text-3xl font-bold text-center mb-2">
              Welcome Back
            </h2>

            <p className={`text-center mb-6 ${
              isDark ? "text-slate-300" : "text-gray-700"
            }`}>
              "Access the MUSE AI System"
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm flex items-start gap-2 animate-shake">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* BACKEND TUNNEL URL CONFIGURATION PANEL */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] opacity-75">Backend: {apiUrl ? apiUrl.replace(/^https?:\/\//, '').slice(0, 25) + '...' : 'Default'}</span>
                <button
                  type="button"
                  onClick={() => setShowApiConfig(!showApiConfig)}
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 underline transition-colors"
                >
                  ⚙️ {showApiConfig ? "Close Settings" : "Change Backend URL"}
                </button>
              </div>

              {showApiConfig && (
                <div className="p-3 mt-2 rounded-lg bg-slate-900/90 border border-violet-500/40 text-xs text-white shadow-inner">
                  <label className="block font-semibold text-violet-300 mb-1">
                    Paste Cloudflare Tunnel URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://xxxx.trycloudflare.com"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      className="flex-1 p-2 rounded bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-violet-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveApiUrl}
                      className="px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded font-semibold text-xs shadow-md transition-all"
                    >
                      Save URL
                    </button>
                  </div>
                  {apiSavedMsg && <p className="text-emerald-400 font-medium mt-1.5">{apiSavedMsg}</p>}
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

                  {/* ROLE */}
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}>
                      Login As
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "bg-gray-200 border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="user">
                        User / Analyst
                      </option>
                      <option value="admin">
                        Administrator
                      </option>
                    </select>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${
                      isDark ? "text-slate-300" : "text-gray-900"
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full p-3 rounded-lg border placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "bg-white border-gray-300 text-black"
                      }`}
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${
                      isDark ? "text-slate-300" : "text-gray-900"
                    }`}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-black placeholder-gray-500"
                      }`}
                    />
                  </div>

                  {/* FORGOT PASSWORD */}
                  <p
                    onClick={() => navigate("/forgot-password")}
                    className={`text-sm cursor-pointer text-right hover:underline font-semibold transition-colors duration-200 ${
                      isDark ? "text-cyan-400 hover:text-cyan-300" : "text-purple-700"
                    }`}
                  >
                    Forgot password?
                  </p>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-11 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    } ${
                      isDark
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border border-transparent shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/50"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-transparent shadow-md hover:from-indigo-700 hover:to-purple-700 active:scale-95"
                    }`}
                  >
                    {loading ? "Signing in..." : "🚀 Enter AI Workspace"}
                  </button>
                </form>

                {/* REGISTER */}
                <p className={`text-sm text-center mt-6 ${
                  isDark ? "text-slate-400" : "text-gray-700"
                }`}>
                  New to MUSE?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className={`cursor-pointer font-semibold hover:underline transition-colors duration-200 ${
                      isDark ? "text-cyan-400 hover:text-cyan-300" : "text-purple-700"
                    }`}
                  >
                    Create Account
                  </span>
                </p>

          </div>
        </div>

      </div>
    </div>
  );
}











