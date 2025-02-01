const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Address = require('./models/Address');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json()); // To parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Example endpoint to add an address
app.post('/add-address', async (req, res) => {
  try {
    const { name, address, pinCode, city, state, country } = req.body;
    const newAddress = new Address({ name, address, pinCode, city, state, country });
    await newAddress.save();
    res.status(201).send('Address added');
  } catch (error) {
    res.status(500).send('Error adding address');
  }
});

// Set up a simple home route
app.get('/', (req, res) => {
  res.send('Smart Address Book API');
});

// Define port and start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
