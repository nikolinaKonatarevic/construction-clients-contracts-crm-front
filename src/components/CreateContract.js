import { useState, useEffect } from "react";
import { getCustomers } from "../services/customerService";
import { getCompanies } from "../services/companyService";
import { createContract } from "../services/contractService";
import { useNavigate } from "react-router-dom";
import "../css/CreateContract.css";

function CreateContract() {
  const [formData, setFormData] = useState({
    date: "",
    subject: "",
    conclusion: "",
    status: "SIGNED",
    address: "",
    customerId: "",
    companyId: "",
  });

  const [clauses, setClauses] = useState([]);
  const [clauseTitle, setClauseTitle] = useState("");
  const [clauseContent, setClauseContent] = useState("");
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getCustomers().then((res) => setCustomers(res.data));
    getCompanies().then((res) => setCompanies(res.data));
  }, []);

  // Validacija
  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.conclusion) newErrors.conclusion = "Conclusion is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.companyId) newErrors.companyId = "Company is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addClause = () => {
    if (clauseTitle.trim() && clauseContent.trim()) {
      setClauses([
        ...clauses,
        { id: Date.now(), title: clauseTitle, content: clauseContent },
      ]);
      setClauseTitle("");
      setClauseContent("");
    } else {
      alert("Both title and content are required for clause.");
    }
  };

  const deleteClause = (id) => {
    setClauses(clauses.filter((c) => c.id !== id));
  };

  const editClause = (id) => {
    const clause = clauses.find((c) => c.id === id);
    if (clause) {
      setClauseTitle(clause.title);
      setClauseContent(clause.content);
      setClauses(clauses.filter((c) => c.id !== id)); // ukloni stari dok se ne doda novi
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fill all required fields!");
      return;
    }

    const payload = {
      ...formData,
      createContractClauseRecords: clauses.map((c) => ({
        title: c.title,
        content: c.content,
      })),
    };

    console.log("Submitting:", payload);

    createContract(payload)
      .then(() => {
        alert("Contract created successfully!");
        navigate("/contracts");
      })
      .catch((err) => {
        console.error("Error creating contract:", err);
        alert("Error while creating contract!");
      });
  };

  return (
    <div className="create-contract-container">
      <h2>Create Contract</h2>
      <form className="contract-form" onSubmit={handleSubmit}>
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        {errors.date && <span className="error">{errors.date}</span>}

        <label>Subject:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
        />
        {errors.subject && <span className="error">{errors.subject}</span>}

        <label>Conclusion:</label>
        <input
          type="text"
          name="conclusion"
          value={formData.conclusion}
          onChange={handleChange}
        />
        {errors.conclusion && <span className="error">{errors.conclusion}</span>}

        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="SIGNED">SIGNED</option>
          <option value="UNSIGNED">UNSIGNED</option>
          <option value="IN_PROCESS">IN_PROCESS</option>
        </select>

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <span className="error">{errors.address}</span>}

        <label>Customer:</label>
        <select
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
        >
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstname} {c.lastname}
            </option>
          ))}
        </select>
        {errors.customerId && (
          <span className="error">{errors.customerId}</span>
        )}

        <label>Company:</label>
        <select
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
        >
          <option value="">Select company</option>
          {companies.map((co) => (
            <option key={co.id} value={co.id}>
              {co.name}
            </option>
          ))}
        </select>
        {errors.companyId && <span className="error">{errors.companyId}</span>}

        <h3>Contract Clauses</h3>
        <div className="clause-inputs" >
            <input
            type="text"
            placeholder="Clause Title"
            value={clauseTitle}
            onChange={(e) => setClauseTitle(e.target.value)}
            />
            <textarea
            placeholder="Clause Content"
            value={clauseContent}
            onChange={(e) => setClauseContent(e.target.value)}
            />
            <button type="button" onClick={addClause}>
            Add Clause
            </button>
        </div>

        <table className="clause-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clauses.map((cl) => (
              <tr key={cl.id}>
                <td>{cl.title}</td>
                <td>{cl.content}</td>
                <td>
                  <button type="button" onClick={() => editClause(cl.id)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteClause(cl.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="save-btn">
          Save Contract
        </button>
      </form>
    </div>
  );
}

export default CreateContract;
