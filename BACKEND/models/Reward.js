import mongoose from "mongoose";

const rewardSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    pointsEarned: {
        type: Number,
        default: 0,
    },
    rewardName: {
        type: String
    }

});

export default mongoose.model("Reward", rewardSchema);