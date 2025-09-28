import { Link } from "react-router-dom";
import "../css/Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title"> Customer Management </h1>
      <p className="home-subtitle"> Manage your customers efficiently</p>
      <nav>
        <ul className="home-nav-list">
          <li><Link to="/create" className="home-nav-link">➕ Create New Customer</Link></li>
          <li><Link to="/customers" className="home-nav-link">📋 View Customers</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
