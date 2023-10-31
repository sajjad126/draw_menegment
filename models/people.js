const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        user_name: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["moderator","admin", "user",],
            default: "user",
        },
        draw_stat: {
            type: Boolean,
            default: false,
        },
        draw_win: {
            type: Number,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const People = mongoose.model("People", peopleSchema);

module.exports = People;