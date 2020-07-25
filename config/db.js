const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.bold)
    } catch (err) {
        console.log(`Error: ${err.message}`.red)
        process.exit(1)
    }
}

module.exports = connectDb
