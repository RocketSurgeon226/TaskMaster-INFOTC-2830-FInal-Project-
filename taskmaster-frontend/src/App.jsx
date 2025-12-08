import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "low" });
  const [selectedUser, setSelectedUser] = useState(""); // set userID for fetching rewards
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:3000/api"; 

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  // Fetch rewards for a user
  const fetchRewards = async (userID) => {
    if (!userID) return;
    try {
      const res = await axios.get(`${API_BASE}/rewards/${userID}`);
      setRewards(res.data.rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchRewards(selectedUser);
  }, [selectedUser]);

  // Create a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/tasks`, newTask);
      setTasks([...tasks, res.data.task]);
      setNewTask({ title: "", description: "", priority: "low" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Complete a task
  const handleCompleteTask = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/tasks/${id}/complete`);
      setTasks(tasks.map((task) => (task._id === id ? res.data.task : task)));
      if (selectedUser) fetchRewards(selectedUser);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>TaskMaster</h1>

      {/* User Selection */}
      <div>
        <input
          type="text"
          placeholder="Enter User ID"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
        />
      </div>

      {/* Create Task */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          style={{ marginRight: "0.5rem" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <h2>Tasks</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} style={{ marginBottom: "1rem" }}>
              <strong>{task.title}</strong> - {task.description} - {task.priority} -{" "}
              {task.completed ? "Completed" : "Pending"} - Points: {task.pointsEarned}
              <div style={{ marginTop: "0.5rem" }}>
                {!task.completed && (
                  <button onClick={() => handleCompleteTask(task._id)} style={{ marginRight: "0.5rem" }}>
                    Complete
                  </button>
                )}
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Rewards */}
      {selectedUser && (
        <>
          <h2>Rewards for User</h2>
          {rewards.length === 0 ? (
            <p>No rewards yet.</p>
          ) : (
            <ul>
              {rewards.map((reward) => (
                <li key={reward._id}>
                  {reward.rewardName} - Points Earned: {reward.pointsEarned}
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
