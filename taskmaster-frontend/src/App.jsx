import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";


// Task Context (Stores tasks globally in one place)

const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);

  // Load tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a task
  const addTask = async (task) => {
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", task);
      setTasks([...tasks, res.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Mark task complete → update points
  const completeTask = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        completed: true,
      });

      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      setPoints((prev) => prev + 10); 
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const value = {
    tasks,
    points,
    addTask,
    deleteTask,
    completeTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};


// Task Form 

const TaskForm = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      priority,
      completed: false,
    });

    setTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "1rem",
        border: "1px solid #ccc",
        marginBottom: "1rem",
        borderRadius: "8px",
      }}
    >
      <h3>Add Task</h3>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{ padding: "8px", width: "100%" }}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button
        type="submit"
        style={{
          marginTop: "10px",
          padding: "8px 14px",
          background: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "6px",
        }}
      >
        Add Task
      </button>
    </form>
  );
};


// Task List Component

const TaskList = () => {
  const { tasks, deleteTask, completeTask } = useTasks();

  return (
    <div>
      <h2>Your Tasks</h2>

      {tasks.length === 0 && <p>No tasks yet. Add one above!</p>}

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: task.completed ? "#d4ffd4" : "white",
          }}
        >
          <h3>
            {task.title}{" "}
            <span style={{ fontSize: "0.8rem" }}>({task.priority})</span>
          </h3>

          <p>Status: {task.completed ? "Completed" : "Pending"}</p>

          <button
            onClick={() => completeTask(task._id)}
            disabled={task.completed}
            style={{
              padding: "6px 10px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginRight: "8px",
              borderRadius: "6px",
            }}
          >
            Complete
          </button>

          <button
            onClick={() => deleteTask(task._id)}
            style={{
              padding: "6px 10px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};


// Reward Tracker

const RewardTracker = () => {
  const { points } = useTasks();

  return (
    <div
      style={{
        padding: "1rem",
        marginTop: "1rem",
        border: "2px solid gold",
        borderRadius: "8px",
        background: "#fff9d6",
      }}
    >
      <h2>Reward Points</h2>
      <p>You have earned: <strong>{points}</strong> points.</p>
    </div>
  );
};


// MAIN APP 

export default function App() {
  return (
    <TaskProvider>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
        <h1>TaskMaster</h1>
        <TaskForm />
        <TaskList />
        <RewardTracker />
      </div>
    </TaskProvider>
  );
}