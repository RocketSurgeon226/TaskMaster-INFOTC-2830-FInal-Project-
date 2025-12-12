import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
  });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8000/api";

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  // Fetch current user
  const fetchCurrentUser = async (token) => {
    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      fetchTasks(res.data.user.id);
      fetchRewards(res.data.user.id);
    } catch (err) {
      console.error("Error fetching user:", err);
      localStorage.removeItem("token");
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/signup`, authForm);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setAuthForm({ username: "", password: "" });
      fetchTasks(res.data.user.id);
      fetchRewards(res.data.user.id);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, authForm);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setAuthForm({ username: "", password: "" });
      fetchTasks(res.data.user.id);
      fetchRewards(res.data.user.id);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTasks([]);
    setRewards([]);
  };

  // Fetch tasks
  const fetchTasks = async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/tasks?userId=${userId}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
    setLoading(false);
  };

  // Fetch rewards
  const fetchRewards = async (userID) => {
    if (!userID) {
      setRewards([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/rewards/${userID}`);
      setRewards(res.data.rewards);
    } catch (err) {
      console.error("Error loading rewards:", err);
    }
  };

  // Create task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in first");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/tasks`, {
        ...newTask,
        user: user.id,
      });
      setTasks((prev) => [...prev, res.data.task]);
      setNewTask({ title: "", description: "", priority: "low" });
      // Refresh rewards after creating task
      fetchRewards(user.id);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // Complete task
  const handleCompleteTask = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/tasks/${id}/complete`);

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data.task : task))
      );

      if (user) {
        fetchRewards(user.id);
        // Update user points
        fetchCurrentUser(localStorage.getItem("token"));
      }
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Update/Edit task
const handleUpdateTask = async (id, updates) => {
  try {
    const res = await axios.put(`${API_BASE}/tasks/${id}`, updates);
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? res.data.task : task))
    );
    setEditingTask(null); // Close edit mode
  } catch (err) {
    console.error("Error updating task:", err);
    alert("Failed to update task");
  }
};

  // If not logged in, show login/signup form
  if (!user) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: "400px", margin: "0 auto" }}>
        <h1>TaskMaster</h1>
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => setShowLogin(true)}
            style={{
              marginRight: "1rem",
              fontWeight: showLogin ? "bold" : "normal",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            style={{
              fontWeight: !showLogin ? "bold" : "normal",
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={showLogin ? handleLogin : handleSignup}>
          <h2>{showLogin ? "Login" : "Sign Up"}</h2>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Username"
              required
              value={authForm.username}
              onChange={(e) =>
                setAuthForm({ ...authForm, username: e.target.value })
              }
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="password"
              placeholder="Password"
              required
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
            {showLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    );
  }

  // Logged in view
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>TaskMaster</h1>
        <div>
          <span style={{ marginRight: "1rem" }}>
            Welcome, <strong>{user.username}</strong>! Points: <strong>{user.points}</strong>
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Create a Task */}
      <h2>Create Task</h2>
      <form onSubmit={handleCreateTask} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          required
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
          style={{ marginRight: ".5rem", padding: "0.5rem" }}
        />

        <input
          type="text"
          placeholder="Description"
          required
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          style={{ marginRight: ".5rem", padding: "0.5rem" }}
        />

        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask({ ...newTask, priority: e.target.value })
          }
          style={{ marginRight: ".5rem", padding: "0.5rem" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Add Task</button>
      </form>

      {/* Task List */}
      <h2>My Tasks</h2>
      {loading ? <p>Loading...</p> : null}

      {tasks.length === 0 ? (
        <p>No tasks yet. Create one above!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
  <li key={task._id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
    {editingTask === task._id ? (
      // EDIT MODE
      <div>
        <input
          type="text"
          defaultValue={task.title}
          id={`title-${task._id}`}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          placeholder="Title"
        />
        <input
          type="text"
          defaultValue={task.description}
          id={`description-${task._id}`}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          placeholder="Description"
        />
        <select
          defaultValue={task.priority}
          id={`priority-${task._id}`}
          style={{ padding: "0.5rem", marginBottom: "0.5rem" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div style={{ marginTop: "0.5rem" }}>
          <button
            onClick={() => {
              const title = document.getElementById(`title-${task._id}`).value;
              const description = document.getElementById(`description-${task._id}`).value;
              const priority = document.getElementById(`priority-${task._id}`).value;
              handleUpdateTask(task._id, { title, description, priority });
            }}
            style={{ marginRight: "0.5rem" }}
          >
            Save
          </button>
          <button onClick={() => setEditingTask(null)}>Cancel</button>
        </div>
      </div>
    ) : (
      // VIEW MODE
      <div>
        <strong>{task.title}</strong> — {task.description} —{" "}
        {task.priority} —{" "}
        {task.completed ? "✅ Completed" : "⏳ Pending"} — Points:{" "}
        {task.pointsEarned || 0}
        <br />
        <div style={{ marginTop: ".5rem" }}>
          {!task.completed && (
            <>
              <button
                onClick={() => handleCompleteTask(task._id)}
                style={{ marginRight: ".5rem" }}
              >
                Complete
              </button>
              <button
                onClick={() => setEditingTask(task._id)}
                style={{ marginRight: ".5rem" }}
              >
                Edit
              </button>
            </>
          )}
          <button onClick={() => handleDeleteTask(task._id)}>
            Delete
          </button>
        </div>
      </div>
    )}
  </li>
))}
        </ul>
      )}

      {/* Rewards */}
      <h2>My Rewards</h2>
      {rewards.length === 0 ? (
        <p>No rewards yet. Complete tasks to earn points!</p>
      ) : (
        <ul>
          {rewards.map((r) => (
            <li key={r._id}>
              {r.rewardName} — Points Earned: {r.pointsEarned}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;