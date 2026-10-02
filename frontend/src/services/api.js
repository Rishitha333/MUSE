import axios from "axios";
import {
  DEMO_TOKEN,
  DEMO_USER,
  DEMO_CALLS,
  getDemoStats,
} from "../demo/demoData";

// One-time cleanup: remove any old tunnel URL saved by the previous settings panel
localStorage.removeItem("custom_api_url");

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"
)
  .trim()
  .replace(/\/+$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── DEMO MODE ───────────────────────────────────────────

// On when the site is built with VITE_DEMO_MODE=true,
// or when a visitor clicked "Try Demo" (saved in localStorage).
export const isDemoMode = () =>
  import.meta.env.VITE_DEMO_MODE === "true" ||
  localStorage.getItem("demo_mode") === "true";

export const enterDemoMode = () => {
  localStorage.setItem("demo_mode", "true");
  localStorage.setItem("token", DEMO_TOKEN);
};

export const exitDemoMode = () => {
  localStorage.removeItem("demo_mode");
  if (localStorage.getItem("token") === DEMO_TOKEN) {
    localStorage.removeItem("token");
  }
};

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Errors shaped like axios errors, so existing catch blocks show the message
const demoError = (message) => {
  const err = new Error(message);
  err.response = { status: 403, data: { error: message } };
  return err;
};

// ─── AUTH HELPERS ────────────────────────────────────────

const getAuthToken = () => localStorage.getItem("token");

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── AUTH ────────────────────────────────────────────────

export const login = async (email, password) => {
  if (isDemoMode()) {
    await wait();
    localStorage.setItem("token", DEMO_TOKEN);
    return { token: DEMO_TOKEN, user: DEMO_USER, message: "Demo login" };
  }
  const response = await API.post("/api/auth/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const register = async (email, username, password) => {
  if (isDemoMode()) {
    await wait();
    throw demoError(
      "Registration is disabled in demo mode. Go back and click 'Try Demo' to explore."
    );
  }
  const response = await API.post("/api/auth/register", { email, username, password });
  return response.data;
};

export const getCurrentUser = async () => {
  if (isDemoMode()) {
    await wait(150);
    return { user: DEMO_USER, ...DEMO_USER };
  }
  const response = await API.get("/api/auth/me", { headers: getAuthHeaders() });
  return response.data;
};

export const getAllUsers = async () => {
  if (isDemoMode()) {
    await wait(150);
    return { users: [DEMO_USER] };
  }
  const response = await API.get("/api/auth/users", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("demo_mode");
};

export const isAuthenticated = () => !!getAuthToken();

// ─── HISTORY ─────────────────────────────────────────────

export const getHistory = async (page = 1, limit = 20) => {
  if (isDemoMode()) {
    await wait();
    const start = (page - 1) * limit;
    return {
      history: DEMO_CALLS.slice(start, start + limit),
      total: DEMO_CALLS.length,
      page,
      pages: Math.max(1, Math.ceil(DEMO_CALLS.length / limit)),
    };
  }
  const response = await API.get("/api/history/list", {
    params: { page, limit },
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getHistoryItem = async (analysisId) => {
  if (isDemoMode()) {
    await wait(150);
    const item = DEMO_CALLS.find(
      (c) => c._id === analysisId || c.call_id === analysisId
    );
    if (!item) throw demoError("Sample call not found");
    return { analysis: item, ...item };
  }
  const response = await API.get(`/api/history/${analysisId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteHistory = async (analysisId) => {
  if (isDemoMode()) {
    await wait(150);
    throw demoError("Sample calls can't be deleted in demo mode.");
  }
  const response = await API.delete(`/api/history/${analysisId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getHistoryStats = async () => {
  if (isDemoMode()) {
    await wait(150);
    return getDemoStats();
  }
  const response = await API.get("/api/history/stats", {
    headers: getAuthHeaders(),
  });
  return response.data.stats;
};

export const updateProfile = async (data) => {
  if (isDemoMode()) {
    await wait(150);
    throw demoError("Profile changes are disabled in demo mode.");
  }
  const response = await API.put("/api/auth/update-profile", data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ─── ANALYZE ─────────────────────────────────────────────

export const analyzeCallApi = async (formData) => {
  if (isDemoMode()) {
    await wait(150);
    throw demoError(
      "Live analysis needs the AI backend, which isn't running in demo mode. Use 'Load sample call' to see a real result."
    );
  }
  const response = await API.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

// ─── ADMIN ───────────────────────────────────────────────

const adminDemoBlock = async () => {
  await wait(150);
  throw demoError("The admin panel isn't available in demo mode.");
};

export const getAdminStats = async () => {
  if (isDemoMode()) return adminDemoBlock();
  const response = await API.get("/api/admin/stats", {
    headers: getAuthHeaders(),
  });
  return response.data.stats;
};

export const getAdminUsers = async () => {
  if (isDemoMode()) return adminDemoBlock();
  const response = await API.get("/api/admin/users", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  if (isDemoMode()) return adminDemoBlock();
  const response = await API.put(
    `/api/admin/users/${userId}/role`,
    { role },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  if (isDemoMode()) return adminDemoBlock();
  const response = await API.put(
    `/api/admin/users/${userId}/status`,
    { is_active: isActive },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getAdminCalls = async (page = 1, limit = 20) => {
  if (isDemoMode()) return adminDemoBlock();
  const response = await API.get("/api/admin/calls", {
    params: { page, limit },
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAdminActivity = async (limit = 20) => {
  if (isDemoMode()) return adminDemoBlock();
  const response = await API.get("/api/admin/activity", {
    params: { limit },
    headers: getAuthHeaders(),
  });
  return response.data.activity;
};

export default API;