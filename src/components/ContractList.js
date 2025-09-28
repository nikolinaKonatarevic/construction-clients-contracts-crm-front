import { useEffect, useState } from "react";
import { getContracts } from "../services/contractService";
import { getCustomerById } from "../services/customerService";
import { getCompanyById } from "../services/companyService.js";
import "../css/ContractList.css";

function ContractList() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    getContracts()
      .then(async (res) => {
        const enrichedContracts = await Promise.all(
          res.data.map(async (c) => {
            const customerRes = await getCustomerById(c.customerId);
            const companyRes = await getCompanyById(c.companyId);

            return {
              ...c,
              customerName: `${customerRes.data.firstname} ${customerRes.data.lastname}`,
              companyName: companyRes.data.name,
            };
          })
        );
        setContracts(enrichedContracts);
      })
      .catch((err) => console.error("Error fetching contracts:", err));
  }, []);

  return (
    <div className="contract-list-container">
      <h2>Contracts</h2>
      <table className="contract-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Subject</th>
            <th>Conclusion</th>
            <th>Status</th>
            <th>Address</th>
            <th>Company</th>
            <th>Customer</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.date}</td>
              <td>{c.subject}</td>
              <td>{c.conclusion}</td>
              <td>{c.status}</td>
              <td>{c.address}</td>
              <td>{c.companyName}</td>
              <td>{c.customerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContractList;
