const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('JeevanCare+ Backend is running!');
});

// Import Routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const publicRoutes = require('./routes/public');

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/public', publicRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
