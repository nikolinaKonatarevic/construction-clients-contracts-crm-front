import { useState, useEffect } from "react";
import { getCustomers } from "../services/customerService";
import { getCompanies } from "../services/companyService";
import { getContractById, updateContract } from "../services/contractService";
import { useNavigate, useParams } from "react-router-dom";
import "../css/CreateContract.css";

function UpdateContract() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getCustomers(),
      getCompanies(),
      getContractById(id)
    ])
      .then(([customersRes, companiesRes, contractRes]) => {
        setCustomers(customersRes.data);
        setCompanies(companiesRes.data);

        const contract = contractRes.data;
        console.log("Contract data:", contract);
        console.log("Contract clauses:", contract.contractClauseRecords);
        
        setFormData({
          date: contract.date || "",
          subject: contract.subject || "",
          conclusion: contract.conclusion || "",
          status: contract.status || "SIGNED",
          address: contract.address || "",
          customerId: contract.customerId || contract.customer?.id || "",
          companyId: contract.companyId || contract.company?.id || "",
        });

        // Load existing clauses from contractClauseRecords
        const existingClauses = (contract.contractClauseRecords || []).map((clause) => ({
          id: clause.id || `existing-${Date.now()}-${Math.random()}`,
          title: clause.title || "",
          content: clause.content || "",
          existingId: clause.id // Store the real ID for updates
        }));

        console.log("Formatted clauses:", existingClauses);
        setClauses(existingClauses);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        alert("Error loading contract data!");
        setLoading(false);
      });
  }, [id]);

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
      const newClause = {
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: clauseTitle.trim(),
        content: clauseContent.trim(),
        existingId: null // Mark as new clause
      };
      setClauses([...clauses, newClause]);
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
      setClauses(clauses.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fill all required fields!");
      return;
    }

    // Prepare updateContractClauseRecords for the update payload
    const updateContractClauseRecords = clauses.map((clause) => {
      const clauseData = {
        title: clause.title,
        content: clause.content,
      };
      
      // Only include id for existing clauses (not newly added ones)
      if (clause.existingId) {
        clauseData.id = clause.existingId;
      }
      
      return clauseData;
    });

    const payload = {
      ...formData,
      updateContractClauseRecords: updateContractClauseRecords,
    };

    console.log("Updating contract with payload:", payload);

    updateContract(id, payload)
      .then(() => {
        alert("Contract updated successfully!");
        navigate("/contracts");
      })
      .catch((err) => {
        console.error("Error updating contract:", err);
        alert("Error while updating contract!");
      });
  };

  if (loading) {
    return <div className="create-contract-container"><h2>Loading...</h2></div>;
  }

  return (
    <div className="create-contract-container">
      <h2>Update Contract</h2>
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
        <select name="customerId" value={formData.customerId} onChange={handleChange}>
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstname} {customer.lastname}
            </option>
          ))}
        </select>
        {errors.customerId && <span className="error">{errors.customerId}</span>}

        <label>Company:</label>
        <select name="companyId" value={formData.companyId} onChange={handleChange}>
          <option value="">Select company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.companyId && <span className="error">{errors.companyId}</span>}

        <h3>Contract Clauses</h3>
        <div className="clause-inputs">
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
          <button type="button" onClick={addClause}>Add Clause</button>
        </div>

        {clauses.length > 0 ? (
          <table className="clause-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clauses.map((clause) => (
                <tr key={clause.id}>
                  <td>{clause.title}</td>
                  <td>{clause.content}</td>
                  <td className="actions">
                    <button type="button" onClick={() => editClause(clause.id)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => deleteClause(clause.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-clauses">No clauses added yet.</p>
        )}

        <button type="submit" className="save-btn">
          Update Contract
        </button>
      </form>
    </div>
  );
}

export default UpdateContract;