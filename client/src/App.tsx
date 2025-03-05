import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import NavBar from './Navbar';
import Dashboard from './Dashboard';
import ProfileSetup from './ProfileSetup';

const App: React.FC = () => {
  return(
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/register"element={<Register />} />
          <Route path="/login"element={<Login />} />
          <Route path="/dashboard"element={<Dashboard />} />
          <Route path="/profile-setup"element={<ProfileSetup />} />
        </Routes>
      </Router>
    </div>

  );
};

export default App;