import { useDeferredValue, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./api";
import { DashboardSkeleton } from "./components/ui/Skeleton";
import { ActivityView } from "./features/activity/ActivityView";
import { AuthView } from "./features/auth/AuthView";
import { ResetPasswordPage } from "./features/auth/ResetPasswordPage";

import { OverviewView } from "./features/overview/OverviewView";
import { TeamView } from "./features/team/TeamView";
import { TasksView } from "./features/tasks/TasksView";
import { useAuth } from "./contexts/AuthContext";
import { useToast } from "./contexts/ToastContext";
import { AppShell } from "./layout/AppShell";
import { ProfilePage } from "./pages/Profile";
import { SettingsPage } from "./pages/Settings";
import { tr } from "./utils/i18n";

const emptyTask = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assigneeId: "",
};



const emptyMember = {
  name: "",
  email: "",
  password: "",
  role: "member",
};

function App() {
  const navigate = useNavigate();
  const { user, authLoading, setSession, refreshUser, logout } = useAuth();
  const { pushToast } = useToast();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [audit, setAudit] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");
  const [currentView, setCurrentView] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    includeDeleted: "false",
  });
  const [authForm, setAuthForm] = useState({
    organizationName: "",
    name: "",
    email: "",
    password: "",
  });
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [memberForm, setMemberForm] = useState(emptyMember);

  async function loadTaskDetails(task) {
    setSelectedTask(task);
    const [auditRes, commentsRes] = await Promise.all([
      api.getTaskAudit(task.id),
      api.getTaskComments(task.id),
    ]);
    setAudit(auditRes.audit);
    setComments(commentsRes.comments);
  }

  function updateForm(setter, key, value) {
    setter((current) => ({ ...current, [key]: value }));
  }

  function resetWorkspaceState() {
    setDashboard(null);
    setUsers([]);
    setTasks([]);
    setSelectedTask(null);
    setAudit([]);
    setComments([]);
  }

  function handleLogout() {
    logout();
    resetWorkspaceState();
    navigate("/");
  }

  async function loadWorkspace(taskId) {
    if (!localStorage.getItem("venusflow_token")) {
      setLoading(false);
      return;
    }

    setBusy(true);

    try {
      const [dashboardRes, usersRes, tasksRes] = await Promise.all([
        api.getDashboard(),
        api.getUsers(),
        api.getTasks(filters),
      ]);

      await refreshUser();
      setDashboard(dashboardRes);
      setUsers(usersRes.users);
      setTasks(tasksRes.tasks);

      const nextId = taskId || selectedTask?.id || tasksRes.tasks[0]?.id;
      if (nextId) {
        const nextTask = tasksRes.tasks.find((item) => item.id === nextId);
        if (nextTask) {
          await loadTaskDetails(nextTask);
        }
      } else {
        setSelectedTask(null);
        setAudit([]);
        setComments([]);
      }
    } catch (error) {
      pushToast(error.message, "error");
      handleLogout();
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, []);

  useEffect(() => {
    if (user) {
      loadWorkspace();
    }
  }, [filters.status, filters.priority, filters.search, filters.includeDeleted]);

  useEffect(() => {
    setFilters((current) => ({ ...current, search: deferredSearchQuery }));
  }, [deferredSearchQuery]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setBusy(true);

    try {
      if (mode === "forgot-password") {
        const result = await api.forgotPassword(authForm.email);
        
        // Log to browser console to help the user if email is not working
        if (result._devResetLink) {
          console.log("-----------------------------------------");
          console.log("DEVELOPMENT RESET LINK:", result._devResetLink);
          console.log("-----------------------------------------");
        }

        pushToast(result.message, "success");
        setMode("login");
        return;
      }


      const result =
        mode === "register"
          ? await api.register(authForm)
          : await api.login({
              email: authForm.email,
              password: authForm.password,
            });

      setSession(result);
      pushToast(
        mode === "register"
          ? tr("Workspace created successfully.", "वर्कस्पेस सफलतापूर्वक बनाया गया।")
          : tr("Logged in successfully.", "सफलतापूर्वक लॉगिन हो गया।"),
        "success",
      );
      await loadWorkspace();
    } catch (error) {

      pushToast(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleTaskSubmit(event) {
    event.preventDefault();
    try {
      const payload = {
        ...taskForm,
        dueDate: taskForm.dueDate || null,
        assigneeId: taskForm.assigneeId || null,
      };



      if (editingTaskId) {
        await api.updateTask(editingTaskId, payload);
        pushToast(tr("Task updated successfully.", "टास्क सफलतापूर्वक अपडेट हुआ।"), "success");
      } else {
        await api.createTask(payload);
        pushToast(tr("Task created successfully.", "टास्क सफलतापूर्वक बनाया गया।"), "success");
      }

      setEditingTaskId("");
      setTaskForm(emptyTask);
      await loadWorkspace(editingTaskId || undefined);
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  async function handleCreateMember(event) {
    event.preventDefault();

    try {
      await api.createUser(memberForm);
      setMemberForm(emptyMember);
      pushToast(tr("Member added successfully.", "सदस्य सफलतापूर्वक जोड़ा गया।"), "success");
      await loadWorkspace();
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  async function handleRemoveMember(userId) {
    if (!window.confirm(tr("Are you sure you want to remove this member? This action is permanent.", "क्या आप वाकई इस सदस्य को हटाना चाहते हैं? यह क्रिया स्थायी है।"))) {
      return;
    }

    try {
      await api.deleteUser(userId);
      pushToast(tr("Member removed successfully.", "सदस्य सफलतापूर्वक हटा दिया गया।"), "success");
      await loadWorkspace();
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  function startTaskEdit(task) {
    setCurrentView("tasks");
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      assigneeId: task.assigneeId || "",
    });


  }

  async function handleDelete(taskId) {
    try {
      await api.deleteTask(taskId);
      pushToast(tr("Task archived.", "टास्क आर्काइव हो गया।"), "success");
      await loadWorkspace();
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  async function handleRestore(taskId) {
    try {
      await api.restoreTask(taskId);
      pushToast(tr("Task restored.", "टास्क वापस लाया गया।"), "success");
      await loadWorkspace(taskId);
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    if (!selectedTask || !commentBody.trim()) {
      return;
    }

    try {
      await api.addTaskComment(selectedTask.id, commentBody.trim());
      setCommentBody("");
      await loadTaskDetails(selectedTask);
      pushToast(tr("Comment posted.", "कमेंट पोस्ट हो गया।"), "success");
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  async function handleDeleteComment(commentId) {
    if (!selectedTask) return;
    try {
      await api.deleteTaskComment(selectedTask.id, commentId);
      await loadTaskDetails(selectedTask);
      pushToast(tr("Comment deleted.", "कमेंट हटा दिया गया।"), "success");
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  function handleViewNavigation(view) {
    setCurrentView(view);
    navigate("/");
  }

  function handleQuickAction(actionId) {
    if (actionId === "create-task") {
      handleViewNavigation("tasks");
      setEditingTaskId("");
      setTaskForm(emptyTask);
      pushToast(tr("Ready to create a new task.", "नया टास्क बनाने के लिए तैयार।"), "info");
    }

    if (actionId === "invite-member") {
      navigate("/settings?tab=workspace");
      pushToast(tr("Workspace settings opened.", "वर्कस्पेस सेटिंग्स खुल गईं।"), "info");
    }

    if (actionId === "open-profile") {
      navigate("/profile");
    }

    if (actionId === "open-settings") {
      navigate("/settings");
    }
  }

  function renderDashboardHome() {
    switch (currentView) {
      case "tasks":
        return (
          <TasksView
            users={users}
            taskForm={taskForm}
            editingTaskId={editingTaskId}
            filters={filters}
            tasks={tasks}
            selectedTask={selectedTask}
            userRole={user.role}
            onTaskChange={(key, value) => updateForm(setTaskForm, key, value)}
            onCancelEdit={() => {
              setEditingTaskId("");
              setTaskForm(emptyTask);
            }}
            onTaskSubmit={handleTaskSubmit}
            onFilterChange={(key, value) => updateForm(setFilters, key, value)}
            onSelectTask={loadTaskDetails}
            onEditTask={startTaskEdit}
            onDeleteTask={handleDelete}
            onRestoreTask={handleRestore}
            audit={audit}
            comments={comments}
            commentBody={commentBody}
            onCommentChange={setCommentBody}
            onCommentSubmit={handleCommentSubmit}
            onDeleteComment={handleDeleteComment}
          />
        );
      case "team":
        return (
          <TeamView
            user={user}
            users={users}
            memberForm={memberForm}
            onMemberChange={(key, value) => updateForm(setMemberForm, key, value)}
            onMemberSubmit={handleCreateMember}
            onRemoveMember={handleRemoveMember}
          />
        );
      case "activity":
        return (
          <ActivityView
            activity={dashboard?.activity || []}
            selectedTask={selectedTask}
            audit={audit}
            comments={comments}
          />
        );
      default:
        return (
          <OverviewView
            dashboard={dashboard}
            tasks={tasks}
            users={users}
            onNavigate={setCurrentView}
            onDeleteTask={handleDelete}
          />
        );
    }
  }

  if (!user && !authLoading) {
    return (
      <Routes>
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
        <Route
          path="*"
          element={
            <AuthView
              mode={mode}
              busy={busy}
              message=""
              authForm={authForm}
              onModeChange={setMode}
              onChange={(key, value) => updateForm(setAuthForm, key, value)}
              onSubmit={handleAuthSubmit}
            />
          }
        />
      </Routes>
    );
  }

  if (loading || authLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <AppShell
      user={user}
      currentView={currentView}
      sidebarCollapsed={sidebarCollapsed}
      mobileSidebarOpen={mobileSidebarOpen}
      searchQuery={searchQuery}
      onNavigate={handleViewNavigation}
      onLogout={handleLogout}
      onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      onMobileMenuToggle={() => setMobileSidebarOpen((current) => !current)}
      onSearchChange={setSearchQuery}
      onQuickAction={handleQuickAction}
    >
      <Routes>
        <Route path="/" element={renderDashboardHome()} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {busy ? <div className="text-right text-sm text-ink-500">{tr("Syncing workspace...", "वर्कस्पेस सिंक हो रहा है...")}</div> : null}
    </AppShell>
  );
}


export default App;
