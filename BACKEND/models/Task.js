import mongoose from "mongoose";

const taskSchema = mongoose.Schema({

        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },
        completed: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User",
        },
        dueDate: {
            type: Date,
            required: false,
        },
        pointsEarned: {
            type: Number,
            default: 0,

        }

    },

    {
        timestamps: true,
    }
);

export default mongoose.model("Task", taskSchema);