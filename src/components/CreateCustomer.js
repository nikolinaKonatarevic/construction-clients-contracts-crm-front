import { useState } from "react";
import { createCustomer } from "../services/customerService";
import { useNavigate } from "react-router-dom";
import "../css/CreateCustomer.css"; // povezivanje css fajla

function CreateCustomer() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    JMBG: "",
    idCardNum: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const navigate = useNavigate();

    // regex validacije
  const nameRegex = /^[A-Za-zÀ-ž\s]+$/; // samo slova (podržava i dijakritike tipa šđčćž)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const jmbgRegex = /^\d{13}$/;
  const idCardRegex = /^\d{9}$/;
  const phoneRegex = /^\+?\d+$/; // može + na početku, posle samo brojevi

  const validate = () => {
    if (!nameRegex.test(formData.firstname)) {
      alert("Firstname must contain only letters!");
      return false;
    }
    if (!nameRegex.test(formData.lastname)) {
      alert("Lastname must contain only letters!");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email format!");
      return false;
    }
    if (!jmbgRegex.test(formData.JMBG)) {
      alert("JMBG must have exactly 13 digits!");
      return false;
    }
    if (!idCardRegex.test(formData.idCardNum)) {
      alert("ID Card Number must have exactly 9 digits!");
      return false;
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Phone number must contain only numbers and optional + at the beginning!");
      return false;
    }
    return true;
  };

  // kada se menja input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // kada se forma submituje
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createCustomer(formData);
      alert("Customer successfully created!");
      navigate("/customers"); // preusmeravanje na listu
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="create-customer-container">
      <h2>Create Customer</h2>
      <form onSubmit={handleSubmit} className="create-customer-form">
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="JMBG"
          placeholder="JMBG"
          value={formData.JMBG}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="idCardNum"
          placeholder="ID Card Number"
          value={formData.idCardNum}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <button type="submit">💾 Save</button>
      </form>
    </div>
  );
}

export default CreateCustomer;