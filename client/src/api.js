const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("venusflow_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  loginWithGoogle(payload) {
    return request("/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  me() {
    return request("/auth/me");
  },
  getDashboard() {
    return request("/dashboard");
  },
  getUsers() {
    return request("/users");
  },
  getCurrentUser() {
    return request("/users/me");
  },
  createUser(payload) {
    return request("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateProfile(payload) {
    return request("/users/update", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  changePassword(payload) {
    return request("/users/change-password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  updateUserRole(userId, role) {
    return request(`/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  },
  getTasks(params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)
    ).toString();
    return request(`/tasks${query ? `?${query}` : ""}`);
  },
  createTask(payload) {
    return request("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateTask(taskId, payload) {
    return request(`/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteTask(taskId) {
    return request(`/tasks/${taskId}`, {
      method: "DELETE",
    });
  },
  restoreTask(taskId) {
    return request(`/tasks/${taskId}/restore`, {
      method: "POST",
    });
  },
  getTaskAudit(taskId) {
    return request(`/tasks/${taskId}/audit`);
  },
  getTaskComments(taskId) {
    return request(`/tasks/${taskId}/comments`);
  },
  addTaskComment(taskId, body) {
    return request(`/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  },
  forgotPassword(email) {
    return request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  resetPassword(payload) {
    return request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteUser(userId) {
    return request(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};



