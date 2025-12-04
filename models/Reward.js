import mongoose from "mongoose";

const rewardSchema = mongoose.Schema(
    {
        userID: {
            type: String,
            required: true,
        },
        pointsEarned: {
            type: Number,
            default: 0,
        },
        rewardName: {
            type: String
        }

    }
);

export default mongoose.model("Reward", rewardSchema);
