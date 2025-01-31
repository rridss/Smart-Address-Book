const express = require("express");
const router = express.Router();
const Address = require("../models/Address");

// Route for saving an address
router.post("/save", async (req, res) => {
  try {
    const { name, address, pinCode, city, state } = req.body;

    const newAddress = new Address({
      name,
      address,
      pinCode,
      city,
      state,
      country
    });

    await newAddress.save();
    res.status(200).json({ success: true, message: "Address saved successfully!" });
  } catch (err) {
    console.error("Error saving address:", err);
    res.status(500).json({ success: false, message: "Failed to save address" });
  }
});

// Route to search addresses
router.get("/search", async (req, res) => {
  const query = req.query.query || "";

  try {
    // Search by city or state
    const addresses = await Address.find({
      $or: [
        { city: { $regex: query, $options: "i" } },
        { state: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(addresses);
  } catch (err) {
    console.error("Error fetching addresses:", err);
    res.status(500).json({ success: false, message: "Failed to fetch addresses" });
  }
});

module.exports = router;
