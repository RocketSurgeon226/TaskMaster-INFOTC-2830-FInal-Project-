import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: "User",
        // },
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
        userID: {
            type: String,
            required: false,
        }
    },

    {
        timestamps: true,
    }
);

export default mongoose.model("Task", taskSchema);