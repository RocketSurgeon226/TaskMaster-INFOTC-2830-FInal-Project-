import Reward from "../models/Reward.js";

export const getRewards = async(req, res) => {
    try {
        const rewards = await Reward.find({ user: req.params.userID });
        res.json({ success: true, rewards });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not load rewards" });
    }
};