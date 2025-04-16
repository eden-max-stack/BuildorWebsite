import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import ProfileSetup from './ProfileSetup';
import TechStackRecommender from './TechStackRecommender';
import CodingPlatform from './CodingPlatform';
import CodingPractice from './CodingPractice';
import AddQuestion from './AddQuestion';
import Settings from './Settings';
import { Container } from '@mui/material';
import NewPage from './NewPage';
import Chatbot from './Chatbot';

const App: React.FC = () => {
  return(
    <Container sx = {{ backgroundColor: "transparent", backgroundImage: "none"}}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/register"element={<Register />} />
          <Route path="/login"element={<Login />} />
          <Route path="/dashboard"element={<Dashboard />} />
          <Route path="/profile-setup"element={<ProfileSetup />} />
          <Route path="/tech-stack-recommender"element={<TechStackRecommender />} />
          <Route path="/coding-platform"element={<CodingPlatform />} />
          <Route path="/coding-practice" element={<CodingPractice />} />
          <Route path="/coding-practice/:problemId" element={<CodingPractice />} />
          <Route path="/coding-practice/add-question" element={<AddQuestion />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile-setup" element={<ProfileSetup />} /> 
          <Route path="/chatbot" element={<Chatbot />} /> 
          
        </Routes>
      </Router>
    </Container>

  );
};

export default App;