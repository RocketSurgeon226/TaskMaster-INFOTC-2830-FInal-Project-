import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
    user: "",
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000/api";

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
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

  // Load tasks once
  useEffect(() => {
    fetchTasks();
  }, []);

  // Load rewards when user changes
  useEffect(() => {
    fetchRewards(selectedUser);
  }, [selectedUser]);

  // Create task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.user) {
      alert("Select a user for this task.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/tasks`, newTask);
      setTasks((prev) => [...prev, res.data.task]);
      setNewTask({ title: "", description: "", priority: "low", user: "" });
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

      if (selectedUser) {
        fetchRewards(selectedUser);
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

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>TaskMaster</h1>

      {/* Select a User */}
      <div>
        <h3>Enter User ID to View Rewards</h3>
        <input
          type="text"
          placeholder="Type a MongoDB User ID"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ padding: "0.5rem", width: "300px", marginBottom: "1rem" }}
        />
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
          style={{ marginRight: ".5rem" }}
        />

        <input
          type="text"
          placeholder="Description"
          required
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          style={{ marginRight: ".5rem" }}
        />

        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask({ ...newTask, priority: e.target.value })
          }
          style={{ marginRight: ".5rem" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="text"
          placeholder="User ID"
          required
          value={newTask.user}
          onChange={(e) =>
            setNewTask({ ...newTask, user: e.target.value })
          }
          style={{ marginRight: ".5rem", width: "200px" }}
        />

        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <h2>All Tasks</h2>
      {loading ? <p>Loading...</p> : null}

      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: "1rem" }}>
            <strong>{task.title}</strong> — {task.description} —{" "}
            {task.priority} —{" "}
            {task.completed ? "Completed" : "Pending"} — Points:{" "}
            {task.pointsEarned}
            <br />
            <div style={{ marginTop: ".5rem" }}>
              {!task.completed && (
                <button
                  onClick={() => handleCompleteTask(task._id)}
                  style={{ marginRight: ".5rem" }}
                >
                  Complete
                </button>
              )}
              <button onClick={() => handleDeleteTask(task._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Rewards */}
      {selectedUser && (
        <>
          <h2>Rewards</h2>
          {rewards.length === 0 ? (
            <p>No rewards for this user.</p>
          ) : (
            <ul>
              {rewards.map((r) => (
                <li key={r._id}>
                  {r.rewardName} — Points Earned: {r.pointsEarned}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default App;
