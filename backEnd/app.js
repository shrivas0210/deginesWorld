import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./src/routers/route.js";

// Load environment variables
dotenv.config();

const app = express();
const Port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});

// Routes
app.use('/api', route);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});