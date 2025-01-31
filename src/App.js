import React, { useState, useEffect } from "react";
import "./App.css"; // Importing CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FaExclamationCircle } from "react-icons/fa"; // For error icon

function App() {
  const [formData, setFormData] = useState({
    name: "",
    pinCode: "",
    city: "",
    state: "",
    address: "",
    country: "India"
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addresses, setAddresses] = useState([]);

  // Fetch addresses from the backend based on the search query
  const fetchAddresses = async (query = "") => {
    try {
      const response = await axios.get(`http://localhost:5000/api/addresses?query=${query}`);
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // UseEffect to fetch addresses when searchQuery changes
  useEffect(() => {
    fetchAddresses(searchQuery);
  }, [searchQuery]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePinCodeChange = async (e) => {
    const pinCode = e.target.value;
  
    // Update formData with pinCode
    setFormData({ ...formData, pinCode });
  
    // Validate if pinCode is exactly 6 digits
    if (pinCode.length === 6) {
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
        const data = response.data[0];
        if (data.Status === "Success") {
          setFormData({
            ...formData,
            city: data.PostOffice[0].District,
            state: data.PostOffice[0].State,
            pinCode
          });
          setErrorMessage(""); // Clear any previous errors
        } else {
          setErrorMessage("Invalid PinCode");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        setErrorMessage("Invalid PinCode");
      }
    } else if (pinCode.length === 0) {
      // Optional: Handle empty pin code input
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid PinCode");
    }
  };
  

 
   
   

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pinCode || !formData.city || !formData.state || !formData.address) {
      setErrorMessage("All fields are required");
      return;
    }
    setErrorMessage("");

    try {
      await axios.post("http://localhost:5000/api/addresses", formData);
      alert("Address saved successfully");
      setFormData({ name: "", pinCode: "", city: "", state: "", address: "" });
      fetchAddresses(); // Reload addresses after saving
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Smart Address Book</h1>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by City or State"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center mb-3">
          <FaExclamationCircle className="me-2" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address:</label>
          <input
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter your address"
          />
        </div>


        <div className="mb-3">
          <label className="form-label">Pin Code:</label>
          <input
            type="text"
            className="form-control"
            name="pinCode"
            value={formData.pinCode}
            onChange={handlePinCodeChange}
            equired
            placeholder="Enter your PIN code"

          />
        </div>

        <div className="mb-3">
          <label className="form-label">City:</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">State:</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Country:</label>
          <input
            className="form-control"
            name="country"
            value={formData.country}
            onChange={handleChange}
            readOnly
          />
        </div>

        <button type="submit" className=" w-100">
          Save Address
        </button>
      </form>

      {/* Display searched addresses */}
      {searchQuery && addresses.length > 0 ? (
        <div>
          <h3 className="mt-5">Searched Addresses</h3>
          <ul className="list-group mt-3">
            {addresses.map((address) => (
              <li key={address._id} className="list-group-item">
                <strong>{address.name}</strong><br />
                {address.address}<br />
                {address.city}, {address.state} - {address.pinCode}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        searchQuery && <div className="mt-3">No matching addresses found</div> // Optional message when no addresses match
      )}
     </div>
  );
}

export default App;

