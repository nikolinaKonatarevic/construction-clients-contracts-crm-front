
import './App.css';
import { BrowserRouter, RouterProvider, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import CustomerList from "./components/CustomerList";
import CreateCustomer from './components/CreateCustomer';
import UpdateCustomer from './components/UpdateCustomer';
import ContractList from "./components/ContractList";
import EditContract from "./components/UpdateContract"; 
import CreateContract from './components/CreateContract';
import { useState } from "react";


function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <BrowserRouter>
        <div className="App">
          <header className="App-header">
          <h1 className = "header-h1">HouseInvest</h1>
          <h2 className = "header-h2">Construction Company</h2>
          <div className="header-menu">
            <button 
              className="menu-button" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              ☰ Menu
            </button>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/customers">View Customers</Link></li>
                <li><Link to="/create">Create Customer</Link></li>
                <li><Link to="/contracts">View Contracts</Link></li>
                <li><Link to="/contracts/create">Create Contract</Link></li>
              </ul>
            )}
          </div>
        </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/create" element={<CreateCustomer />} />
            <Route path="/edit/:id" element={<UpdateCustomer />} /> 
            <Route path="/contracts" element={<ContractList />} />
            <Route path="/contracts/create" element={<CreateContract />} />
            <Route path="/contracts/edit/:id" element={<EditContract />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
