import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/Task.js";
import User from "./models/User.js";
import Reward from "./models/Reward.js";


dotenv.config();

const sampleUsers = [{
        username: "janeDoe01",
        points: 0


    },
    {
        username: "johnDoe02",
        points: 10
    },
    {
        username: "johnDoe03",
        points: 5
    }
]

const seedDatabase = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to MongoDB");

        await Task.deleteMany({});
        await User.deleteMany({});
        await Reward.deleteMany({});

        const users = await User.insertMany(sampleUsers);
        console.log("users have seeded");
        console.log("user IDs:", users.map(u => u._id));


        const sampleTasks = [{
                title: "Lab Report",
                description: "Finish Lab report and turn in on Canvas",
                priority: "high",
                completed: false,
                dueDate: new Date("2025-12-12"),
                pointsEarned: 0,
                user: users[0]._id
            },
            {
                title: "Study for Biology Final",
                description: "Review chapters 5-8 &create flashcards",
                priority: "high",
                completed: false,
                dueDate: new Date("2025-12-10"),
                pointsEarned: 0,
                user: users[0]._id
            },
            {
                title: "Read Chapter 16",
                description: "Finish reading for class discussion tomorrow",
                priority: "high",
                completed: true,
                dueDate: new Date("2025-12-7"),
                pointsEarned: 10,
                user: users[1]._id
            },
            {
                title: "Club Meeting",
                description: "Attend GBM in Ketchum",
                priority: "low",
                completed: false,
                dueDate: new Date("2025-12-9"),
                pointsEarned: 0,
                user: users[1]._id

            },
            {
                title: " Final Project",
                description: "finish group project and create presentation",
                priority: "high",
                completed: false,
                dueDate: new Date("2025-12-15"),
                pointsEarned: 0,
                user: users[2]
            }
        ];

        await Task.insertMany(sampleTasks);
        console.log("tasks have seeded");


        const sampleRewards = [{
                user: users[0]._id,
                pointsEarned: 15,
                rewardName: "Treat yourself to a Treat!"
            },
            {
                user: users[2]._id,
                pointsEarned: 10,
                rewardName: "30 minute break!"
            }
        ];

        await Reward.insertMany(sampleRewards);
        console.log("rewards have seeded");

        console.log("database seeded successfully");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed!", error);
        process.exit(1);
    }
};

seedDatabase();