import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS to bypass ISP blocking

import express from 'express';
// ... rest of your importsimport express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config();
console.log("Attempting to connect with URI:", process.env.MONGODB_URI?.split('@')[1]); 
// This logs only the cluster address, keeping your password safe in the console.

const app = express();
app.use(cors()); // This allows all websites to talk to your backend
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
// --- MONGODB CONNECTION ---
const dbUri = process.env.MONGODB_URI;

if (!dbUri) {
    console.error("❌ ERROR: MONGODB_URI is not defined in .env file!");
    process.exit(1); // Stop the server if there's no DB string
}

mongoose.connect(dbUri)
    .then(() => console.log("🌍 Voyage DB Connected!"))
    .catch(err => console.error("❌ DB Error:", err));

const bookingSchema = new mongoose.Schema({
    destination: String,
    date: Date,
    passengers: Number,
    email: String,
});

const Booking = mongoose.model('Booking', bookingSchema);

// Simple Route to test
app.get('/', (req, res) => res.send("Voyage API is Running! 🚢"));

// Create Booking Route
app.post('/api/bookings/create', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ success: true, data: newBooking });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});
app.get('/api/bookings/all', async (req, res) => {
  try {
    const bookings = await Booking.find(); // This fetches everything from MongoDB
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));