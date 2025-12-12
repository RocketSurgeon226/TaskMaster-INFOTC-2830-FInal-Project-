import Task from "../models/Task.js";
import User from "../models/User.js";

export const getTasks = async(req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const tasks = await Task.find({ user: userId });
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not load tasks" });
    }
};

export const createTask = async(req, res) => {
    try {
        const task = new Task(req.body);
        const saved = await task.save();
        res.json({ success: true, task: saved });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid task data" });
    }
};

export const updateTask = async(req, res) => {
    try {
        const updated = await Task.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        res.json({ success: true, task: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: "Update failed" });
    }
};

export const deleteTask = async(req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};

export const completeTask = async(req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id, { completed: true }, { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Award points
        const user = await User.findById(task.user);
        if (user) {
            user.points += 10;
            user.save();
            task.pointsEarned = (task.pointsEarned || 0) + 10;
            await task.save();
        }

        res.json({ success: true, task, newPoints: user ? user.points : 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: "Completion failed" });
    }
};