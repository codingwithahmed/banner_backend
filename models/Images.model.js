const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    image: {
        type: String,
        default: ""
    },
    prompt: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Image = mongoose.model("Image", imageSchema)
module.exports = Image