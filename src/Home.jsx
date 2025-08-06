import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Our App</h1>
        <p className="home-subtitle">
          Secure authentication made simple. Join thousands of users who trust our platform.
        </p>
        <div className="home-actions">
          <Link to="/login" className="home-button primary">
            Sign In
          </Link>
          <Link to="/signup" className="home-button">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
