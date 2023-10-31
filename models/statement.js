const mongoose = require("mongoose");

const statementSchema = new mongoose.Schema(
    {
        ownerId: {
            type: String,
            required: true,
            trim: true,
        },
        ownerName: {
            type: String,
            required: true,
            trim: true,
        },
        money: {
            type: Number,
            required: true,
            trim: true,
        },
        acceptedBy: {
            type: String,
            required: true,
            trim: true,
        },
        mainAccept: {
            type : Boolean,
            require : true,
            default : false,
        },
        date: Date,
    }
);

const Statement = mongoose.model("Statement", statementSchema);

module.exports = Statement;