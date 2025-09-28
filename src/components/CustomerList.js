import { useEffect, useState } from "react";
import { getCustomers, deleteCustomer } from "../services/customerService";
import { Link } from "react-router-dom";
import "../css/CustomerList.css";

function CustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers().then((res) => setCustomers(res.data));
  }, []);

const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
  if (confirmDelete) {
    deleteCustomer(id)
      .then(() => {
        setCustomers(customers.filter((c) => c.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting customer:", err);
        alert("Failed to delete customer.");
      });
  }
};


  return (
    <div className="customer-list-container">
      <h2>Customers</h2>
      <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.firstname} {c.lastname}</td>
              <td>{c.email}</td>
              <td>{c.phoneNumber}</td>
              <td className="customer-actions">
                <Link to={`/edit/${c.id}`}>✏ Edit</Link>
                <button onClick={() => handleDelete(c.id)}>🗑 Delete</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
